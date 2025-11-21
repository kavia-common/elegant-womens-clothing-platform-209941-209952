const { orderCreateSchema, orderStatusSchema } = require('../validation/schemas');
const orderService = require('../services/order');

class OrderController {
  // PUBLIC_INTERFACE
  /**
   * Create an order for the authenticated user.
   */
  async create(req, res, next) {
    try {
      const { error, value } = orderCreateSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);
      const order = await orderService.createOrder(req.user.id, value);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get a specific order for the authenticated user.
   */
  async get(req, res, next) {
    try {
      const orderId = Number(req.params.id);
      if (Number.isNaN(orderId)) return res.status(400).json({ status: 'error', message: 'Invalid order id' });
      const order = await orderService.getOrderByIdForUser(req.user.id, orderId);
      if (!order) return res.status(404).json({ status: 'error', message: 'Order not found' });
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Admin: list all orders.
   */
  async adminList(req, res, next) {
    try {
      const orders = await orderService.listAllOrders();
      res.json({ items: orders });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Admin: update order status.
   */
  async adminUpdateStatus(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid order id' });
      const { error, value } = orderStatusSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);
      const updated = await orderService.updateOrderStatus(id, value.status);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Order not found' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
