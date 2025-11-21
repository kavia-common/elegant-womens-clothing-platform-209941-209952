const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Create a PostgreSQL connection pool, using DATABASE_URL if provided,
 * otherwise individual PG* environment variables.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  // Log and allow process manager to handle restarts
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
