# 🚀 ts-backend-production-template

A robust, production-ready backend template for Node.js using TypeScript and Express.  
Includes best practices for code quality, error handling, logging, and developer experience.

---

## 📦 Features

- TypeScript with strict settings and type-checked ESLint (typescript-eslint recommendedTypeChecked).
- Source maps enabled for easier debugging.
- Express 5 with modular routing and middlewares.
- Centralized error handling and consistent HTTP responses.
- Not Found (404) and Method Not Allowed (405) helpers.
- Winston logging (ready for console/file/MongoDB transports).
- MongoDB integration through Mongoose.
- ESLint + Prettier integration.
- Husky + lint-staged + Commitlint ready for conventional commits.
- Vitest unit tests, Supertest HTTP integration tests, and V8 coverage thresholds.
- Nodemon for hot reload in development.
- Liveness and readiness endpoints.
- Database migration support.
- Enabled Helmet to enhance API security with HTTP headers.
- CORS configuration with whitelisted origins, methods, and credentials.
- Rate limiting: Per-IP middleware with configurable limits, backed by MongoDB datastore.
- Runs anywhere: Fully containerized with Docker, also supports local development.
- Environment variables via `.env` files using Node.js native support (`--env-file` flag, no extra packages needed).

---

## 🗂️ Project Structure

```
api/
  src/
    app.ts                     # App wiring: JSON parsing, routers, 404 handler, global error handler
    server.ts                  # Server bootstrap
    router/
      apiRouter.ts             # API routes (/api)
    controller/
      apiController.ts         # Example controller (GET /api)
      healthController.ts      # Liveness and readiness controllers
    middleware/
      globalErrorHandler.ts    # Global error handler (final middleware)
    util/
      colorUtil.ts             # Color utilities for log levels (console)
      envUtil.ts               # Environment validation helpers (type guards)
      healthUtil.ts            # Gathers system & application health metrics
      logger.ts                # Winston logger configuration
      httpError.ts             # Helper to build/pass HttpError via next()
      errorObject.ts           # Builds the HttpError object (privacy-aware)
      httpResponse.ts          # Standard success response helper
      responseObject.ts        # Builds the HttpResponse object (production privacy-aware)
      notFoundError.ts         # Route/entity 404 helpers
      methodNotAllowedError.ts # 405 helper for route.all()
    constant/
      responseMessage.ts       # Centralized response messages
      environment.ts           # Supported Node environments
    config/
      config.ts                # Validated application configuration
      environmentSchema.ts     # Zod schema for environment variables
      rateLimiter.ts           # MongoDB-backed rate limiter configuration
    model/                     # (Ready for Mongoose models)
    service/                   # (Business logic)
  test/                        # Unit and Supertest HTTP integration tests
  docker/                      # Development and production Dockerfiles
  compose.yml                  # API and MongoDB development environment
  .env.example                 # Environment variable reference
  package.json
  tsconfig.json
  eslint.config.mjs
  vitest.config.mjs
  README.md
```

---

## ✅ Requirements

- Node.js 24.x (the supported version range is declared in `package.json`).
- npm 11 or a version compatible with Node.js 24.
- A reachable MongoDB instance, locally, remotely or through Docker Compose.
- Docker with Compose only when using the containerized workflow.

---

## ⚙️ Environment Variables

Copy the example and adjust values:

```bash
# For development environment
cp .env.example .env.development

# For production environment
cp .env.example .env.production
```

The application validates its environment with Zod during startup. Missing or invalid required
values stop the process before the HTTP server starts.

```dotenv
PORT=3003
SERVER_URL=http://localhost
NODE_ENV=development
LOG_LEVEL=info
LOG_TRANSPORTS=console
CORS_ORIGINS=http://localhost:3000
DB_URL=mongodb://localhost:27017/database
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=60
```

`CORS_ORIGINS` accepts a comma-separated list:

```dotenv
CORS_ORIGINS=http://localhost:3000,https://app.example.com
```

`DB_URL` accepts `mongodb://` and `mongodb+srv://` URLs. `PORT`, both rate-limit values, URLs,
`NODE_ENV`, and `LOG_LEVEL` are validated before startup.

`LOG_TRANSPORTS` accepts a comma-separated combination of `console`, `file`, and `mongodb`.
Managed hosting should normally use `console`; a VPS can additionally enable persistent file or
MongoDB transports.

Notes:

- For production, create a `.env.production` file.
- For development, create a `.env.development` file and use `npm run dev`.
- Environment files containing secrets are ignored by Git; `.env.example` is safe to commit.

---

## 🧑‍💻 Development

Install dependencies:

```bash
npm install
```

Run in development (hot reload with Nodemon):

```bash
npm run dev
```

Build TypeScript to dist/:

```bash
npm run build
```

Run in production (requires .env.production):

```bash
npm start
```

Run unit and HTTP integration tests:

