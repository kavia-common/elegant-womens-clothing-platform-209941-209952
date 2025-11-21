const userService = require('../services/user');
const { loginSchema, registerSchema } = require('../validation/schemas');

class AuthController {
  // PUBLIC_INTERFACE
  /**
   * Login user and return JWT token and user info.
   */
  async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);

      const { email, password } = value;
      const user = await userService.verifyCredentials(email, password);
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      const token = userService.generateToken(user);
      return res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Register a new user and return JWT token and user info.
   */
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);

      const user = await userService.createUser(value);
      const token = userService.generateToken(user);
      return res.status(201).json({ token, user });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Return current user from JWT.
   */
  async me(req, res, next) {
    try {
      // req.user is populated by auth middleware
      const user = await userService.findById(req.user.id);
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
