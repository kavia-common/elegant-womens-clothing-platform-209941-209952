const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// Helpers
function generateToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role || 'user' };
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

async function findByEmail(email) {
  const { rows } = await query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1', [email]);
  return rows[0];
}

async function findById(id) {
  const { rows } = await query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function createUser({ name, email, password, role }) {
  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hash, role || 'user']
  );
  return rows[0];
}

async function verifyCredentials(email, password) {
  const user = await findByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = {
  generateToken,
  findByEmail,
  findById,
  createUser,
  verifyCredentials,
};
