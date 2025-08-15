# 🚀 ts-backend-production-template

A robust, production-ready backend template for Node.js using TypeScript and Express.  
Includes best practices for code quality, error handling, logging, and developer experience.

---

## 📦 Features

- TypeScript with strict settings and type-checked ESLint (typescript-eslint recommendedTypeChecked).
- Express 5 with modular routing and middlewares.
- Centralized error handling and consistent HTTP responses.
- Not Found (404) and Method Not Allowed (405) helpers.
- Winston logging (ready for console/file/MongoDB transports).
- Mongoose ready (optional MongoDB integration).
- ESLint + Prettier integration.
- Husky + lint-staged + Commitlint ready for conventional commits.
- Nodemon for hot reload in development.
- Environment variables via .env files.

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
      apiController.ts         # Example controller (GET /api/self)
    middleware/
      globalErrorHandler.ts    # Global error handler (final middleware)
    util/
      httpResponse.ts          # Standard success response helper
      httpError.ts             # Helper to build/pass HttpError via next()
      errorObject.ts           # Builds the HttpError object (privacy-aware)
      notFoundError.ts         # Route/entity 404 helpers
      methodNotAllowedError.ts # 405 helper for route.all()
      logger.ts                # Winston logger (referenced by errorObject)
    constant/
      responseMessage.ts       # Centralized response messages
      application.ts           # Application constants (e.g. environment)
    config/
      config.ts                # App configuration (reads env vars)
    model/                     # (Ready for Mongoose models)
    service/                   # (Business logic)
  .env.example
  package.json
  tsconfig.json
  eslint.config.mjs
  README.md
```

---


## ⚙️ Environment Variables

Copy the example and adjust values:

```bash
cp .env.example .env
```

Example variables (from .env.example):
```
PORT=3003
SERVER_URL=http://localhost
ENV=development
LOG_LEVEL=info
```

Notes:
- npm start uses: node --env-file=.env.production dist/server.js
- For production, create a .env.production file.

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

---


## 🧭 Conventions

- Conventional Commits (Commitlint).
- Prettier for formatting.
- ESLint for code quality with type-aware rules.

---

## ✍️ Author

Pedro
