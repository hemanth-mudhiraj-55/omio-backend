const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'omio-dev-secret-change-in-production';

// Warn loudly if the default secret is still in use
if (JWT_SECRET === 'omio-dev-secret-change-in-production') {
  console.warn('[security] WARNING: Using default JWT_SECRET — set a strong secret in .env for production');
}

function auth(req, res, next) {
  const header = req.headers['authorization'];

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7);

  // Reject suspiciously long tokens (normal JWTs are <1 KB)
  if (token.length > 2048) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],  // only allow expected algorithm — prevents "alg: none" attacks
      maxAge: '8h',           // reject tokens older than 8 hours even if exp is longer
    });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { auth, JWT_SECRET };
