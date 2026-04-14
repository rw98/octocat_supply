# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
make install              # Install all dependencies (api + frontend)
make dev                  # Start both API (:3000) and frontend (:5137) dev servers
make dev-api              # Start only API dev server
make dev-frontend         # Start only frontend dev server
make build                # Build both projects for production
make db-init              # Run migrations + seed the SQLite database
make db-seed              # Seed database with sample data
```

## Testing

```bash
make test                 # Run all tests (API + frontend)
make test-api             # API tests only (Vitest + Supertest)
make test-frontend        # Frontend tests only (Vitest + React Testing Library)
make test-e2e             # Playwright end-to-end tests
make test-coverage        # API tests with coverage report

# Run a single test file:
cd api && npx vitest run src/routes/branch.test.ts
cd frontend && npx vitest run src/components/SomeComponent.test.tsx
```

## Linting & Formatting

```bash
make lint                 # Lint both projects (ESLint)
make lint-fix             # Auto-fix lint issues
make format               # Format with Prettier
make swagger              # Regenerate OpenAPI spec from Swagger JSDoc comments
```

## Architecture

TypeScript monorepo with two workspaces:

- **`api/`** — Express.js REST API with SQLite persistence (better-sqlite3)
- **`frontend/`** — React 18 + Vite + Tailwind CSS UI

### API Layer (`api/src/`)

Routes → Repositories → SQLite database. Controllers (routes) are thin — validation and orchestration only. Business logic lives in repositories.

- **`routes/`** — Express route handlers with inline Swagger JSDoc comments. Each entity gets CRUD endpoints under `/api/<entity>`.
- **`repositories/`** — Data access via parameterized SQL. Consistent interface: `findAll()`, `findById()`, `create()`, `update()`, `delete()`.
- **`models/`** — TypeScript interfaces and Swagger schema definitions.
- **`utils/errors.ts`** — Custom error classes (`NotFoundError`, `ValidationError`, `ConflictError`, `DatabaseError`) that map to HTTP status codes via error-handling middleware.
- **`utils/sql.ts`** — SQL builder utilities.
- **`db/`** — Database connection (SQLite with WAL mode), migration runner, seed logic.

Naming convention: camelCase in TypeScript, snake_case in SQL columns. Repositories handle the mapping.

### Database (`api/database/`)

- **`migrations/`** — Sequential, immutable SQL files (`001_init.sql`, `002_...`). Never modify existing migrations; always add new ones.
- **`seed/`** — Deterministic seed data with explicit IDs. Update seeds when adding NOT NULL columns.

Key entities: suppliers, headquarters, branches, products, orders, order_details, deliveries, order_detail_deliveries.

### Frontend (`frontend/src/`)

- **`api/config.ts`** — Axios client configuration pointing to the API.
- **`components/`** — React components organized by feature. Entity-specific components under `entity/<name>/`.
- **`context/`** — AuthContext (authentication) and ThemeContext (light/dark mode).
- Uses React Query for server state, React Router v7 for routing, Tailwind utility classes for styling.
- Routes: `/` (home), `/products`, `/about`, `/login`, `/admin/products`.

## Key Conventions

- **No `any`** — use proper types; type API responses with shared DTO interfaces.
- **Parameterized SQL only** — never interpolate user input into query strings.
- **Swagger docs** — update inline JSDoc in route files when adding/modifying endpoints, then run `make swagger`.
- **Error handling** — throw custom error classes from repositories; middleware converts them to proper HTTP responses.
- **Testing** — API repo tests use in-memory SQLite. Route tests use Supertest against the real Express app. Frontend uses React Testing Library.
- **Migrations** — immutable and sequential. Guard with `IF NOT EXISTS` where feasible. Group multi-table writes in transactions.
- **Frontend components** — keep under ~150 LOC. Use React Query for data fetching (not ad-hoc useEffect + axios). Accessibility-first: semantic HTML, proper labels, keyboard navigation.
- **Styling** — Tailwind utility classes only; no custom CSS files duplicating Tailwind utilities.

## Escalation Priority for Reviews

1. Security / data integrity
2. Logical / functional correctness
3. Performance / scalability (watch for N+1 queries)
4. Maintainability / duplication
5. Readability / consistency

## **Always when Commiting**
When commiting always write the commit message in a rhyme in a mideval.
