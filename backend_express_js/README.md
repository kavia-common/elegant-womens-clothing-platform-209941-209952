# Backend API - Elegant Women Clothing

This Express backend provides authentication (JWT), products, and orders APIs with admin capabilities, PostgreSQL pooling, validation, and Swagger docs.

Quick start:
- Copy .env.example to .env and set variables (DB, JWT_SECRET, CORS_ORIGIN).
- Install deps: npm install
- Start dev: npm run dev
- Open API docs: http://localhost:${PORT}/docs

Generate OpenAPI JSON file:
- npm run gen:openapi (writes interfaces/openapi.json)

Reference DB schema: see db_schema.sql

Integration and environment configuration:
- Required env vars (see .env.example):
  - Server: PORT, HOST
  - CORS: CORS_ORIGIN (single origin or comma-separated list)
  - JWT: JWT_SECRET, JWT_EXPIRES_IN
  - DB: either DATABASE_URL or individual PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
- CORS is configured from CORS_ORIGIN at runtime.
- Database pool uses DATABASE_URL when provided, otherwise PG* values.

Database setup:
- Apply schema: node scripts/run_db_schema.js
- Seed sample data: node scripts/run_db_seed.js
Both scripts read the same env variables as the server.

Basic verification flow:
1) Start DB and set .env with DB + JWT_SECRET + CORS_ORIGIN.
2) Run: node scripts/run_db_schema.js && node scripts/run_db_seed.js
3) Start API: npm run dev
4) Health: GET / (should return status: ok)
5) Register or login:
   - POST /auth/register { name, email, password }
   - or POST /auth/login { email, password }
6) Use the token to call:
   - GET /products
   - POST /orders (as authenticated)
   - Admin endpoints require a user with role=admin.
