<div align="center">

# Linkup — Backend

**Express + WebSocket API powering real-time community chat**

[![CI](https://img.shields.io/github/actions/workflow/status/peekeah/linkup/backend.yml?label=CI&logo=github)](https://github.com/peekeah/linkup/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-fbf0df?logo=bun)](https://bun.sh)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_7-2d3748?logo=prisma)](https://www.prisma.io/)

</div>


## Overview

The backend is a Node.js service (running on Bun) that combines a thin Express HTTP layer with a long-lived WebSocket server. Every authenticated client maintains a single WebSocket connection through which all real-time events, chat messages, community broadcasts, DMs, upvotes are exchanged. HTTP is reserved for OAuth callbacks and REST profile management.



## Feature Highlights

| Feature | Detail |
|---------|--------|
| **Real-time transport** | `ws` library; one connection per authenticated user |
| **Auth** | Google OAuth → backend JWT (7-day expiry); WS authenticated via `?token=` query param |
| **RBAC** | Three-tier: `OWNER` → `ADMIN` → `USER`; enforced per route via `authorize()` |
| **Community moderation** | Per-user timeout with expiry timestamp; checked before every chat insert |
| **Private messaging** | Full CRUD — send, edit, and soft-delete DMs; changes broadcast live to both parties |
| **Upvotes** | Toggle upvote/downvote with N:M Prisma relation |
| **Heartbeat** | Server-side ping/pong every 30 s; stale connections terminated automatically |
| **Typed contracts** | All inbound WS messages validated with Zod discriminated unions |


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) 1.x |
| HTTP framework | Express 5 |
| WebSocket | `ws` 8 |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Database | PostgreSQL 16 |
| Validation | Zod 4 |
| Auth | `jsonwebtoken` · `google-auth-library` · `bcrypt` |


## Project Structure

```
backend/
├── prisma/        # Schema, migrations, seed
├── src/
│   ├── config/        # Typed env-var loader
│   ├── controllers/   # Business logic (chat, communities, user)
│   ├── middlewares/   # Auth, RBAC, error handling
│   ├── routes/        # HTTP routes + WebSocket message dispatcher
│   ├── schema/        # Zod schemas and TS message types
│   ├── store/         # activeClients Map<userId, WebSocket>
│   ├── utils/         # DB client, JWT, bcrypt helpers
│   └── server.ts      # Entry point
├── Dockerfile
└── .env.example
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- PostgreSQL 14+ (local or remote)

### Installation

```bash
cd backend
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in every value:

```env
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/linkup_db
JWT_SECRET=a-strong-random-secret-at-least-32-chars
API_PORT=5001
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Signing key for JWTs — must be set to a strong secret in production |
| `API_PORT` | optional | Defaults to `5000` |
| `NODE_ENV` | optional | `development` or `production` |
| `FRONTEND_URL` | optional | CORS allowed origin; defaults to `http://localhost:3000` |

> ⚠️ **Never** leave `JWT_SECRET` unset in production. The fallback in `httpRoutes.ts` (`"fallback-secret"`) exists only to satisfy TypeScript — it **will** be removed in a future release.

### Database Setup

```bash
# Apply migrations (creates tables)
bun run db:migrate-dev

# Seed with sample communities and users
bun run db:seed
```

### Running Locally

```bash
bun run dev
# → server listening on port 5001
```

---

## API Reference

### HTTP Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/auth/google/callback` | — | OAuth sign-in / register |
| `GET` | `/users` | ADMIN | List all users |
| `GET` | `/users/:id` | Bearer (own ID only) | Get profile |
| `POST` | `/users/:id` | Bearer (own ID only) | Update profile |

### WebSocket Message Types

Connect with `ws://<host>?token=<jwt>`.

**Outgoing (client → server):**

| Type | Description |
|------|-------------|
| `CHAT_HISTORY` | Fetch community chat history sidebar |
| `GET_PRIVATE_CHAT_HISTORY` | Fetch private conversations list |
| `SEARCH` | Search users by name |
| `GET_CHAT` | Load messages for a community room |
| `ADD_CHAT` | Send a community message |
| `UPDATE_CHAT` | Edit own message |
| `DELETE_CHAT` | Delete message (own, or any if ADMIN/OWNER) |
| `UPVOTE_MESSAGE` | Toggle upvote on a message |
| `GET_PRIVATE_CHAT` | Load messages for a DM conversation |
| `SEND_PRIVATE_MESSAGE` | Send a DM |
| `UPDATE_PRIVATE_CHAT` | Edit own DM message |
| `DELETE_PRIVATE_CHAT` | Soft-delete own DM message |
| `CREATE_COMMUNITY` | Create a community (becomes OWNER) |
| `JOIN_COMMUNITY` | Join as member |
| `LEAVE_COMMUNITY` | Leave as member |
| `SEARCH_COMMUNITY` | Search communities by name/category |
| `GET_COMMUNITIES` | List all communities with stats |
| `ADD_ADMIN` / `REMOVE_ADMIN` | Manage admins (OWNER only) |
| `GIVE_TIMEOUT` / `CLEAR_TIMEOUT` | Moderate members (OWNER/ADMIN) |

**Incoming (server → client):**

| Type | Description |
|------|-------------|
| `CHAT_HISTORY` | Updated community list sidebar |
| `GET_PRIVATE_CHAT_HISTORY` | Updated DM conversations list |
| `SEARCH` | User search results |
| `GET_CHAT` | Room messages |
| `GET_PRIVATE_CHAT` | DM messages |
| `BROADCAST_MESSAGE` | Updated room messages (sent to all room members) |
| `UPVOTE_MESSAGE` | Updated single message after vote change |
| `GET_COMMUNITIES` | Community list with stats |
| `SEARCH_COMMUNITY` | Filtered community results |
| `JOIN_COMMUNITY` | Acknowledgement after joining |
| `LEAVE_COMMUNITY` | Acknowledgement after leaving |
| `ERROR` | Error response with message |


## Data Model

```
User ─────────────────────────────────────────────┐
  │ owns / adminOf / memberOf (Community)          │
  │ sent (ChatMessage) ── upvotes (ChatMessage)    │
  │ sent / received (PrivateMessage)               │
  └ timeouts (Timeout → Community)                 │
                                                   │
Community ─────────────────────────────────────────┘
  │ chatMessages (ChatMessage)
  └ timeouts (Timeout)
```

Key design decisions:

- `User.googleId` is `@unique NOT NULL` — all accounts are OAuth-only; no password auth
- `Timeout` has a compound unique constraint on `(userId, communityId)` — one active timeout per user per community
- `ChatMessage` upvotes use Prisma's implicit N:M (`_messageUpvotes`) for clean toggle logic
- `PrivateMessage` uses sender/recipient foreign keys with separate indexes for efficient query both ways


## Database Commands

```bash
bun run db:migrate-dev          # Create and apply a new migration (dev)
bun run db:migrate-prod         # Apply pending migrations (production)
bun run db:migrate-reset        # Reset and re-run all migrations
bun run db:seed                 # Run seed script
bun run db:push                 # Sync schema without migration (prototyping only)
bun run studio                  # Open Prisma Studio
```


## Docker

```bash
# Build image
docker build -t linkup-backend .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your-secret \
  -e API_PORT=8080 \
  linkup-backend
```

> Make sure `API_PORT` matches the exposed port in your Docker/Compose config.


## CI

GitHub Actions runs on every push and PR to `main`/`dev`:

1. Type-check (`tsc --noEmit`)
2. Generate Prisma client
3. Build (`tsc`)

See [`.github/workflows/backend.yml`](../.github/workflows/backend.yml).


## License

[MIT](../LICENSE)