#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Apply seed.sql to the configured database.
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const seedPath = path.join(__dirname, '..', 'seed.sql');
  if (!fs.existsSync(seedPath)) {
    console.error('Seed file not found:', seedPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(seedPath, 'utf8');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('Database seed applied successfully.');
  } catch (err) {
    console.error('Failed to apply seed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
