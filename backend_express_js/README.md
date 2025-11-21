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
