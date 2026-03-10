---
name: fullstack-engineering
description: End-to-end best practices for full-stack development — from architecture and design through deployment and production observability. Use this skill when building, scaling, or shipping any web application across the entire stack (frontend, backend, database, DevOps, security, testing, and monitoring). Produces production-grade, maintainable, and secure software.
license: Complete terms in LICENSE.txt
---

# Full Stack Engineer — Development to Production Best Practices

> A comprehensive, opinionated guide for building production-grade full-stack applications. Covers every layer — from UI pixels to production infrastructure — so nothing falls through the cracks.

---

## Summary

This skill covers the complete lifecycle of a full-stack application:

| Phase | Focus |
|---|---|
| **1. Architecture & Planning** | System design, tech stack selection, project structure |
| **2. Frontend Engineering** | UI/UX, component architecture, performance, accessibility |
| **3. Backend Engineering** | API design, business logic, authentication, data validation |
| **4. Database & Data Layer** | Schema design, migrations, query optimization, caching |
| **5. Testing Strategy** | Unit, integration, E2E, load testing |
| **6. Security Hardening** | OWASP top 10, secrets management, supply chain security |
| **7. DevOps & CI/CD** | Containerization, pipelines, infrastructure as code |
| **8. Deployment & Release** | Blue/green, canary, feature flags, rollback strategies |
| **9. Observability & Operations** | Logging, metrics, alerting, incident response |
| **10. Maintenance & Scaling** | Technical debt, performance tuning, horizontal/vertical scaling |

---

## 1. Architecture & Planning

Before writing code, make deliberate architectural decisions:

