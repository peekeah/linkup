<div align="center">

# Linkup

**Real-time community chat built on WebSockets**

[![Backend CI](https://img.shields.io/github/actions/workflow/status/peekeah/linkup/backend.yml?label=backend&logo=github)](https://github.com/peekeah/linkup/actions)
[![Frontend CI](https://img.shields.io/github/actions/workflow/status/peekeah/linkup/frontend.yml?label=frontend&logo=github)](https://github.com/peekeah/linkup/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-fbf0df?logo=bun)](https://bun.sh)

[Overview](#overview) · [Architecture](#architecture) · [Quick Start](#quick-start) · [Development](#development) · [Deployment](#deployment) · [Contributing](#contributing)

</div>

---

## Overview

Linkup is a full-stack real-time chat application that lets users join topic-based communities, exchange private messages and conversations all over a persistent WebSocket connection.

**Key capabilities:**

- **Community chat** — create or join rooms by category; broadcast messages to all online members
- **Private messaging** — real-time one-to-one DMs with edit and soft-delete; changes delivered live to both parties
- **Role-based moderation** — three-tier RBAC (Owner / Admin / Member) with per-user community timeouts
- **Message upvotes** — community members can upvote or rescind votes on any message
- **Google OAuth** — passwordless sign-in via NextAuth → backend JWT exchange
- **Live presence** — online member count updated in real time via active-client map
- **Light/dark theme** — system-aware with user toggle


## Repository Structure

```
linkup/
├── backend/          # Node.js + Express + WebSocket API
├── frontend/         # Next.js 16 application
├── docker-compose.yml
└── README.md         ← you are here
```

Each sub-project ships its own README with local setup instructions:

| Package | Stack | README |
|---------|-------|--------|
| `backend/` | Bun · Express 5 · ws · Prisma 7 · PostgreSQL | [backend/README.md](backend/README.md) |
| `frontend/` | Next.js 16 · NextAuth · Tailwind CSS 4 · shadcn/ui | [frontend/README.md](frontend/README.md) |


## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  Next.js (SSR)  ←──HTTP──→  NextAuth            │
│       │                         │               │
│       └────────WebSocket────────┘               │
└────────────────────┬────────────────────────────┘
                     │ ws://  +  http://
┌────────────────────▼────────────────────────────┐
│              Backend (Express + ws)              │
│                                                  │
│  HTTP Routes          WebSocket Routes           │
│  ─────────────        ─────────────────          │
│  POST /auth/google    Chat messages              │
│  GET  /users/:id      Community CRUD             │
│  POST /users/:id      Private messages           │
│  GET  /health         Presence tracking          │
│                                                  │
│  activeClients: Map<userId, WebSocket>           │
└────────────────────┬────────────────────────────┘
                     │ Prisma (connection pool)
┌────────────────────▼────────────────────────────┐
│              PostgreSQL                          │
│  User · Community · ChatMessage                  │
│  PrivateMessage · Timeout · Address              │
└─────────────────────────────────────────────────┘
```

### Message flow

All real-time traffic (chat, community events, presence) travels over a single WebSocket connection per user, authenticated via a JWT query parameter on the upgrade request. The server maintains an `activeClients` map keyed by `userId` to enable targeted DM delivery and community broadcast.

HTTP is used only for OAuth callback and REST profile management.



## Quick Start

### Prerequisites

| Tool | Minimum version |
|------|----------------|
| [Bun](https://bun.sh) | 1.x |
| [Docker](https://www.docker.com/) & Docker Compose | 24+ |
| Google OAuth credentials | — |

### Run with Docker Compose

```bash
git clone https://github.com/peekeah/linkup.git
cd linkup

# Copy and fill in the required secrets
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

> **Heads-up:** see the individual READMEs for required environment variables before running.

### Run without Docker

```bash
# 1. Start a local PostgreSQL instance (or point to a remote one)

# 2. Backend
cd backend
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET
bun install
bun run db:migrate-dev
bun run dev                 # http://localhost:5001

# 3. Frontend (separate terminal)
cd frontend
cp .env.example .env        # fill in NEXTAUTH_SECRET, GOOGLE_*
bun install
bun run dev                 # http://localhost:3000
```

## Development

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready; CI must pass |


CI runs lint + typecheck + build for both packages on every push to `main` and on all pull requests targeting those branches.

### Database migrations

```bash
cd backend

# Create a new migration
bun run db:migrate-dev --name <descriptive-name>

# Apply migrations in production
bun run db:migrate-prod

# Reset dev database and re-seed
bun run db:reset
```

### Code style

Both packages use **TypeScript strict mode**. The backend enforces Zod schema validation on every inbound WebSocket message. Run `bunx tsc --noEmit` locally before pushing.

## Deployment

### Backend

The backend Dockerfile produces a minimal Alpine image. Set the following environment variables in your hosting platform:

```
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-random-secret>
API_PORT=8080
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

Run migrations before the first deploy (or in a release phase):

```bash
bunx prisma migrate deploy
```

### Frontend

The Next.js app is configured for `output: standalone` and deploys to Vercel out of the box. Set environment variables in the Vercel dashboard — never commit secrets to the repository.


## Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a PR.

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes and ensure CI passes locally (`bunx tsc --noEmit` + `bun run build`)
4. Open a pull request targeting `dev`


## Special Thanks

- [Shrenaath SG](https://www.linkedin.com/in/shrenaath-sg-91245019a) — UI design contributions
- [Niraj Chafle](https://www.linkedin.com/in/niraj-chafle) — design feedback and ideas

## License

[MIT](LICENSE)