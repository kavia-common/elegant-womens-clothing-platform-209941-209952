const pool = require('./pool');

/**
 * Execute a parameterized query.
 * @param {string} text - SQL query text
 * @param {Array} params - parameter values
 * @returns {Promise<import('pg').QueryResult>} query result
 */
async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    err.message = `DB Error: ${err.message}`;
    throw err;
  }
}

/**
 * Run a callback within a transaction.
 * Rolls back on error.
 */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, withTransaction };
