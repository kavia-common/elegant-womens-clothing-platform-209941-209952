# Backend Smoke Tests

Purpose: Quick manual checks to verify end-to-end flows with the frontend.

Pre-requisites:
- PostgreSQL running and reachable
- backend_express_js/.env configured (JWT_SECRET, DB, CORS_ORIGIN includes frontend URL)
- Schema + seed applied:
  - node scripts/run_db_schema.js
  - node scripts/run_db_seed.js
- Backend running: npm run dev
- Frontend configured with REACT_APP_API_BASE pointing to backend (default http://localhost:3001)

Scenarios:
1) Health
   - GET / → 200 { status: "ok" }

2) Auth
   - Register: POST /auth/register { name,email,password } → 201 with token
   - Login: POST /auth/login { email,password } → 200 with token
   - Me: GET /auth/me with Bearer token → 200 user object
   - Admin login: admin@example.com / admin123 (seeded)

3) Products
   - GET /products → 200 { items: [...] }
   - GET /products/{id} → 200 product or 404

4) Checkout
   - With user token:
     - POST /orders { items:[{productId,quantity}], shippingAddress } → 201 order
     - Stock decremented; totals correct

5) Admin orders
   - With admin token:
     - GET /orders/admin → 200 { items: [...] }
     - PATCH /orders/admin/{id}/status { status } → 200 updated
