const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const { getAdmin, getMessages, updateMessageStatus, deleteMessage, getStats } = require('../db/database');
const { auth, JWT_SECRET } = require('../middleware/auth');

/* ─────────────────────────────────────────────────
   POST /api/admin/login
   • Constant-time comparison via bcrypt (built-in)
   • Generic error message to prevent user enumeration
───────────────────────────────────────────────── */
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

  // Always run bcrypt compare even when user doesn't exist
  // to prevent timing-based user enumeration
  const hash = admin
    ? admin.password_hash
    : '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012'; // dummy hash
  const valid = bcrypt.compareSync(password, hash);

  if (!admin || !valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' },   // shorter session than before (was 24h)
  );

  res.json({ token, username: admin.username });
});

/* ── GET /api/admin/stats ─────────────────── */
router.get('/stats', auth, (_req, res) => {
  res.json(getStats());
});

/* ── GET /api/admin/messages ──────────────── */
router.get('/messages', auth, (req, res) => {
  const { status, channel, page = '1', limit = '25' } = req.query;

  const pageNum  = Math.max(1, Math.min(Number(page) || 1, 1000));
  const limitNum = Math.max(1, Math.min(Number(limit) || 25, 100)); // cap at 100

  const { messages, total } = getMessages({
    status:  status  || undefined,
    channel: channel || undefined,
    limit:   limitNum,
    offset:  (pageNum - 1) * limitNum,
  });
  res.json({ messages, total, page: pageNum, limit: limitNum });
});

/* ── PATCH /api/admin/messages/:id ────────── */
router.patch('/messages/:id', auth, (req, res) => {
  const { status } = req.body;
  const valid = ['unread', 'read', 'replied', 'archived'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  // Validate id is a reasonable number
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) return res.status(400).json({ error: 'Invalid id' });

  const ok = updateMessageStatus(id, status);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

/* ── DELETE /api/admin/messages/:id ───────── */
router.delete('/messages/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id < 1) return res.status(400).json({ error: 'Invalid id' });

  const ok = deleteMessage(id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;
