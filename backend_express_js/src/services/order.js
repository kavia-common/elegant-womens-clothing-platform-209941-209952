const { query, withTransaction } = require('../db');

// PUBLIC_INTERFACE
/**
 * Create an order for a user with items.
 * Decrements stock for each product atomically in a transaction.
 */
async function createOrder(userId, { items, shippingAddress, notes }) {
  return withTransaction(async (client) => {
    // Calculate total and validate stock
    let total = 0;
    for (const item of items) {
      const { rows: prodRows } = await client.query('SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      const product = prodRows[0];
      if (!product) {
        const err = new Error(`Product ${item.productId} not found`);
        err.status = 404;
        throw err;
      }
      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for product ${item.productId}`);
        err.status = 400;
        throw err;
      }
      total += Number(product.price) * item.quantity;
    }

    // Create order
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, status, total, shipping_address, notes)
       VALUES ($1, 'pending', $2, $3, $4)
       RETURNING id, user_id AS "userId", status, total, shipping_address AS "shippingAddress", notes, created_at`,
      [userId, total, shippingAddress, notes || null]
    );
    const order = orderRows[0];

    // Insert items and decrement stock
    for (const item of items) {
      const { rows: prodRows } = await client.query('SELECT price FROM products WHERE id = $1', [item.productId]);
      const price = prodRows[0].price;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    // Return order summary
    const { rows: itemsRows } = await client.query(
      `SELECT oi.product_id AS "productId", oi.quantity, oi.price,
              p.name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = $1`,
      [order.id]
    );
    order.items = itemsRows;
    return order;
  });
}

// PUBLIC_INTERFACE
/**
 * Get a user's order by id (ensures ownership).
 */
async function getOrderByIdForUser(userId, orderId) {
  const { rows } = await query(
    `SELECT id, user_id AS "userId", status, total, shipping_address AS "shippingAddress", notes, created_at
       FROM orders WHERE id = $1 AND user_id = $2`,
    [orderId, userId]
  );
  if (!rows[0]) return null;
  const order = rows[0];
  const { rows: items } = await query(
    `SELECT oi.product_id AS "productId", oi.quantity, oi.price, p.name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1`,
    [order.id]
  );
  order.items = items;
  return order;
}

// PUBLIC_INTERFACE
/**
 * Admin: list all orders.
 */
async function listAllOrders() {
  const { rows } = await query(
    `SELECT o.id, o.user_id AS "userId", u.email, u.name,
            o.status, o.total, o.shipping_address AS "shippingAddress", o.notes, o.created_at
       FROM orders o
       JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC`
  );
  return rows;
}

// PUBLIC_INTERFACE
/**
 * Admin: update order status.
 */
async function updateOrderStatus(orderId, status) {
  const { rows } = await query(
    `UPDATE orders SET status = $1 WHERE id = $2
       RETURNING id, user_id AS "userId", status, total, shipping_address AS "shippingAddress", notes, created_at`,
    [status, orderId]
  );
  return rows[0];
}

module.exports = {
  createOrder,
  getOrderByIdForUser,
  listAllOrders,
  updateOrderStatus,
};
