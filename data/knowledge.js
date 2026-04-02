const siteKnowledge = {
  company: {
    name: 'OmiO Software Solutions',
    legalName: 'OmiO Solutions Ltd.',
    founded: 2026,
    description:
      'Technology startup providing software development, AI benchmarking, AI agent evaluation, and custom technology solutions for businesses worldwide.',
    website: 'https://omio.world',
    primaryEmail: 'hello@omio.world',
    headquarters: {
      address: 'Uppal, Hyderabad, Telangana 500039, India',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
  },

  contact: {
    sales: {
      email: 'sales@omio.world',
      purpose: 'Project conversations, service packages, engagement models',
    },
    technicalSupport: {
      email: 'support@omio.world',
      purpose: 'Active projects, technical blockers, delivery questions',
    },
    consulting: {
      email: 'consulting@omio.world',
      purpose: 'Architecture reviews, AI readiness assessments, code audits',
    },
    community: {
      email: 'community@omio.world',
      purpose: 'Builder network, knowledge sharing, collaboration',
    },
    partnerships: {
      email: 'partners@omio.world',
      purpose: 'Co-delivery, technology integrations, referral partnerships',
    },
    media: {
      email: 'media@omio.world',
      purpose: 'Press, interviews, speaking opportunities',
    },
    careers: {
      email: 'careers@omio.world',
      purpose: 'Applications, CVs, internship enquiries',
    },
    general: {
      email: 'hello@omio.world',
      purpose: 'Everything else',
    },
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/omio-software-solutions/',
    instagram: 'https://www.instagram.com/omio_software_solutions/',
    twitter: 'https://x.com/OmiOSoftwareSol',
    facebook:
      'https://www.facebook.com/people/OmiO-Software-Solutions/61576494333639/',
  },

  services: [
    {
      name: 'Web Development',
      path: '/services/web-development',
      description: 'Custom web platforms, React, Next.js, TypeScript, Node.js, Python, Go.',
      keywords: ['web', 'website', 'frontend', 'backend', 'react', 'next.js', 'node', 'python', 'go', 'typescript', 'full-stack', 'fullstack', 'web app', 'web application', 'portal', 'dashboard', 'saas', 'platform'],
    },
    {
      name: 'Mobile Development',
      path: '/services/mobile-development',
      description: 'iOS and Android, React Native, Flutter, Swift, Kotlin.',
      keywords: ['mobile', 'ios', 'android', 'app', 'react native', 'flutter', 'swift', 'kotlin', 'mobile app', 'phone', 'tablet'],
    },
    {
      name: 'Cloud, DevOps & Custom Integration',
      path: '/services/cloud-devops-custom-integration',
      description: 'CI/CD, Terraform, Kubernetes, AWS/GCP/Azure.',
      keywords: ['cloud', 'devops', 'ci/cd', 'aws', 'azure', 'gcp', 'terraform', 'kubernetes', 'docker', 'infrastructure', 'deployment', 'pipeline', 'integration', 'api', 'microservices', 'serverless'],
    },
    {
      name: 'AI Agent Evaluation & Benchmarking',
      path: '/services/ai-agent-evaluation-benchmarking',
      description: 'LLM-as-judge, red-teaming, regression tracking.',
      keywords: ['evaluation', 'benchmark', 'benchmarking', 'llm judge', 'red team', 'red-team', 'testing ai', 'evaluate', 'ai quality', 'model quality', 'ai testing', 'prompt testing'],
    },
    {
      name: 'Enterprise AI Agents',
      path: '/services/enterprise-ai-agents',
      description: 'Multi-agent orchestration, RAG, human-in-the-loop.',
      keywords: ['ai agent', 'enterprise ai', 'chatbot', 'rag', 'retrieval', 'multi-agent', 'orchestration', 'automation', 'ai workflow', 'llm', 'gpt', 'claude', 'ai assistant', 'intelligent automation'],
    },
    {
      name: 'Agent Readiness & Risk Assessment',
      path: '/services/agent-readiness-risk-assessment',
      description: 'Governance reviews, compliance, risk mapping.',
      keywords: ['risk', 'readiness', 'assessment', 'governance', 'compliance', 'audit', 'ai safety', 'responsible ai', 'ai risk', 'regulation', 'policy'],
    },
    {
      name: 'Continuous Monitoring & Regression Testing',
      path: '/services/continuous-monitoring-regression-testing',
      description: 'Quality dashboards, drift detection, canary pipelines.',
      keywords: ['monitoring', 'regression', 'quality', 'drift', 'canary', 'observability', 'alerting', 'production monitoring', 'testing', 'qa', 'quality assurance'],
    },
    {
      name: 'Supervised Fine-Tuning (SFT) & RLHF',
      path: '/services/sft-rlhf',
      description: 'Dataset curation, preference tuning, domain adaptation.',
      keywords: ['fine-tuning', 'fine tuning', 'rlhf', 'sft', 'training', 'model training', 'dataset', 'alignment', 'dpo', 'preference', 'domain adaptation', 'custom model'],
    },
    {
      name: 'Staffing',
      path: '/services/staffing',
      description: 'Senior engineers, ML engineers, DevOps, tech leads, flexible engagement.',
      keywords: ['staffing', 'hire', 'engineer', 'developer', 'team', 'augmentation', 'contractor', 'freelance', 'talent', 'resource', 'outsource', 'nearshore', 'offshore'],
    },
  ],

  contentCatalog: [
    {
      title: 'Enterprise AI & Automation: Complete Guide',
      path: '/insights/blogs/enterprise-ai-and-automation',
      type: 'blog',
      keywords: ['ai agent', 'automation', 'enterprise ai', 'llm', 'digital transformation', 'ai workflow'],
    },
    {
      title: 'AI Benchmarking & Agent Evaluation',
      path: '/insights/blogs/ai-benchmarking-and-agent-evaluation',
      type: 'blog',
      keywords: ['benchmark', 'evaluation', 'ai quality', 'llm judge', 'red team', 'testing'],
    },
    {
      title: 'Web Development',
      path: '/insights/blogs/web-development',
      type: 'blog',
      keywords: ['web', 'frontend', 'backend', 'react', 'javascript', 'development'],
    },
    {
      title: 'What is OmiO?',
      path: '/insights/articles/what-is-omio',
      type: 'article',
      keywords: ['omio', 'company', 'about', 'what', 'who', 'overview', 'services'],
    },
    {
      title: 'Software Company Startups in India',
      path: '/insights/articles/software-company-startups-in-india',
      type: 'article',
      keywords: ['startup', 'india', 'software company', 'founder', 'market'],
    },
    {
      title: 'How to Choose a Software Development Company',
      path: '/insights/articles/how-to-choose-a-software-development-company',
      type: 'article',
      keywords: ['choose', 'select', 'vendor', 'partner', 'software company', 'outsource', 'hiring'],
    },
    {
      title: 'What Makes a Software Startup Succeed Globally',
      path: '/insights/articles/what-makes-a-software-startup-succeed-globally',
      type: 'article',
      keywords: ['startup', 'global', 'scale', 'success', 'growth', 'international'],
    },
    {
      title: 'OmiO Solutions: Services & Approach',
      path: '/insights/articles/omio-solutions-services-and-approach',
      type: 'article',
      keywords: ['omio', 'services', 'approach', 'delivery', 'methodology'],
    },
    {
      title: 'Case Studies',
      path: '/insights/case-studies',
      type: 'case-study',
      keywords: ['case study', 'project', 'result', 'outcome', 'client', 'success', 'portfolio', 'work'],
    },
  ],

  careers: {
    workModel: 'Remote-first, distributed across Europe, Asia, and North America.',
    roles: [
      'Full-stack engineers',
      'ML engineers',
      'AI safety specialists',
      'DevOps engineers',
      'Technical account leads',
    ],
    applyEmail: 'careers@omio.world',
    benefits: [
      'Competitive pay',
      'Learning budget',
      'Flexible hours',
      'Home office stipend',
      'Health coverage',
      'Generous leave',
    ],
    values: [
      'Craft over shortcuts',
      'Honest communication',
      'Outcome-driven delivery',
      'Continuous learning',
    ],
  },

  faqs: [
    {
      question: 'What does OmiO do?',
      answer:
        'OmiO Software Solutions provides enterprise-grade software development, AI agent evaluation and benchmarking, cloud DevOps, and staffing services.',
    },
    {
      question: 'How can I start a project with OmiO?',
      answer:
        'Email sales@omio.world with your requirements. We respond within one business day.',
    },
    {
      question: 'Does OmiO offer internships?',
      answer:
        "Yes. Send your CV and a note about what you're looking for to careers@omio.world.",
    },
    {
      question: 'Where is OmiO located?',
      answer:
        'HQ in Hyderabad, India. The team is distributed globally (Europe, Asia, North America) and works remote-first.',
    },
    {
      question: 'What technologies does OmiO use?',
      answer:
        'React, Next.js, TypeScript, Node.js, Python, Go, Flutter, React Native, Swift, Kotlin, Terraform, Kubernetes, AWS, GCP, Azure.',
    },
    {
      question: 'Does OmiO do AI consulting?',
      answer:
        'Yes. We offer AI readiness assessments, agent evaluation, benchmarking, RLHF, and enterprise AI agent development. Contact consulting@omio.world.',
    },
    {
      question: 'How does OmiO handle pricing?',
      answer:
        "Pricing depends on project scope and engagement model. Contact sales@omio.world for a conversation — we don't publish fixed rates.",
    },
    {
      question: 'Can I partner with OmiO?',
      answer:
        'Yes. Email partners@omio.world to discuss co-delivery, technology integrations, or referral arrangements.',
    },
  ],
};

function getPageContext(path) {
  const normalized = (path || '/').replace(/\/+$/, '') || '/';

  const serviceMap = {};
  for (const service of siteKnowledge.services) {
    serviceMap[service.path] = service;
  }

  const matchedService = serviceMap[normalized];
  if (matchedService) {
    return `The visitor is currently viewing the ${matchedService.name} service page. This page is about ${matchedService.description}`;
  }

  const pageMap = {
    '/': 'The visitor is currently viewing the Home page. This page introduces OmiO Software Solutions, highlights core services, and provides quick navigation to key sections.',

    '/insights/case-studies': 'The visitor is currently viewing the Case Studies page. This page showcases real-world project outcomes and client success stories.',
    '/insights/blogs': 'The visitor is currently viewing the Blogs page. This page features articles on technology, AI, and industry trends.',
    '/insights/articles': 'The visitor is currently viewing the Articles page. This page contains in-depth technical and thought-leadership articles.',

    '/careers/life-at-omio': 'The visitor is currently viewing the Life at OmiO page. This page describes the company culture, remote-first work model, and team values.',
    '/careers/open-positions': 'The visitor is currently viewing the Open Positions page. This page lists current job openings at OmiO.',
    '/careers/benefits': 'The visitor is currently viewing the Benefits page. This page details employee benefits including competitive pay, learning budgets, flexible hours, and health coverage.',
    '/careers/professional-development': 'The visitor is currently viewing the Professional Development page. This page covers growth opportunities, learning resources, and career advancement at OmiO.',

    '/about/who-we-are': 'The visitor is currently viewing the Who We Are page. This page provides an overview of OmiO, its mission, and founding story.',
    '/about/leadership': 'The visitor is currently viewing the Leadership page. This page introduces the OmiO leadership team.',
    '/about/partners': 'The visitor is currently viewing the Partners page. This page highlights OmiO technology and business partnerships.',
    '/about/location': 'The visitor is currently viewing the Location page. This page shows OmiO headquarters in Hyderabad, India, and global team distribution.',

    '/contact': 'The visitor is currently viewing the Contact page. This page provides all contact channels, email addresses, and a contact form to reach the OmiO team.',

    '/omio-solutions': 'The visitor is currently viewing the OmiO Solutions overview page. This page provides a comprehensive look at all OmiO service offerings and capabilities.',
  };

  if (pageMap[normalized]) {
    return pageMap[normalized];
  }

  if (normalized.startsWith('/services')) {
    return 'The visitor is currently browsing the Services section. OmiO offers web development, mobile development, cloud DevOps, AI evaluation, enterprise AI agents, and more.';
  }
  if (normalized.startsWith('/insights')) {
    return 'The visitor is currently browsing the Insights section, which includes case studies, blogs, and articles.';
  }
  if (normalized.startsWith('/careers')) {
    return 'The visitor is currently browsing the Careers section. OmiO is a remote-first company hiring engineers, ML specialists, and technical leads.';
  }
  if (normalized.startsWith('/about')) {
    return 'The visitor is currently browsing the About section, which covers the OmiO team, leadership, partners, and location.';
  }

  return 'The visitor is browsing the OmiO website.';
}

function getLanguageInstruction(langCode) {
  const instructions = {
    en: '',
    de: 'IMPORTANT: Respond in German (Deutsch). The visitor has selected German as their language.',
    ja: 'IMPORTANT: Respond in Japanese (\u65E5\u672C\u8A9E). The visitor has selected Japanese as their language.',
    pl: 'IMPORTANT: Respond in Polish (Polski). The visitor has selected Polish as their language.',
    uk: 'IMPORTANT: Respond in Ukrainian (\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430). The visitor has selected Ukrainian as their language.',
  };

  return instructions[langCode] || '';
}

/**
 * Match user message against service keywords.
 * Returns the best-matching service or null.
 */
function matchService(message) {
  const lower = message.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const service of siteKnowledge.services) {
    let score = 0;
    for (const kw of service.keywords) {
      if (lower.includes(kw)) score += kw.split(' ').length; // multi-word keywords score higher
    }
    if (score > bestScore) {
      bestScore = score;
      best = service;
    }
  }

  return bestScore > 0 ? { name: best.name, path: best.path, description: best.description } : null;
}