```bash
npm test
```

Run tests with V8 coverage thresholds:

```bash
npm run test:coverage
```

### Quality checks

Run ESLint across the complete repository:

```bash
npm run lint
```

Run the complete local quality gate—formatting, linting, build, tests and coverage:

```bash
npm run quality
```

Husky and lint-staged also run ESLint and Prettier against staged files before each commit.

### Test architecture

- Unit tests isolate controllers, middleware, configuration and utilities with Vitest mocks.
- `test/app.integration.test.ts` exercises the real Express middleware and router stack with
  Supertest, without binding a permanent network port or running `server.ts`.
- V8 measures coverage for executable files under `src`; types, logger transport configuration
  and the process bootstrap are excluded.
- Coverage thresholds are configured in `vitest.config.mjs`.

Operational endpoints:

- `GET /api/health` reports liveness plus application and system metrics.
- `GET /api/readiness` returns `200` when MongoDB and the rate limiter are ready, otherwise `503`.

---

## 🐳 Development with Docker Compose

Docker Compose starts the API and MongoDB with persistent local volumes. Docker with Compose is required.

Build and start the services:

```bash
docker compose up --build
```

The API is available at `http://localhost:3003` and MongoDB at `mongodb://localhost:27017`.

Start the services in the background:

```bash
docker compose up --build --detach
```

Follow the API logs:

```bash
docker compose logs --follow api
```

Stop the services:

```bash
docker compose down
```

To also delete the local MongoDB data and installed container dependencies:

```bash
docker compose down --volumes
```

> `--volumes` permanently deletes the data stored in the Compose volumes.

### Production image

Build the multi-stage production image:

```bash
docker build --file docker/production/Dockerfile --tag ts-backend-production-template .
```

Run it with the production environment file:

```bash
docker run --env-file .env.production --publish 3003:3003 ts-backend-production-template
```

The production image runs as the unprivileged `node` user and contains compiled output plus
production dependencies only. MongoDB must be reachable through the configured `DB_URL`.

---

## Migrations (MongoDB + Mongoose)

The migration system lets you:

- Create structures or indexes
- Seed initial data
- Revert applied changes (down)
- Prune obsolete registrations

### Available scripts

- Development: `npm run migrate:dev <command> [args]`
- Production: `npm run migrate:prod <command> [args]`

`MIGRATE_MODE` is injected by the npm script to select the environment.

If mode is set, it will look for .env.[mode] file in the root of your project
For example, if MIGRATE_MODE=development it will look for .env.development file
If mode is not set, it will look for .env file in the root of your project

```text

.env                # loaded in all cases
.env.local          # loaded in all cases (used as override for local development)
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode (used as override for local development)
```

### Core commands

1. Create a new migration

    ```bash
    npm run migrate:dev create seed-users
    ```

    This generates a file like:  
    `migrations/<timestamp>-seed-users.ts`  
    Example: `migrations/20240101121530-seed-users.ts`

2. Edit the migration (seed example)

    ```typescript
    // migrations/<timestamp>-seed-users.ts
    import databaseService from '../src/service/databaseService';
    import { UserModel } from '../src/model/user.model';

    const seedUsers = [
        { email: 'john@example.com', favouriteSport: 'surf', yearOfBirth: 1997 },
        { email: 'alice@example.com', favouriteSport: 'soccer', yearOfBirth: 1998 },
    ];

    export async function up(): Promise<void> {
        await databaseService.connect();
        await UserModel.create(seedUsers);
    }

    export async function down(): Promise<void> {
        await databaseService.connect();
        await UserModel.deleteMany({
            email: { $in: seedUsers.map((u) => u.email) },
        });
    }
    ```

3. Apply (run) migrations

    ```bash
    # Run all pending
    npm run migrate:dev up

    # Run only one (match suffix after timestamp)
    npm run migrate:dev up seed-users
    ```

4. Revert migrations
    ```bash
    # Revert last applied
    npm run migrate:dev down

    # Revert a specific one
    npm run migrate:dev down seed-users
    ```

### Additional commands

- List status:

    ```bash
    npm run migrate:dev list
    ```

    Shows applied (up) and pending (down) migrations.

- Delete extraneous migrations from migration folder or database:
    ```bash
    npm run migrate:dev prune
    ```

### Production usage

Replace `migrate:dev` with `migrate:prod`:

```bash
npm run migrate:prod up
npm run migrate:prod down
npm run migrate:prod list
npm run migrate:prod prune
```

Ensure:

- Correct env vars (`DB_URL`, `NODE_ENV=production`)

### Recommendations

- One migration = one clear purpose
- Avoid destructive data ops without a safe `down`
- Never edit an applied production migration: create a new one

---

## 🧭 Conventions

- Conventional Commits (Commitlint).
- Prettier for formatting.
- ESLint for code quality with type-aware rules.

---

## ✍️ Author

Pedro
