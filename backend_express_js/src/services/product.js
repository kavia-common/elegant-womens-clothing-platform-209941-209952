const { query } = require('../db');

// PUBLIC_INTERFACE
/**
 * List products with optional category filter and search query.
 */
async function listProducts({ category, q }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (category) {
    conditions.push(`category = $${idx++}`);
    params.push(category);
  }
  if (q) {
    conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(description) LIKE $${idx})`);
    params.push(`%${q.toLowerCase()}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT id, name, description, price, stock, category, image_url AS "imageUrl", created_at
               FROM products
               ${where}
               ORDER BY created_at DESC`;
  const { rows } = await query(sql, params);
  return rows;
}

// PUBLIC_INTERFACE
/**
 * Get a single product by id.
 */
async function getProductById(id) {
  const { rows } = await query(
    'SELECT id, name, description, price, stock, category, image_url AS "imageUrl", created_at FROM products WHERE id = $1',
    [id]
  );
  return rows[0];
}

// PUBLIC_INTERFACE
/**
 * Create a product (admin).
 */
async function createProduct({ name, description, price, stock, category, imageUrl }) {
  const { rows } = await query(
    `INSERT INTO products (name, description, price, stock, category, image_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, description, price, stock, category, image_url AS "imageUrl", created_at`,
    [name, description || '', price, stock, category || '', imageUrl || '']
  );
  return rows[0];
}

// PUBLIC_INTERFACE
/**
 * Update a product (admin).
 */
async function updateProduct(id, { name, description, price, stock, category, imageUrl }) {
  const { rows } = await query(
    `UPDATE products
     SET name=$1, description=$2, price=$3, stock=$4, category=$5, image_url=$6
     WHERE id=$7
     RETURNING id, name, description, price, stock, category, image_url AS "imageUrl", created_at`,
    [name, description || '', price, stock, category || '', imageUrl || '', id]
  );
  return rows[0];
}

// PUBLIC_INTERFACE
/**
 * Delete a product (admin).
 */
async function deleteProduct(id) {
  await query('DELETE FROM products WHERE id = $1', [id]);
  return { success: true };
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