/**
 * Detect visitor intent from message text.
 */
function detectIntent(message) {
  const lower = message.toLowerCase();

  if (/(job|career|intern|internship|freelance|hiring|role|apply|resume|cv|position|vacancy)/.test(lower)) {
    return 'careers';
  }
  if (/(project|build|develop|create|launch|proposal|quote|budget|timeline|engage|contract|pricing|cost|price)/.test(lower)) {
    return 'project';
  }
  if (/(collaborate|partner|partnership|referral|co-deliver|integrate)/.test(lower)) {
    return 'partnership';
  }
  if (/(support|help|issue|bug|problem|broken|fix|error|ticket)/.test(lower)) {
    return 'support';
  }
  if (/(service|offer|capability|solution|what do you|can you|do you)/.test(lower)) {
    return 'services';
  }
  return 'general';
}

/**
 * Score a lead based on message signals.
 * Returns { label, signals }.
 */
function scoreLead(message, history = []) {
  const lower = message.toLowerCase();
  const fullText = [lower, ...history.map((h) => (h.content || '').toLowerCase())].join(' ');
  const signals = [];

  // Buying signals
  if (/(budget|timeline|deadline|asap|urgent|immediately|this week|this month|q[1-4])/.test(fullText)) {
    signals.push('urgency');
  }
  if (/(project|build|develop|launch|mvp|prototype|product|platform|migrate)/.test(fullText)) {
    signals.push('project-intent');
  }
  if (/(company|enterprise|organization|team|department|business|startup|firm)/.test(fullText)) {
    signals.push('company-signal');
  }
  if (/(pricing|cost|quote|proposal|engagement|contract|sow|scope)/.test(fullText)) {
    signals.push('commercial-intent');
  }
  if (/(ai agent|fine-tun|rlhf|evaluation|benchmark|devops|cloud|mobile|web dev)/.test(fullText)) {
    signals.push('specific-service');
  }

  // Career signals
  if (/(job|career|intern|apply|resume|cv|hiring|role|position)/.test(fullText)) {
    return { label: 'careers', signals: ['career-intent'] };
  }
  // Support signals
  if (/(support|issue|bug|broken|error|ticket)/.test(fullText)) {
    return { label: 'support', signals: ['support-request'] };
  }

  if (signals.length >= 3) return { label: 'hot', signals };
  if (signals.length >= 1) return { label: 'warm', signals };
  return { label: 'cold', signals };
}