### 1.1 System Design Principles
- **Separation of Concerns** — Divide the system into distinct layers (presentation, business logic, data access). Each layer should have a single responsibility.
- **12-Factor App Methodology** — Follow the [12-factor app](https://12factor.net) principles: config in environment, stateless processes, disposable instances, dev/prod parity.
- **API-First Design** — Define your API contracts (OpenAPI/GraphQL schema) before implementing. This unblocks frontend and backend teams in parallel.
- **Monolith-First** — Start with a well-structured monolith. Extract microservices only when you have a clear scaling or team-boundary reason.

### 1.2 Tech Stack Selection
Choose tools based on project needs, team expertise, and ecosystem maturity:

| Layer | Recommended Options | Decision Criteria |
|---|---|---|
| Frontend | React, Next.js, Vue, Svelte | SSR needs, bundle size, ecosystem |
| Backend | Node.js (Express/Fastify), Python (FastAPI/Django), Go (Gin/Echo) | Performance, team skill, async needs |
| Database | PostgreSQL, MongoDB, Redis | Data model, query patterns, ACID needs |
| Cache | Redis, Memcached | Session store, hot-path caching |
| Queue | RabbitMQ, BullMQ, Kafka | Throughput, ordering guarantees |
| Search | Elasticsearch, Meilisearch, Typesense | Full-text search, faceting |

### 1.3 Project Structure
Adopt a consistent, scalable folder structure:

```
project-root/
├── apps/
│   ├── web/              # Frontend application
│   │   ├── src/
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── pages/        # Route-level views
│   │   │   ├── hooks/        # Custom React/Vue hooks
│   │   │   ├── services/     # API client & external integrations
│   │   │   ├── stores/       # State management
│   │   │   ├── utils/        # Pure utility functions
│   │   │   └── styles/       # Global styles & design tokens
│   │   └── public/
│   └── api/              # Backend application
│       ├── src/
│       │   ├── routes/       # Route handlers / controllers
│       │   ├── services/     # Business logic layer
│       │   ├── models/       # Data models / ORM entities
│       │   ├── middleware/   # Auth, validation, rate-limiting
│       │   ├── jobs/         # Background workers & cron jobs
│       │   ├── utils/        # Shared helpers
│       │   └── config/       # Environment & app configuration
│       └── tests/
├── packages/             # Shared libraries (types, validators, constants)
├── infra/                # IaC (Terraform, Pulumi, Docker Compose)
├── scripts/              # Automation scripts (seed, migrate, deploy)
├── .github/workflows/    # CI/CD pipeline definitions
├── docker-compose.yml
└── README.md
```

---

## 2. Frontend Engineering

### 2.1 Component Architecture
- **Atomic Design** — Build from atoms → molecules → organisms → templates → pages.
- **Smart vs. Dumb Components** — Container components handle logic; presentational components handle rendering.
- **Co-location** — Keep component styles, tests, and stories alongside the component file.
- **Composition over Inheritance** — Prefer render props, hooks, and slots over deep component hierarchies.

### 2.2 Design & Aesthetics
Create distinctive, memorable interfaces — never generic:
- **Typography** — Choose bold, characterful font pairings. Avoid overused defaults (Arial, Inter, Roboto). Pair a distinctive display font with a refined body font.
- **Color & Theme** — Commit to a cohesive palette stored as CSS/design tokens. Dominant colors with sharp accents outperform evenly-distributed, timid palettes.
- **Motion & Micro-interactions** — Focus on high-impact moments: orchestrated page load sequences, scroll-triggered reveals, hover states that surprise. Prefer CSS-only solutions; use Motion/Framer Motion for React when complexity demands it.
- **Spatial Composition** — Embrace asymmetry, overlapping elements, diagonal flow, and generous negative space. Break grids intentionally.
- **Visual Depth** — Use gradient meshes, noise textures, layered transparencies, and subtle shadows over flat solid backgrounds.

### 2.3 State Management
- Use **local state** (useState/ref) for component-scoped data.
- Use **context/provide-inject** for shallow cross-cutting concerns (theme, auth).
- Use **dedicated stores** (Zustand, Pinia, Redux Toolkit) only for complex shared state.
- Treat **server state** differently — use React Query / TanStack Query / SWR for data fetching, caching, and revalidation.

### 2.4 Performance
- **Code Splitting** — Lazy-load routes and heavy components (`React.lazy`, dynamic `import()`).
- **Image Optimization** — Use `<picture>`, WebP/AVIF, responsive `srcset`, and lazy loading.
- **Core Web Vitals** — Target LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **Bundle Analysis** — Regularly audit with `webpack-bundle-analyzer` or `vite-plugin-inspect`. Eliminate duplicate or unused dependencies.
- **Rendering Strategy** — Choose SSR, SSG, ISR, or CSR per-page based on content dynamism and SEO needs.

### 2.5 Accessibility (a11y)
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`).
- ARIA attributes only when native semantics are insufficient.
- Keyboard navigation and focus management for all interactive elements.
- Color contrast ratios meeting WCAG 2.1 AA (minimum 4.5:1 for body text).
- Screen reader testing with VoiceOver / NVDA.

---

## 3. Backend Engineering

### 3.1 API Design
- **RESTful Conventions** — Use proper HTTP methods (`GET` for reads, `POST` for creates, `PUT/PATCH` for updates, `DELETE` for removals). Return appropriate status codes (201 Created, 204 No Content, 422 Unprocessable Entity).
- **Versioning** — Prefix routes with `/api/v1/` for backward-compatibility.
- **Pagination** — Implement cursor-based pagination for large datasets; offset-based for simple use cases.
- **Filtering & Sorting** — Use query parameters (`?status=active&sort=-created_at`).
- **Error Responses** — Return consistent error shapes:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Email is required",
      "details": [{ "field": "email", "issue": "required" }]
    }
  }
  ```

### 3.2 Input Validation & Sanitization
- Validate **all** incoming data at the boundary (request handlers) using schema validators (Zod, Joi, Pydantic).
- Never trust client-side validation alone — always re-validate server-side.
- Sanitize HTML content to prevent XSS. Escape SQL parameters to prevent injection.
- Define strict TypeScript/Python types for request and response bodies. Share types between frontend and backend via shared packages.

### 3.3 Authentication & Authorization
- **Authentication** — CodeAlchemist uses **Better Auth** for session-based authentication with `httpOnly` cookies. Supports email/password sign-up and social sign-on (Google, GitHub OAuth). The auth server is configured in `src/lib/auth.ts` with `betterAuth()`, and the client in `src/lib/auth-client.ts` via `createAuthClient()` from `better-auth/react`.
- **Database** — **Drizzle ORM** with **Supabase PostgreSQL**. Schema defined in `src/db/schema.ts` using `pgTable` definitions. Drizzle instance in `src/db/index.ts` via `postgres` driver. Migrations managed with `drizzle-kit`.
- **Authorization** — Implement role-based access control (RBAC) or attribute-based access control (ABAC). Check permissions at the middleware and service layers. The `user` table includes a `role` field (default: `"user"`).
- **OAuth2/OIDC** — Google and GitHub OAuth configured as Better Auth `socialProviders`. Credentials stored in environment variables (`GOOGLE_CLIENT_ID`, `GITHUB_CLIENT_ID`, etc.).
- **Rate Limiting** — Protect login, signup, and password-reset endpoints with rate limiting and CAPTCHA for brute-force prevention.

### 3.4 Business Logic Layer
- Keep route handlers thin — delegate logic to service classes/functions.
- Service functions should be framework-agnostic and testable in isolation.
- Use the **repository pattern** to abstract database access from business logic.
- Handle errors with custom exception classes, caught by centralized error-handling middleware.

### 3.5 Background Jobs & Async Processing
- Offload heavy tasks (email sending, image processing, report generation) to background job queues (BullMQ, Celery, Sidekiq).
- Implement idempotency keys for operations that must not be duplicated.
- Use dead-letter queues (DLQ) for failed jobs. Set up retry policies with exponential backoff.

---

## 4. Database & Data Layer

### 4.1 Schema Design
- **Normalization** — Normalize to 3NF by default; denormalize intentionally for read-heavy paths.
- **Naming Conventions** — Use `snake_case` for columns/tables. Plural table names (`users`, `orders`). Explicit foreign key names (`user_id`, `order_id`).
- **Audit Columns** — Always include `id`, `created_at`, `updated_at`. Add `deleted_at` for soft deletes.
- **Constraints** — Use database-level constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) — don't rely solely on application code.

