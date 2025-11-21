# Integration Guide (Backend + Frontend + PostgreSQL)

Environment variables:
- Backend (.env in backend_express_js):
  - PORT, HOST, NODE_ENV
  - CORS_ORIGIN (comma-separated list; e.g. http://localhost:3000)
  - JWT_SECRET, JWT_EXPIRES_IN
  - Either DATABASE_URL or PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
- Frontend (.env in frontend_react_js):
  - REACT_APP_API_BASE (preferred)
  - REACT_APP_BACKEND_URL (fallback if REACT_APP_API_BASE not set)

Database:
- Use backend_express_js/scripts/run_db_schema.js to apply db_schema.sql
- Use backend_express_js/scripts/run_db_seed.js to apply seed.sql
- Both read envs from backend .env

Frontend API base URL resolution:
- The frontend should compute the base URL by:
  - First using REACT_APP_API_BASE when available
  - Otherwise falling back to REACT_APP_BACKEND_URL
  - Avoid hardcoding any URL in code

Basic test flow:
1) Start PostgreSQL and set backend .env values
2) From backend_express_js:
   - npm install
   - node scripts/run_db_schema.js && node scripts/run_db_seed.js
   - npm run dev
3) From frontend_react_js:
   - Set .env with REACT_APP_API_BASE=http://localhost:3001
   - npm install && npm start
4) Open frontend, register/login, list products, and place an order.
