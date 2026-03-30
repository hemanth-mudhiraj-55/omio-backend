const express = require('express');
const router  = express.Router();
const { insertMessage } = require('../db/database');
const { sendContactEmails, getChannelConfig } = require('../lib/mailer');

/* ── Allowed channels — reject anything not on this list ── */
const VALID_CHANNELS = new Set([
  'sales', 'support', 'consulting', 'community',
  'partners', 'media', 'careers', 'general',
]);

/* ── Strip HTML tags to prevent stored XSS ── */
function stripTags(str) {
  return str.replace(/<[^>]*>/g, '');
}

router.post('/', async (req, res) => {
  const { name, email, channel = 'general', subject = '', message } = req.body;

  // --- Required fields ---
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  // --- Length limits (prevent payload abuse) ---
  if (name.length > 200) return res.status(400).json({ error: 'Name is too long' });
  if (email.length > 320) return res.status(400).json({ error: 'Email is too long' });
  if (subject.length > 500) return res.status(400).json({ error: 'Subject is too long' });
  if (message.length > 5000) return res.status(400).json({ error: 'Message is too long (max 5 000 chars)' });

  // --- Email format validation ---
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // --- Channel allow-list ---
  const cleanChannel = channel.trim().toLowerCase();
  if (!VALID_CHANNELS.has(cleanChannel)) {
    return res.status(400).json({ error: 'Invalid contact channel' });
  }

  // --- Sanitize all text inputs ---
  const savedMessage = {
    name:    stripTags(name.trim()),
    email:   email.trim().toLowerCase(),
    channel: cleanChannel,
    subject: stripTags(subject.trim()),
    message: stripTags(message.trim()),
  };

  const id = insertMessage(savedMessage);

  try {
    const mailStatus = await sendContactEmails({ ...savedMessage, id });
    return res.status(201).json({
      success: true,
      id,
      emailSent: mailStatus.enabled,
      inbox: mailStatus.inbox,
    });
  } catch (error) {
    console.error('[contact-email]', error.message);
    const { inbox } = getChannelConfig(savedMessage.channel);
    return res.status(201).json({
      success: true,
      id,
      emailSent: false,
      inbox,
      warning: 'Message saved, but email delivery failed.',
    });
  }
});

module.exports = router;
