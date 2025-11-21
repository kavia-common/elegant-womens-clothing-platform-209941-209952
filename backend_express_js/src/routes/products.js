const express = require('express');
const controller = require('../controllers/products');
const { authMiddleware, adminGuard } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Products browsing and admin management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.detail.bind(controller));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (admin)
 *     tags: [Products, Admin]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware, adminGuard, controller.create.bind(controller));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (admin)
 *     tags: [Products, Admin]
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
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', authMiddleware, adminGuard, controller.update.bind(controller));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (admin)
 *     tags: [Products, Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', authMiddleware, adminGuard, controller.remove.bind(controller));

module.exports = router;
