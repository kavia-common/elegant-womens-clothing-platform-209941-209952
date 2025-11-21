const { authMiddleware, adminGuard } = require('./auth');

// This file exports middleware utilities
module.exports = {
  authMiddleware,
  adminGuard,
};
