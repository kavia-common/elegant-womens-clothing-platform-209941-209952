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
    - Must include your frontend URL. For local dev React: http://localhost:3000
  - JWT: JWT_SECRET, JWT_EXPIRES_IN
  - DB: either DATABASE_URL or individual PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
- CORS is configured from CORS_ORIGIN at runtime (no hardcoded origins).
- Database pool uses DATABASE_URL when provided, otherwise PG* values.

Database setup:
- Apply schema: node scripts/run_db_schema.js
- Seed sample data: node scripts/run_db_seed.js
Both scripts read the same env variables as the server.

Verify checklist (concise):
- .env contains:
  - JWT_SECRET set
  - CORS_ORIGIN includes frontend URL (e.g., http://localhost:3000)
  - Database connection (DATABASE_URL or PG* values)
- Start order:
  1) node scripts/run_db_schema.js
  2) node scripts/run_db_seed.js
  3) npm run dev
- Open http://localhost:${PORT}/docs to inspect routes.

Smoke-test notes (end-to-end):
1) Health: GET / → { status: "ok" }
2) Auth:
   - POST /auth/register { name,email,password } → 201 with token
   - or POST /auth/login { email,password } → 200 with token
   - GET /auth/me with Bearer token → 200 user info
3) Catalog:
   - GET /products → returns { items: [...] }
   - GET /products/{id} → returns product
4) Cart/Checkout:
   - POST /orders with token { items:[{productId,quantity}], shippingAddress, notes? } → 201 order
5) Admin Orders:
   - Seed creates admin user admin@example.com (password "admin123")
   - Login as admin, then
     - GET /orders/admin → list all
     - PATCH /orders/admin/{id}/status { status } → updates status
