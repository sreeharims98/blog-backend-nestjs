# Production Backend Features Roadmap (NestJS + PostgreSQL)

## Phase 1 --- Authentication & User Security

### [ ] Refresh Tokens

- [x] Access Token (short-lived)
- [x] Refresh Token (long-lived)
- [x] Refresh token rotation
- [x] Secure logout
- [ ] Multiple device login support

### [x] Email Verification

- [x] User registration verification triggers
- [x] Verification token generation and deterministic SHA-256 storage
- [x] Verification link validation and user activation
- [x] Resend verification link with anti-enumeration protection

### [ ] Forgot Password

- [x] Request password reset email
- [x] Reset password with expiring one-time token

---

## Phase 2 --- Production API Foundations

### [ ] Swagger/OpenAPI

- [x] Swagger UI setup (configured in `main.ts` at `/api`)
- [ ] Endpoint annotations (`@ApiTags`, `@ApiProperty`, `@ApiResponse`, JWT Auth documentation)

### [ ] Global Exception Filter

- [ ] Consistent HTTP error format filter

### [ ] Logging

- [x] Default NestJS Logger
- [ ] Production Logger (e.g. Pino) integration

---

## Phase 3 --- Database Best Practices

### [x] Database Migrations

- [x] Configured TypeORM migrations (`migrationsRun: true`, compiled JS paths for runtime)
- [x] Existing migrations for Schema, Email Verification, etc.

### [x] Seeders

- [x] Factories and Seeders (Users, Blogs) using `typeorm-extension`

### [ ] Transactions

- [ ] Transaction handling for multi-table database queries

### [x] Soft Deletes

- [x] Soft delete & restore support (implemented on `Blog` entity using `@DeleteDateColumn`)

---

## Phase 4 --- Better Architecture

### [ ] Repository Pattern

- [ ] Custom repository wrappers on top of TypeORM repositories

### [x] Generic Pagination

- [x] Reusable `PaginationQueryDto` and `PaginatedResponseDto`

### [ ] Generic API Response

- [ ] Uniform `{ success: true, data: {} }` wrappers

### [x] Centralized Configuration

- [x] Structured namespaces: `database.config.ts`, `jwt.config.ts`, `mail.config.ts`
- [x] Automated Env variables validation on startup (`class-validator`/`class-transformer`)

---

## Phase 5 --- Blog Features

- [ ] Categories
- [ ] Comments
- [ ] Nested Comments
- [ ] Tags (Many-to-Many)
- [ ] Likes
- [ ] Bookmarks
- [ ] View Count
- [x] Draft / Published / Archived status (implemented in `Blog` entity status enum)
- [ ] Rich Search

---

## Phase 6 --- Performance

- [ ] Redis caching for blog lists and popular posts
- [ ] Response caching
- [ ] Background job queueing (BullMQ)
- [ ] Cloud file uploads (Cloudinary / AWS S3)

---

## Phase 7 --- Security

- [x] Rate Limiting (Throttler integration globally in `AppModule`)
- [ ] Helmet security headers
- [ ] Cross-Origin Resource Sharing (CORS) configuration
- [ ] Input Sanitization (XSS protection)
- [ ] CSRF protection

---

## Phase 8 --- Testing

- [ ] Unit Testing (skeletons generated, partial mocks implemented for Config and Verification Token Service)
- [ ] Integration Testing
- [ ] End-to-End Testing

---

## Phase 9 --- DevOps

- [ ] Dockerization (`Dockerfile`, `docker-compose.yml`)
- [ ] CI/CD pipeline setup
- [ ] Environment separation
- [ ] Deployment

---

## Phase 10 --- Advanced Backend

- [ ] Event-Driven Architecture & CQRS
- [ ] Monitoring & OpenTelemetry
- [ ] WebSockets / GraphQL / OAuth / SSO / Multi-tenancy

---

# Recommended Learning Order

Phase Topics

1. Refresh Tokens, Email Verification, Forgot Password
2. Swagger, Logging, Global Exception Filter
3. Migrations, Seeders, Transactions
4. Categories, Comments, Tags, Likes, Bookmarks
5. File Uploads, Rich Search
6. Redis, Rate Limiting, Queues
7. Unit, Integration & E2E Testing
8. Docker, CI/CD, Deployment
9. Event-Driven Architecture, CQRS
10. Monitoring, OpenTelemetry, Microservices

## Goal

Mastering through **Phase 8** will prepare you for the majority of production backend engineering work with NestJS and PostgreSQL. Phases 9 and 10 introduce patterns used in larger, distributed, and enterprise-scale systems.
