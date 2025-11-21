const Joi = require('joi');

// PUBLIC_INTERFACE
/**
 * Login schema for validating credentials.
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Email must be valid' }),
  password: Joi.string().min(6).required(),
});

// PUBLIC_INTERFACE
/**
 * Register schema for user creation.
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

// PUBLIC_INTERFACE
/**
 * Product creation or update schema.
 */
const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow('', null).default(''),
  price: Joi.number().min(0).precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().allow('', null).default(''),
  imageUrl: Joi.string().uri().allow('', null).default(''),
});

// PUBLIC_INTERFACE
/**
 * Order creation schema.
 */
const orderCreateSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  shippingAddress: Joi.string().min(5).required(),
  notes: Joi.string().allow('', null),
});

// PUBLIC_INTERFACE
/**
 * Order status update schema (admin).
 */
const orderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  productSchema,
  orderCreateSchema,
  orderStatusSchema,
};
