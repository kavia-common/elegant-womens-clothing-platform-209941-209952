const jwt = require('jsonwebtoken');

/**
 * Extract and verify JWT from Authorization header.
 * Attaches user payload to req.user on success.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Missing token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
}

/**
 * Ensure the user is admin based on req.user.role === 'admin'.
 */
function adminGuard(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  return next();
}

module.exports = { authMiddleware, adminGuard };
