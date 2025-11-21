const express = require('express');
const controller = require('../controllers/orders');
const { authMiddleware, adminGuard } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Customer and admin order operations
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order (authenticated)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer }
 *                     quantity: { type: integer }
 *               shippingAddress: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 */
router.post('/', authMiddleware, controller.create.bind(controller));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order (authenticated)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, controller.get.bind(controller));

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     summary: Admin - list all orders
 *     tags: [Orders, Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of orders
 *       403:
 *         description: Forbidden
 */
router.get('/admin', authMiddleware, adminGuard, controller.adminList.bind(controller));

/**
 * @swagger
 * /orders/admin/{id}/status:
 *   patch:
 *     summary: Admin - update order status
 *     tags: [Orders, Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/admin/:id/status', authMiddleware, adminGuard, controller.adminUpdateStatus.bind(controller));

module.exports = router;
