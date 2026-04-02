const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const MAX_MESSAGES = 10000;
const MAX_QUESTIONS = 5000;
const MAX_KNOWLEDGE = 500;

const DEFAULT_SITE_SETTINGS = {
  heroStats: [
    { id: 'projects', value: 20, suffix: '+', label: 'Projects' },
    { id: 'countries', value: 5, suffix: '+', label: 'Expanding business in countries' },
    { id: 'availability', value: 24, suffix: '/7', label: 'Services' },
  ],
  aboutPage: {
    eyebrow: 'About OmiO',
    title: 'Software built with intention',
    description:
      'OmiO Software Solutions is a technology startup providing software development, AI benchmarking, AI agent evaluation, and custom technology solutions for businesses worldwide.',
    missionTitle: 'Helping ambitious teams build reliable intelligent systems',
    missionBody:
      'We focus on turning ideas into production-ready software with strong engineering discipline, calm execution, and practical business thinking.',
    missionBody2:
      'From product engineering to AI evaluation workflows, our team works closely with founders and businesses that want dependable long-term partners.',
    workTitle: 'How we work',
    workBody:
      'We operate with a startup mindset: fast feedback, transparent communication, and delivery cycles designed to keep momentum high without sacrificing quality.',
    workBody2:
      'Every engagement is shaped around real needs, measurable outcomes, and collaboration that keeps everyone aligned from planning through launch.',
    ctaTitle: 'Ready to build with OmiO?',
    ctaText:
      'If you want to launch a product, improve an AI workflow, or collaborate on a custom technology solution, let us start the conversation.',
    values: [
      {
        title: 'Craft over shortcuts',
        description: 'We build software carefully, with decisions designed to stay useful long after launch.',
      },
      {
        title: 'Honest communication',
        description: 'We share progress, risks, and tradeoffs early so teams can make strong decisions with confidence.',
      },
      {
        title: 'Outcome-driven delivery',
        description: 'Success is measured by business impact, not just by shipping code.',
      },
      {
        title: 'Continuous learning',
        description: 'We keep adapting through research, experimentation, and active improvement.',
      },
      {
        title: 'Respectful collaboration',
        description: 'The best work happens when people can contribute openly across roles and disciplines.',
      },
      {
        title: 'Sustainable pace',
        description: 'Healthy teams build better products, so we aim for consistency instead of chaos.',
      },
    ],
    expertise: [
      {
        title: 'Software Development',
        description: 'Web and mobile solutions designed for speed, clarity, and reliable delivery.',
      },
      {
        title: 'AI Benchmarking',
        description: 'Measurement systems that help teams understand model quality and product readiness.',
      },
      {
        title: 'AI Agent Evaluation',
        description: 'Structured evaluation flows for assistants, agents, and automation systems in production.',
      },
      {
        title: 'Custom Technology Solutions',
        description: 'Tailored engineering partnerships for businesses that need focused technical execution.',
      },
    ],
  },
  aiBot: {
    name: 'Ocito',
    greeting: "I'm Ocito, OmiO's AI assistant. Whether you're exploring services, considering a project, or looking at careers — I can help you find what you need.",
    summary:
      'Ocito is a premium AI assistant that represents OmiO Software Solutions — helping visitors discover services, explore career opportunities, and start project conversations with clarity and confidence.',
    systemPrompt: `You are Ocito, the AI assistant built into the OmiO Software Solutions website.

You represent a premium technology services company. Your communication style reflects that — clear, confident, and respectful of people's time.

Core responsibilities:
- Help visitors understand OmiO's services and find the right fit for their needs
- Guide potential clients toward starting a project or contacting the sales team
- Provide accurate information about careers, culture, and open positions
- Surface relevant content (blogs, articles, case studies) when it adds value
- Direct partnership inquiries to partners@omio.world
- Be honest when you don't have an answer — suggest contacting the team directly

Communication style:
- Lead with substance, not pleasantries
- Be concise — two clear sentences are better than a long paragraph
- Sound like a knowledgeable colleague, not a customer service bot
- Never use filler phrases like "Great question!" or "I'd be happy to help!"
- When recommending a service, briefly explain why it fits before suggesting next steps
- For careers: be direct and encouraging, point to careers@omio.world
- For projects: understand the need, recommend the right service, suggest contacting sales@omio.world

Contact routing:
- Projects and sales: sales@omio.world
- Technical support: support@omio.world
- AI consulting: consulting@omio.world
- Partnerships: partners@omio.world
- Careers: careers@omio.world
- General: hello@omio.world`,
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeDb(data) {
  return {
    messages: Array.isArray(data.messages) ? data.messages : [],
    admins: Array.isArray(data.admins) ? data.admins : [],
    ocitoQuestions: Array.isArray(data.ocitoQuestions) ? data.ocitoQuestions : [],
    knowledgeEntries: Array.isArray(data.knowledgeEntries) ? data.knowledgeEntries : [],
    siteSettings: {
      ...clone(DEFAULT_SITE_SETTINGS),
      ...(data.siteSettings || {}),
      heroStats: Array.isArray(data.siteSettings?.heroStats)
        ? data.siteSettings.heroStats
        : clone(DEFAULT_SITE_SETTINGS.heroStats),
      aboutPage: {
        ...clone(DEFAULT_SITE_SETTINGS.aboutPage),
        ...(data.siteSettings?.aboutPage || {}),
        values: Array.isArray(data.siteSettings?.aboutPage?.values)
          ? data.siteSettings.aboutPage.values
          : clone(DEFAULT_SITE_SETTINGS.aboutPage.values),
        expertise: Array.isArray(data.siteSettings?.aboutPage?.expertise)
          ? data.siteSettings.aboutPage.expertise
          : clone(DEFAULT_SITE_SETTINGS.aboutPage.expertise),
      },
      aiBot: {
        ...clone(DEFAULT_SITE_SETTINGS.aiBot),
        ...(data.siteSettings?.aiBot || {}),
      },
    },
    _seq: {
      messages: Number(data._seq?.messages) || 1,
      admins: Number(data._seq?.admins) || 1,
      ocitoQuestions: Number(data._seq?.ocitoQuestions) || 1,
      knowledgeEntries: Number(data._seq?.knowledgeEntries) || 1,
    },
  };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    return normalizeDb({});
  }

  try {
    return normalizeDb(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
  } catch {
    console.error('[db] Corrupt db.json - starting fresh');
    return normalizeDb({});
  }
}

function save(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

function insertMessage({ name, email, channel, subject, message }) {
  const db = load();

  if (db.messages.length >= MAX_MESSAGES) {
    throw new Error('Message store is full');
  }

  const id = db._seq.messages++;
  db.messages.push({
    id,
    name,
    email,
    channel: channel || 'general',
    subject: subject || '',
    message,
    status: 'unread',
    created_at: new Date().toISOString(),
  });
  save(db);
  return id;
}

function getMessages({ status, channel, limit = 25, offset = 0 } = {}) {
  const { messages } = load();
  let list = [...messages];
  if (status) list = list.filter((message) => message.status === status);
  if (channel) list = list.filter((message) => message.channel === channel);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { messages: list.slice(offset, offset + limit), total: list.length };
}

function updateMessageStatus(id, status) {
  const db = load();
  const message = db.messages.find((item) => item.id === Number(id));
  if (!message) return false;
  message.status = status;
  save(db);
  return true;
}

function deleteMessage(id) {
  const db = load();
  const index = db.messages.findIndex((item) => item.id === Number(id));
  if (index === -1) return false;
  db.messages.splice(index, 1);
  save(db);
  return true;
}

function getStats() {
  const { messages } = load();
  const counts = { total: messages.length, unread: 0, read: 0, replied: 0, archived: 0 };
  const channels = {};

  for (const message of messages) {
    if (counts[message.status] !== undefined) counts[message.status] += 1;
    channels[message.channel] = (channels[message.channel] || 0) + 1;
  }

  const byChannel = Object.entries(channels)
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);

  return { ...counts, byChannel };
}

function adminCount() {
  return load().admins.length;
}

function getAdmin(username) {
  if (typeof username !== 'string') return null;
  return load().admins.find((admin) => admin.username === username) || null;
}

function insertAdmin({ username, password_hash }) {
  const db = load();
  const id = db._seq.admins++;
  db.admins.push({ id, username, password_hash, created_at: new Date().toISOString() });
  save(db);
  return id;
}

function getSiteSettings() {
  return clone(load().siteSettings);
}

function updateSiteSettings(nextSettings) {
  const db = load();
  db.siteSettings = normalizeDb({ siteSettings: nextSettings }).siteSettings;
  save(db);
  return clone(db.siteSettings);
}

/* ── Ocito unanswered questions ─────────────── */

function insertQuestion({ question, reply, page, language, mode, intent, leadLabel }) {
  const db = load();

  if (db.ocitoQuestions.length >= MAX_QUESTIONS) {
    // Drop oldest resolved to make room
    const idx = db.ocitoQuestions.findIndex((q) => q.status === 'resolved');
    if (idx !== -1) db.ocitoQuestions.splice(idx, 1);
    else return null; // queue full
  }

  const id = db._seq.ocitoQuestions++;
  db.ocitoQuestions.push({
    id,
    question,
    reply: reply || '',
    page: page || '/',
    language: language || 'en',
    mode: mode || 'fallback',
    intent: intent || 'general',
    leadLabel: leadLabel || 'cold',
    status: 'pending',        // pending | resolved | needs-update | needs-followup
    created_at: new Date().toISOString(),
  });
  save(db);
  return id;
}

function getQuestions({ status, limit = 25, offset = 0 } = {}) {
  const { ocitoQuestions } = load();
  let list = [...ocitoQuestions];
  if (status) list = list.filter((q) => q.status === status);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { questions: list.slice(offset, offset + limit), total: list.length };
}

function updateQuestionStatus(id, status) {
  const db = load();
  const q = db.ocitoQuestions.find((item) => item.id === Number(id));
  if (!q) return false;
  q.status = status;
  save(db);
  return true;
}

function deleteQuestion(id) {
  const db = load();
  const idx = db.ocitoQuestions.findIndex((item) => item.id === Number(id));
  if (idx === -1) return false;
  db.ocitoQuestions.splice(idx, 1);
  save(db);
  return true;
}

function getQuestionStats() {
  const { ocitoQuestions } = load();
  const counts = { total: ocitoQuestions.length, pending: 0, resolved: 0, 'needs-update': 0, 'needs-followup': 0 };
  for (const q of ocitoQuestions) {
    if (counts[q.status] !== undefined) counts[q.status] += 1;
  }
  return counts;
}

/* ── Admin-managed knowledge entries ────────── */

function insertKnowledge({ question, answer, category }) {
  const db = load();
  if (db.knowledgeEntries.length >= MAX_KNOWLEDGE) {
    throw new Error('Knowledge base is full');
  }
  const id = db._seq.knowledgeEntries++;
  db.knowledgeEntries.push({
    id,
    question: question || '',
    answer: answer || '',
    category: category || 'general',
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  save(db);
  return id;
}

function getKnowledgeEntries({ category, enabledOnly = false } = {}) {
  const { knowledgeEntries } = load();
  let list = [...knowledgeEntries];
  if (category) list = list.filter((e) => e.category === category);
  if (enabledOnly) list = list.filter((e) => e.enabled);
  list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return list;
}

function updateKnowledge(id, updates) {
  const db = load();
  const entry = db.knowledgeEntries.find((e) => e.id === Number(id));
  if (!entry) return null;
  if (updates.question !== undefined) entry.question = updates.question;
  if (updates.answer !== undefined) entry.answer = updates.answer;
  if (updates.category !== undefined) entry.category = updates.category;
  if (updates.enabled !== undefined) entry.enabled = Boolean(updates.enabled);
  entry.updated_at = new Date().toISOString();
  save(db);
  return clone(entry);
}

function deleteKnowledge(id) {
  const db = load();
  const idx = db.knowledgeEntries.findIndex((e) => e.id === Number(id));
  if (idx === -1) return false;
  db.knowledgeEntries.splice(idx, 1);
  save(db);
  return true;
}

module.exports = {
  adminCount,
  DEFAULT_SITE_SETTINGS,
  deleteKnowledge,
  deleteMessage,
  deleteQuestion,
  getAdmin,
  getKnowledgeEntries,
  getMessages,
  getQuestions,
  getQuestionStats,
  getSiteSettings,
  getStats,
  insertAdmin,
  insertKnowledge,
  insertMessage,
  insertQuestion,
  updateKnowledge,
  updateMessageStatus,
  updateQuestionStatus,
  updateSiteSettings,
};
