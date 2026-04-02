const { getSiteSettings, insertQuestion, getKnowledgeEntries } = require('../db/database');
const {
  siteKnowledge,
  getPageContext,
  getLanguageInstruction,
  matchService,
  detectIntent,
  scoreLead,
  matchContent,
  getQuickActions,
} = require('../data/knowledge');

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5';

/* ── Knowledge block (static company info) ──── */

function buildKnowledgeBlock() {
  const k = siteKnowledge;

  const services = k.services.map((s) => `  - ${s.name}: ${s.description}`).join('\n');

  const contacts = Object.entries(k.contact)
    .map(([, c]) => `  - ${c.email}: ${c.purpose}`)
    .join('\n');

  const faqs = k.faqs.map((f) => `  Q: ${f.question}\n  A: ${f.answer}`).join('\n');

  return [
    '--- COMPANY ---',
    `${k.company.name} (${k.company.legalName})`,
    k.company.description,
    `Website: ${k.company.website}`,
    `HQ: ${k.company.headquarters.address}`,
    `Founded: ${k.company.founded}`,
    '',
    '--- SERVICES ---',
    services,
    '',
    '--- CONTACT CHANNELS ---',
    contacts,
    '',
    '--- CAREERS ---',
    `Work model: ${k.careers.workModel}`,
    `Roles: ${k.careers.roles.join(', ')}`,
    `Apply: ${k.careers.applyEmail}`,
    `Benefits: ${k.careers.benefits.join(', ')}`,
    '',
    '--- FAQ ---',
    faqs,
  ].join('\n');
}

/* ── Admin knowledge block (custom Q&A) ──────── */

function buildAdminKnowledgeBlock() {
  const entries = getKnowledgeEntries({ enabledOnly: true });
  if (entries.length === 0) return '';

  const lines = entries.map((e) => `  Q: ${e.question}\n  A: ${e.answer}`).join('\n');
  return `\n--- CUSTOM KNOWLEDGE (from admin) ---\n${lines}`;
}

/* ── Context block (dynamic per-request) ────── */

function buildContextBlock(page, language) {
  const settings = getSiteSettings();
  const parts = [];

  parts.push('--- LIVE STATS ---');
  for (const item of settings.heroStats) {
    parts.push(`  - ${item.value}${item.suffix || ''} ${item.label}`);
  }

  if (page) {
    parts.push('');
    parts.push('--- PAGE CONTEXT ---');
    parts.push(getPageContext(page));
  }

  const langInstruction = getLanguageInstruction(language);
  if (langInstruction) {
    parts.push('');
    parts.push(langInstruction);
  }

  return parts.join('\n');
}

/* ── Behavior block (service recommender, content concierge, brand) ── */

function buildBehaviorBlock() {
  return `--- BEHAVIOR INSTRUCTIONS ---

SERVICE RECOMMENDER:
When a visitor describes a problem, need, or project:
1. Identify which OmiO service is the best fit.
2. Briefly explain why that service matches their need.
3. End with a clear next action: "explore the service page", "contact sales@omio.world", or "start a project through the chat".
Do not force a recommendation if the question is purely informational.

CONTENT CONCIERGE:
When relevant, mention OmiO blog posts, articles, or case studies that relate to the visitor's question.
Keep content suggestions natural — weave them into your answer rather than listing them separately.
The system will automatically surface clickable content links, so focus on the conversational answer.

BRAND PERSONALITY:
You are Ocito — the AI assistant that represents OmiO Software Solutions.
- Speak with quiet confidence. You are knowledgeable but never pushy.
- Be concise and direct. Respect the visitor's time.
- Use a warm, professional tone — like a senior colleague, not a salesperson.
- When you don't know something, say so honestly and suggest contacting the team.
- Avoid generic chatbot phrases like "Great question!" or "I'd be happy to help!".
- Start responses with substance, not pleasantries.
- For service questions: explain what OmiO does, then suggest next steps.
- For career questions: be encouraging and direct them to careers@omio.world.
- For partnership questions: direct them to partners@omio.world.
- Always sound like you belong to a premium technology company.`;
}

