const bcrypt = require('bcryptjs');
const store  = require('./store');

// Seed default admin on first run (change password immediately in production)
if (store.adminCount() === 0) {
  store.insertAdmin({ username: 'admin', password_hash: bcrypt.hashSync('admin123', 12) }); // 12 rounds
  console.warn('[security] Default admin seeded — change the password immediately via the database');
}

module.exports = store;
