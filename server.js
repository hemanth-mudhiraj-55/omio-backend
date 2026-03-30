require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const app  = express();
const port = process.env.PORT || 4000;

/* ─────────────────────────────────────────────────
   1. TRUST PROXY — required behind Vercel / Nginx / Cloudflare
      so rate-limiter sees real client IPs, not 127.0.0.1
───────────────────────────────────────────────── */
app.set('trust proxy', 1);

/* ─────────────────────────────────────────────────
   2. HELMET — sets 15+ security HTTP headers in one call
      • Strict-Transport-Security (HSTS)
      • X-Content-Type-Options: nosniff
      • X-Frame-Options: SAMEORIGIN
      • X-XSS-Protection
      • Referrer-Policy
      • removes X-Powered-By
───────────────────────────────────────────────── */
app.use(helmet());

/* ─────────────────────────────────────────────────
   3. CORS — restrict to known origins only
───────────────────────────────────────────────── */
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Fallback origins when env var is empty (dev + production)
if (ALLOWED_ORIGINS.length === 0) {
  ALLOWED_ORIGINS.push(
    'http://localhost:5173',   // Vite dev
    'http://localhost:4173',   // Vite preview
    'https://omio.world',
    'https://www.omio.world',
  );
}

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server (no origin) and whitelisted origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Blocked by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // cache preflight for 24 h
}));

/* ─────────────────────────────────────────────────
   4. BODY PARSING — capped payload size to prevent
      large-body DoS attacks
───────────────────────────────────────────────── */
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

/* ─────────────────────────────────────────────────
   5. GLOBAL RATE LIMITER — 100 reqs per IP per minute
      Mitigates DDoS, brute-force scanning, scraping
───────────────────────────────────────────────── */
app.use(rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 100,              // 100 requests per window
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,  // disable X-RateLimit-*
  message: { error: 'Too many requests — please try again later' },
}));

/* ─────────────────────────────────────────────────
   6. STRICT RATE LIMITERS for sensitive endpoints
───────────────────────────────────────────────── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 login attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts — try again in 15 minutes' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions — please wait a moment' },
});

/* ─────────────────────────────────────────────────
   7. ROUTES — with per-route rate limiters
───────────────────────────────────────────────── */
app.use('/api/contact', contactLimiter, require('./routes/contact'));
app.use('/api/admin/login', authLimiter);
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ─────────────────────────────────────────────────
   8. BLOCK INFO LEAKS — no route listing, no stack traces
───────────────────────────────────────────────── */
app.get('/', (_req, res) => {
  res.json({ service: 'OmiO Backend API', status: 'running' });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler — never leak stack trace or internals
app.use((err, _req, res, _next) => {
  // Log internally but don't expose to client
  if (err.message !== 'Blocked by CORS') {
    console.error('[error]', err.message);
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});

app.listen(port, () => console.log(`OmiO backend running on port ${port}`));