/**
 * Match user message against content catalog.
 * Returns up to 2 matching content items.
 */
function matchContent(message, page = '/') {
  const lower = message.toLowerCase();
  const scored = [];

  for (const item of siteKnowledge.contentCatalog) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) score += kw.split(' ').length;
    }
    // Boost content from the current section
    if (page && item.path.startsWith(page.split('/').slice(0, 3).join('/'))) {
      score += 1;
    }
    if (score > 0) scored.push({ ...item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map(({ score, keywords, ...rest }) => rest);
}

/**
 * Generate quick action buttons based on page, intent, and service match.
 * Returns array of { label, action, path? }
 */
function getQuickActions(page = '/', intent, recommendedService) {
  const normalized = (page || '/').replace(/\/+$/, '') || '/';
  const actions = [];

  // Intent-driven actions
  if (intent === 'project') {
    actions.push({ label: 'Start a project', action: 'lead-form' });
    if (recommendedService) {
      actions.push({ label: `Explore ${recommendedService.name}`, action: 'navigate', path: recommendedService.path });
    }
    actions.push({ label: 'Talk to the team', action: 'navigate', path: '/contact' });
  } else if (intent === 'careers') {
    actions.push({ label: 'Apply now', action: 'navigate', path: '/careers/open-positions' });
    actions.push({ label: 'Life at OmiO', action: 'navigate', path: '/careers/life-at-omio' });
    actions.push({ label: 'See benefits', action: 'navigate', path: '/careers/benefits' });
  } else if (intent === 'partnership') {
    actions.push({ label: 'Talk to the team', action: 'navigate', path: '/contact' });
    actions.push({ label: 'View partners', action: 'navigate', path: '/about/partners' });
  } else if (intent === 'services') {
    if (recommendedService) {
      actions.push({ label: `Explore ${recommendedService.name}`, action: 'navigate', path: recommendedService.path });
    }
    actions.push({ label: 'Start a project', action: 'lead-form' });
    actions.push({ label: 'Read a case study', action: 'navigate', path: '/insights/case-studies' });
  } else {
    // Page-aware defaults
    if (normalized.startsWith('/services')) {
      actions.push({ label: 'Start a project', action: 'lead-form' });
      actions.push({ label: 'Read a case study', action: 'navigate', path: '/insights/case-studies' });
    } else if (normalized.startsWith('/careers')) {
      actions.push({ label: 'Apply now', action: 'navigate', path: '/careers/open-positions' });
      actions.push({ label: 'See benefits', action: 'navigate', path: '/careers/benefits' });
    } else if (normalized.startsWith('/insights')) {
      actions.push({ label: 'Start a project', action: 'lead-form' });
      actions.push({ label: 'Explore services', action: 'navigate', path: '/services/cloud-devops-custom-integration' });
    } else if (normalized === '/contact') {
      actions.push({ label: 'Start a project', action: 'lead-form' });
    } else {
      actions.push({ label: 'Explore services', action: 'navigate', path: '/services/cloud-devops-custom-integration' });
      actions.push({ label: 'Talk to the team', action: 'navigate', path: '/contact' });
    }
  }

  // Cap at 3 actions
  return actions.slice(0, 3);
}

module.exports = {
  siteKnowledge,
  getPageContext,
  getLanguageInstruction,
  matchService,
  detectIntent,
  scoreLead,
  matchContent,
  getQuickActions,
};
