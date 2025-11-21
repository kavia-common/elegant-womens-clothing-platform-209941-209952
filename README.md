# elegant-womens-clothing-platform-209941-209952

Multi-container app:
- frontend_react_js (React)
- backend_express_js (Express + PostgreSQL)

Concise verify-checklist:
- Backend:
  - .env based on backend_express_js/.env.example
  - CORS_ORIGIN includes frontend URL (http://localhost:3000 for local dev)
  - DB set via DATABASE_URL or PG* envs
  - JWT_SECRET set
- Frontend:
  - Prefer REACT_APP_API_BASE for API base URL
  - If not set, REACT_APP_BACKEND_URL is used as fallback
  - Do not hardcode URLs in code

Smoke tests (manual):
- Admin login: admin@example.com / admin123
- Product list loads and filters/search work
- Cart updates quantities and totals
- Checkout creates an order (requires auth)
- Admin orders page lists orders and allows status update

See INTEGRATION.md and backend_express_js/README.md for detailed steps.