### 4.2 Migrations
- Use a migration tool (Prisma Migrate, Alembic, Flyway, Knex migrations).
- Migrations must be **idempotent** and **reversible**.
- Never edit a migration that has been applied to staging or production — create a new one.
- Run migrations in CI before deploying application code.

### 4.3 Query Optimization
- **Indexing** — Index columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY`. Use composite indexes for multi-column queries.
- **N+1 Prevention** — Use eager loading / `JOIN` fetching. Monitor with query logging.
- **EXPLAIN** — Use `EXPLAIN ANALYZE` to audit slow queries and optimize.
- **Connection Pooling** — Use PgBouncer, Prisma connection pool, or built-in ORM pooling. Size the pool based on available DB connections and worker count.

### 4.4 Caching Strategy
- **Cache Hierarchy** — Browser cache → CDN → Application cache (Redis) → Database.
- **Cache Invalidation** — Prefer TTL-based expiration with event-driven invalidation for critical data.
- **Cache-Aside Pattern** — Application checks cache first, falls back to DB, then populates cache on miss.
- **Cache Key Naming** — Use structured keys: `entity:id:field` (e.g., `user:123:profile`).

---

## 5. Testing Strategy

### 5.1 Testing Pyramid
```
         ╱ E2E Tests ╲         — Few, high-value user flows
        ╱──────────────╲
       ╱ Integration    ╲      — API routes, DB interactions
      ╱──────────────────╲
     ╱   Unit Tests       ╲   — Business logic, utilities, pure functions
    ╱──────────────────────╲
