const express = require('express');
const rateLimit = require('express-rate-limit');
const { generateOcitoReply } = require('../lib/ocito');

const router = express.Router();

const ocitoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests - please try again in a minute.' },
});

router.post('/chat', ocitoLimiter, async (req, res, next) => {
  try {
    const { message, history = [], page = '/', language = 'en' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long' });
    }

    const safeHistory = Array.isArray(history)
      ? history
        .filter((item) => item && typeof item.content === 'string')
        .slice(-8)
      : [];

    const safePage = typeof page === 'string' ? page.slice(0, 200) : '/';
    const safeLang = typeof language === 'string' ? language.slice(0, 5) : 'en';

    const result = await generateOcitoReply(message.trim(), safeHistory, safePage, safeLang);

    return res.json({
      reply: result.reply,
      mode: result.mode,
      intent: result.intent,
      recommendedService: result.recommendedService || null,
      leadScore: result.leadScore || null,
      suggestedContent: result.suggestedContent || [],
      quickActions: result.quickActions || [],
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