/* ── OpenAI response parser ──────────────────── */

function extractOutputText(payload) {
  const output = Array.isArray(payload.output) ? payload.output : [];
  const textParts = [];

  for (const item of output) {
    if (!Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content.type === 'output_text' && content.text) {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join('\n').trim();
}

/* ── Fallback replies (multilingual) ──────────── */

const FALLBACK_REPLIES = {
  en: {
    careers: 'OmiO is always looking for talented engineers and specialists. Send your CV and a note about what you are looking for to careers@omio.world — the team reads every application.',
    project: 'OmiO delivers software engineering, AI systems, and cloud infrastructure for businesses that want serious technical execution. For project conversations, reach out to sales@omio.world — responses come within one business day.',
    about: 'OmiO Software Solutions is a technology services company that builds software products and AI systems with precision and care. The team covers product engineering, applied AI, cloud infrastructure, and staffing.',
    partner: 'OmiO works with technology and delivery partners whose quality standards match ours. To discuss partnerships, email partners@omio.world.',
    default: 'I can help with OmiO services, careers, partnerships, and project questions. For anything specific, the team is reachable at hello@omio.world.',
  },
  de: {
    careers: 'OmiO sucht immer nach talentierten Ingenieuren und Spezialisten. Senden Sie Ihren Lebenslauf an careers@omio.world — das Team liest jede Bewerbung.',
    project: 'OmiO liefert Software-Engineering, KI-Systeme und Cloud-Infrastruktur. Für Projektgespräche kontaktieren Sie sales@omio.world — Antwort innerhalb eines Werktags.',
    about: 'OmiO Software Solutions ist ein Technologieunternehmen, das Softwareprodukte und KI-Systeme mit Präzision und Sorgfalt entwickelt.',
    partner: 'OmiO arbeitet mit Technologie- und Lieferpartnern zusammen. Für Partnerschaften schreiben Sie an partners@omio.world.',
    default: 'Ich kann bei OmiO-Diensten, Karriere, Partnerschaften und Projektfragen helfen. Das Team ist erreichbar unter hello@omio.world.',
  },
  ja: {
    careers: 'OmiOでは優秀なエンジニアやスペシャリストを常に募集しています。履歴書をcareers@omio.worldまでお送りください。',
    project: 'OmiOはソフトウェアエンジニアリング、AIシステム、クラウドインフラを提供しています。プロジェクトのご相談はsales@omio.worldまでご連絡ください。',
    about: 'OmiO Software Solutionsは、精密さと配慮をもってソフトウェア製品とAIシステムを構築するテクノロジーサービス企業です。',
    partner: 'OmiOは品質基準を共有するパートナーと協力しています。パートナーシップについてはpartners@omio.worldまでご連絡ください。',
    default: 'OmiOのサービス、キャリア、パートナーシップ、プロジェクトに関するご質問にお答えします。hello@omio.worldまでお問い合わせください。',
  },
  pl: {
    careers: 'OmiO zawsze poszukuje utalentowanych inżynierów i specjalistów. Wyślij swoje CV na careers@omio.world — zespół czyta każde zgłoszenie.',
    project: 'OmiO dostarcza inżynierię oprogramowania, systemy AI i infrastrukturę chmurową. W sprawie projektów skontaktuj się z sales@omio.world.',
    about: 'OmiO Software Solutions to firma technologiczna, która buduje produkty software i systemy AI z precyzją i starannością.',
    partner: 'OmiO współpracuje z partnerami technologicznymi i dostawczymi. W sprawie partnerstw napisz na partners@omio.world.',
    default: 'Mogę pomóc z usługami OmiO, karierą, partnerstwami i pytaniami o projekty. Zespół jest dostępny pod hello@omio.world.',
  },
  uk: {
    careers: 'OmiO завжди шукає талановитих інженерів та спеціалістів. Надішліть своє резюме на careers@omio.world — команда читає кожну заявку.',
    project: 'OmiO надає послуги з розробки програмного забезпечення, AI-систем та хмарної інфраструктури. Для обговорення проектів зверніться до sales@omio.world.',
    about: 'OmiO Software Solutions — технологічна компанія, яка створює програмні продукти та AI-системи з точністю та увагою до деталей.',
    partner: 'OmiO співпрацює з технологічними партнерами. Для обговорення партнерства напишіть на partners@omio.world.',
    default: 'Я можу допомогти з послугами OmiO, кар\'єрою, партнерством та питаннями про проекти. Команда доступна за адресою hello@omio.world.',
  },
};

function buildFallbackReply(message, language = 'en') {
  const lower = message.toLowerCase();
  const replies = FALLBACK_REPLIES[language] || FALLBACK_REPLIES.en;

  if (/(job|career|intern|internship|freelance|hiring|role|arbeit|仕事|praca|робота)/.test(lower)) {
    return replies.careers;
  }
  if (/(project|work with|hire|collaborate|build|service|quote|proposal|projekt|プロジェクト|проект)/.test(lower)) {
    return replies.project;
  }
  if (/(what do you do|about|company|omio|unternehmen|会社|firma|компанія)/.test(lower)) {
    return replies.about;
  }
  if (/(partner|partnership|collaborate|referral)/.test(lower)) {
    return replies.partner;
  }
  return replies.default;
}

/* ── Main reply generator ────────────────────── */

async function generateOcitoReply(message, history = [], page = '/', language = 'en') {
  const settings = getSiteSettings();
  const knowledgeBlock = buildKnowledgeBlock();
  const contextBlock = buildContextBlock(page, language);
  const behaviorBlock = buildBehaviorBlock();
  const adminKnowledge = buildAdminKnowledgeBlock();
  const systemPrompt = `${settings.aiBot.systemPrompt}\n\n${knowledgeBlock}${adminKnowledge}\n\n${contextBlock}\n\n${behaviorBlock}`;

  // Detect intent, match service, score lead, match content, quick actions
  const intent = detectIntent(message);
  const recommendedService = matchService(message);
  const leadScore = scoreLead(message, history);
  const suggestedContent = matchContent(message, page);
  const quickActions = getQuickActions(page, intent, recommendedService);

  if (!process.env.OPENAI_API_KEY) {
    const reply = buildFallbackReply(message, language);

    // Store as unanswered question
    insertQuestion({
      question: message,
      reply,
      page,
      language,
      mode: 'fallback',
      intent,
      leadLabel: leadScore.label,
    });

    return {
      reply,
      mode: 'fallback',
      intent,
      recommendedService,
      leadScore,
      suggestedContent,
      quickActions,
    };
  }

  const input = [
    ...history.slice(-6).map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: [{ type: 'input_text', text: String(item.content || '') }],
    })),
    {
      role: 'user',
      content: [{ type: 'input_text', text: message }],
    },
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: systemPrompt,
        input,
        max_output_tokens: 500,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      const errorMessage = payload?.error?.message || 'OpenAI request failed';
      throw new Error(errorMessage);
    }

    const reply = extractOutputText(payload);

    if (!reply) {
      // Empty response — treat as unanswered
      const fallback = buildFallbackReply(message, language);
      insertQuestion({
        question: message,
        reply: fallback,
        page,
        language,
        mode: 'empty-response',
        intent,
        leadLabel: leadScore.label,
      });

      return {
        reply: fallback,
        mode: 'fallback',
        intent,
        recommendedService,
        leadScore,
        suggestedContent,
      };
    }

    return {
      reply,
      mode: 'openai',
      intent,
      recommendedService,
      leadScore,
      suggestedContent,
      quickActions,
    };
  } catch (_error) {
    const fallback = buildFallbackReply(message);

    insertQuestion({
      question: message,
      reply: fallback,
      page,
      language,
      mode: 'error-fallback',
      intent,
      leadLabel: leadScore.label,
    });

    return {
      reply: fallback,
      mode: 'fallback',
      intent,
      recommendedService,
      leadScore,
      suggestedContent,
      quickActions,
    };
  }
}

module.exports = {
  generateOcitoReply,
};