```

### 5.2 Testing Best Practices
- **Unit Tests** — Test pure functions, business logic, and utilities. Mock external boundaries (DB, APIs). Use frameworks like Jest, Vitest, or Pytest.
- **Integration Tests** — Test API endpoints with a real (test) database. Use Supertest, httpx, or similar. Verify status codes, response bodies, and side effects.
- **End-to-End Tests** — Test critical user flows (signup, checkout, dashboard) in a browser with Playwright or Cypress. Keep these minimal and fast.
- **Load / Stress Tests** — Use k6 or Artillery for load testing pre-production. Establish baseline performance SLAs.
- **Test Data** — Use factories/fixtures (FactoryBot, Fishery, faker.js) to generate realistic test data. Seed a consistent test database.

### 5.3 Code Quality
- **Linting** — ESLint (JS/TS), Ruff / Flake8 (Python), golangci-lint (Go). Enforce on commit via Husky + lint-staged.
- **Formatting** — Prettier (JS/TS), Black (Python), gofmt (Go). Autoformat on save.
- **Type Checking** — TypeScript `strict: true`, mypy / Pyright for Python. Zero tolerance for `any` types.
- **Code Review** — Every PR gets at least one human review. Use conventional commits and keep PRs < 400 lines.

---

## 6. Security Hardening

### 6.1 OWASP Top 10 Defenses
| Threat | Mitigation |
|---|---|
| Injection (SQL/NoSQL/OS) | Parameterized queries, ORM, input validation |
| Broken Auth | Bcrypt/Argon2 hashing, short-lived JWTs, MFA |
| Sensitive Data Exposure | TLS everywhere, encrypt at rest, mask PII in logs |
| XSS | Content-Security-Policy header, sanitize output, `httpOnly` cookies |
| CSRF | SameSite cookies, CSRF tokens for state-changing requests |
| Broken Access Control | Server-side permission checks on every request |
| Security Misconfiguration | Disable debug mode in prod, remove default credentials |
| SSRF | Allowlist outbound domains, block internal IP ranges |

### 6.2 Secrets Management
- **NEVER** commit secrets to version control.
- Use environment variables loaded from `.env` files (development) or secret managers (production: AWS Secrets Manager, Vault, Doppler).
- Rotate secrets regularly. Use short-lived credentials where possible.
- Scan for leaked secrets with tools like `trufflehog` or `gitleaks` in CI.

### 6.3 Dependency Security
- Run `npm audit` / `pip-audit` / `govulncheck` regularly.
- Use Dependabot, Renovate, or Snyk for automated dependency updates.
- Pin dependency versions in lockfiles. Review changelogs before upgrading major versions.
- Use a minimal base Docker image (Alpine, Distroless) to reduce attack surface.

### 6.4 HTTP Security Headers
Set these headers on every response:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 7. DevOps & CI/CD

### 7.1 Containerization
- Write production-optimized, **multi-stage Dockerfiles**:
  ```dockerfile
  # Build stage
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --production=false
  COPY . .
  RUN npm run build

  # Production stage
  FROM node:20-alpine AS runner
  WORKDIR /app
  RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./
  USER appuser
  EXPOSE 3000
  CMD ["node", "dist/server.js"]
  ```
- Use `.dockerignore` to exclude `node_modules`, `.git`, `tests/`, and local config.
- Scan images for vulnerabilities with Trivy or Docker Scout.

### 7.2 CI/CD Pipeline
A robust pipeline should include these stages:

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Lint &  │──▶│  Build   │──▶│  Test    │──▶│ Security │──▶│  Deploy  │
│  Format  │   │          │   │          │   │  Scan    │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

- **Lint & Format** — Fail fast on style violations.
- **Build** — Compile, bundle, and generate artifacts.
- **Test** — Run unit + integration tests. Fail the pipeline on any test failure.
- **Security Scan** — Dependency audit, SAST, container image scan.
- **Deploy** — Push to staging automatically; require manual approval for production.

### 7.3 Infrastructure as Code (IaC)
- Use Terraform, Pulumi, or AWS CDK to define all infrastructure.
- Keep IaC in version control alongside application code.
- Use separate state files per environment (dev, staging, prod).
- Apply changes through CI/CD — never run `terraform apply` from a developer laptop on production.

### 7.4 Environment Strategy
| Environment | Purpose | Data | Access |
|---|---|---|---|
| Local | Developer workstation | Seeded fixtures | Developer only |
| Dev | Shared development | Synthetic data | Engineering team |
| Staging | Pre-production validation | Production-like (anonymized) | Engineering + QA |
| Production | Live users | Real data | Restricted, audited |

---

## 8. Deployment & Release

### 8.1 Deployment Strategies
- **Blue/Green** — Run two identical environments; switch traffic after verifying the new version.
- **Canary** — Route a small percentage (1-5%) of traffic to the new version; monitor errors before full rollout.
- **Rolling** — Gradually replace old instances with new ones (Kubernetes default).
- **Feature Flags** — Decouple deployment from release. Ship code behind flags (LaunchDarkly, Unleash, or simple config). Enable features progressively.

### 8.2 Rollback Plan
- Always have a one-command rollback strategy (revert Docker tag, revert Git SHA, switch blue/green).
- Test rollback procedures regularly — not just during incidents.
- Database migrations must be backward-compatible with the previous application version (expand-contract pattern).

### 8.3 Release Checklist
```markdown
- [ ] All CI checks pass (lint, build, test, security scan)
- [ ] Staging environment tested and validated
- [ ] Database migrations applied and verified
- [ ] Feature flags configured for gradual rollout
- [ ] Monitoring dashboards and alerts are in place
- [ ] Rollback procedure documented and tested
- [ ] Changelog and release notes updated
- [ ] On-call engineer identified and notified
```

---

## 9. Observability & Operations

### 9.1 The Three Pillars

#### Logging
- Use **structured logging** (JSON format) with consistent fields: `timestamp`, `level`, `message`, `request_id`, `user_id`.
- Log levels: `DEBUG` (dev only), `INFO` (key events), `WARN` (recoverable issues), `ERROR` (failures requiring attention).
- Centralize logs with ELK Stack, Loki + Grafana, or Datadog.
- **Never log** passwords, tokens, credit cards, or PII.

#### Metrics
- Track the **RED method** for services: Rate, Errors, Duration.
- Track the **USE method** for resources: Utilization, Saturation, Errors.
- Instrument with Prometheus + Grafana, or Datadog APM.
- Key metrics to dashboard: request latency (p50, p95, p99), error rate, active connections, CPU/memory usage, queue depth.

#### Tracing
- Implement distributed tracing with OpenTelemetry.
- Propagate `trace-id` across service boundaries (HTTP headers, message queue metadata).
- Visualize traces in Jaeger, Tempo, or Datadog.

### 9.2 Alerting
- Alert on **symptoms** (high error rate, high latency), not causes (CPU spike).
- Use severity levels: **P1** (service down, all hands), **P2** (degraded, on-call response), **P3** (non-urgent, next business day).
- Avoid alert fatigue — every alert must be actionable. If an alert fires and no one acts, delete it or fix the condition.
- Set up PagerDuty, Opsgenie, or Grafana OnCall for routing.

### 9.3 Health Checks
- Implement `/health` (basic liveness) and `/ready` (dependency checks — DB, cache, queues).
- Kubernetes uses these for liveness/readiness probes.
- Return structured responses:
  ```json
  {
    "status": "healthy",
    "checks": {
      "database": "ok",
      "redis": "ok",
      "queue": "ok"
    },
    "version": "1.4.2",
    "uptime": "3d 12h 4m"
  }
  ```

---

## 10. Maintenance & Scaling

### 10.1 Technical Debt Management
- Track tech debt in a dedicated backlog — not just code comments.
- Allocate 15-20% of each sprint to debt reduction.
- Prioritize debt that slows down feature delivery or increases incident risk.
- Refactor incrementally. Avoid "big rewrite" projects.

### 10.2 Performance Tuning
- **Profile before optimizing** — Use flame graphs, APM tools, and database slow-query logs.
- **Frontend** — Optimize Core Web Vitals, reduce JavaScript payload, implement aggressive caching.
- **Backend** — Optimize hot-path queries, add caching, use connection pooling, batch database operations.
- **Database** — Add indexes, partition large tables, archive old data, upgrade hardware (vertical) before sharding (horizontal).

### 10.3 Scaling Strategies
- **Vertical Scaling** — Bigger machines. Easiest, try first.
- **Horizontal Scaling** — More instances behind a load balancer. Requires stateless application design.
- **Database Scaling** — Read replicas → caching → partitioning → sharding.
- **CDN** — Serve static assets and cache API responses at the edge (Cloudflare, AWS CloudFront, Vercel Edge).
- **Auto-scaling** — Configure based on CPU, memory, or custom metrics. Set min/max boundaries.

### 10.4 Documentation
- **README.md** — Setup instructions, architecture overview, and contribution guide.
- **API Documentation** — Auto-generated from OpenAPI/GraphQL schema (Swagger UI, Redoc, GraphQL Playground).
- **ADRs (Architecture Decision Records)** — Document significant technical decisions with context, options considered, and rationale.
- **Runbooks** — Step-by-step guides for common operational tasks (deploy, rollback, scale, incident response).

---

## Quick Reference — The Non-Negotiables

These practices are **mandatory** for any production application:

| Category | Non-Negotiable |
|---|---|
| **Code** | Linting, formatting, type checking, code review |
| **Testing** | Unit tests for business logic, integration tests for APIs |
| **Security** | Input validation, parameterized queries, HTTPS, secrets in env vars |
| **Auth** | Hashed passwords (bcrypt/argon2), httpOnly cookies, rate limiting |
| **Data** | Migrations in version control, database backups, connection pooling |
| **Deployment** | CI/CD pipeline, containerized builds, rollback capability |
| **Observability** | Structured logging, health checks, error alerting |
| **Documentation** | README, API docs, environment setup guide |

---

*Built for engineers who ship reliable, scalable, and beautiful software — from the first commit to production and beyond.*
