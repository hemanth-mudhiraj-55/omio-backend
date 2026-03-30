const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE  = path.join(DATA_DIR, 'db.json');

/* ── Max records to prevent unbounded growth ── */
const MAX_MESSAGES = 10000;

function load() {
  if (!fs.existsSync(DB_FILE)) {
    return { messages: [], admins: [], _seq: { messages: 1, admins: 1 } };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    console.error('[db] Corrupt db.json — starting fresh');
    return { messages: [], admins: [], _seq: { messages: 1, admins: 1 } };
  }
}

function save(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // Atomic write: write to temp file then rename (prevents corruption on crash)
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

/* ── Messages ──────────────────────────── */

function insertMessage({ name, email, channel, subject, message }) {
  const db = load();

  // Prevent database bloat — a form of resource exhaustion
  if (db.messages.length >= MAX_MESSAGES) {
    throw new Error('Message store is full');
  }

  const id = db._seq.messages++;
  db.messages.push({
    id, name, email,
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
  if (status)  list = list.filter(m => m.status  === status);
  if (channel) list = list.filter(m => m.channel === channel);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { messages: list.slice(offset, offset + limit), total: list.length };
}

function updateMessageStatus(id, status) {
  const db = load();
  const msg = db.messages.find(m => m.id === Number(id));
  if (!msg) return false;
  msg.status = status;
  save(db);
  return true;
}

function deleteMessage(id) {
  const db = load();
  const idx = db.messages.findIndex(m => m.id === Number(id));
  if (idx === -1) return false;
  db.messages.splice(idx, 1);
  save(db);
  return true;
}

function getStats() {
  const { messages } = load();
  const counts = { total: messages.length, unread: 0, read: 0, replied: 0, archived: 0 };
  const ch = {};
  for (const m of messages) {
    if (counts[m.status] !== undefined) counts[m.status]++;
    ch[m.channel] = (ch[m.channel] || 0) + 1;
  }
  const byChannel = Object.entries(ch)
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);
  return { ...counts, byChannel };
}

/* ── Admins ────────────────────────────── */

function adminCount() {
  return load().admins.length;
}

function getAdmin(username) {
  if (typeof username !== 'string') return null;
  return load().admins.find(a => a.username === username) || null;
}

function insertAdmin({ username, password_hash }) {
  const db = load();
  const id = db._seq.admins++;
  db.admins.push({ id, username, password_hash, created_at: new Date().toISOString() });
  save(db);
  return id;
}

module.exports = { insertMessage, getMessages, updateMessageStatus, deleteMessage, getStats, adminCount, getAdmin, insertAdmin };
