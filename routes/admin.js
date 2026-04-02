const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  getAdmin,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  getStats,
  getSiteSettings,
  updateSiteSettings,
  getQuestions,
  updateQuestionStatus,
  deleteQuestion,
  getQuestionStats,
  getKnowledgeEntries,
  insertKnowledge,
  updateKnowledge,
  deleteKnowledge,
} = require('../db/database');
const { auth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  if (username.length > 100 || password.length > 200) {
    return res.status(400).json({ error: 'Input too long' });
  }

  const admin = getAdmin(username);
  const hash = admin
    ? admin.password_hash
    : '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';
  const valid = bcrypt.compareSync(password, hash);

  if (!admin || !valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' },
  );

  return res.json({ token, username: admin.username });
});

router.get('/stats', auth, (_req, res) => {
  res.json(getStats());
});

router.get('/messages', auth, (req, res) => {
  const { status, channel, page = '1', limit = '25' } = req.query;
  const pageNum = Math.max(1, Math.min(Number(page) || 1, 1000));
  const limitNum = Math.max(1, Math.min(Number(limit) || 25, 100));

  const { messages, total } = getMessages({
    status: status || undefined,
    channel: channel || undefined,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  res.json({ messages, total, page: pageNum, limit: limitNum });
});

router.patch('/messages/:id', auth, (req, res) => {
  const { status } = req.body;
  const valid = ['unread', 'read', 'replied', 'archived'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const ok = updateMessageStatus(id, status);
  if (!ok) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json({ success: true });
});

router.delete('/messages/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const ok = deleteMessage(id);
  if (!ok) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json({ success: true });
});

router.get('/site-settings', auth, (_req, res) => {
  res.json(getSiteSettings());
});

router.put('/site-settings', auth, (req, res) => {
  const nextSettings = req.body;

  if (!nextSettings || typeof nextSettings !== 'object' || Array.isArray(nextSettings)) {
    return res.status(400).json({ error: 'Invalid site settings payload' });
  }

  return res.json(updateSiteSettings(nextSettings));
});

/* ── Ocito unanswered questions queue ────────── */

router.get('/ocito-questions/stats', auth, (_req, res) => {
  res.json(getQuestionStats());
});

router.get('/ocito-questions', auth, (req, res) => {
  const { status, page = '1', limit = '25' } = req.query;
  const pageNum = Math.max(1, Math.min(Number(page) || 1, 1000));
  const limitNum = Math.max(1, Math.min(Number(limit) || 25, 100));

  const { questions, total } = getQuestions({
    status: status || undefined,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  res.json({ questions, total, page: pageNum, limit: limitNum });
});

router.patch('/ocito-questions/:id', auth, (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'resolved', 'needs-update', 'needs-followup'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Valid: pending, resolved, needs-update, needs-followup' });
  }

  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const ok = updateQuestionStatus(id, status);
  if (!ok) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json({ success: true });
});

router.delete('/ocito-questions/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const ok = deleteQuestion(id);
  if (!ok) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json({ success: true });
});

/* ── Admin-managed knowledge entries ──────────── */

router.get('/knowledge', auth, (req, res) => {
  const { category } = req.query;
  const entries = getKnowledgeEntries({ category: category || undefined });
  res.json({ entries, total: entries.length });
});

router.post('/knowledge', auth, (req, res) => {
  const { question, answer, category } = req.body;

  if (!question || typeof question !== 'string' || !answer || typeof answer !== 'string') {
    return res.status(400).json({ error: 'Question and answer are required' });
  }
  if (question.length > 500 || answer.length > 2000) {
    return res.status(400).json({ error: 'Content too long' });
  }

  try {
    const id = insertKnowledge({
      question: question.trim(),
      answer: answer.trim(),
      category: (category || 'general').trim().slice(0, 50),
    });
    return res.json({ success: true, id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/knowledge/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { question, answer, category, enabled } = req.body;
  const updates = {};
  if (question !== undefined) updates.question = String(question).trim().slice(0, 500);
  if (answer !== undefined) updates.answer = String(answer).trim().slice(0, 2000);
  if (category !== undefined) updates.category = String(category).trim().slice(0, 50);
  if (enabled !== undefined) updates.enabled = enabled;

  const result = updateKnowledge(id, updates);
  if (!result) return res.status(404).json({ error: 'Not found' });
  return res.json(result);
});

router.delete('/knowledge/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const ok = deleteKnowledge(id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  return res.json({ success: true });
});

module.exports = router;
