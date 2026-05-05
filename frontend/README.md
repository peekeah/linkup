<div align="center">

# Linkup — Frontend

**Next.js application for real-time community chat**

[![CI](https://img.shields.io/github/actions/workflow/status/peekeah/linkup/frontend.yml?label=CI&logo=github)](https://github.com/peekeah/linkup/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

</div>


## Overview

The frontend is a Next.js 16 app (App Router) that provides the full Linkup chat experience - community rooms, private messaging, people discovery and profile management. It communicates with the backend entirely over a single persistent WebSocket connection, with HTTP used only for OAuth and profile updates.


## Feature Highlights

| Feature | Detail |
|---------|--------|
| **Google Sign-In** | Passwordless auth via NextAuth; JWT forwarded to WebSocket |
| **Community chat** | Real-time broadcast messages with upvotes, edit and delete |
| **Private messaging** | One-to-one DMs with edit and soft-delete; changes delivered live to both parties |
| **Community discovery** | Search and filter by category; join/leave with one click |
| **People search** | Find users by name; start a conversation instantly |
| **Message sender context** | Community messages show sender avatar and name for other users |
| **Responsive layout** | Desktop three-panel layout; mobile stacked panels with slide transitions |
| **Route guards** | Middleware redirects unauthenticated users away from `/dashboard` |
| **Reconnect logic** | Exponential backoff (capped at 16 s, max 5 attempts) |


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, standalone output) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York style) |
| Auth | NextAuth 4 (Google provider) |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Date utils | Day.js |
| HTTP client | Axios |
| State | React Context + `useState` (no external state manager) |
| Icons | `@tabler/icons-react` · Lucide |


## Project Structure

```
frontend/
├── public/            # Static assets
└── src/
    ├── @types/        # WS message type contracts (chat, community, user)
    ├── app/
    │   ├── api/auth/      # NextAuth route handler
    │   ├── dashboard/     # Chat layout, panels, sidebar + sub-pages
    │   └── (root)         # Landing page
    ├── components/
    │   ├── ui/            # shadcn/ui primitives
    │   └── (landing)      # Features, stats, testimonials, how-it-works, who-uses-linkup, FAQ, footer
    ├── hooks/         # useHandleMessage, useSendMessage, useDebounce
    ├── services/      # Axios HTTP client
    ├── store/         # Auth, Chat, Communities React contexts
    ├── lib/           # cn(), getDate() utilities
    └── middleware.ts  # Auth route guard
```


## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- A running Linkup backend (see [`../backend`](../backend/README.md))
- Google OAuth 2.0 credentials

### Installation

```bash
cd frontend
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_HTTP_HOST=http://localhost:5001
NEXT_PUBLIC_WS_HOST=ws://localhost:5001

NEXTAUTH_SECRET=a-strong-random-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | ✅ | Canonical URL of this app (used by NextAuth) |
| `NEXT_PUBLIC_HTTP_HOST` | ✅ | Base URL of the backend HTTP API |
| `NEXT_PUBLIC_WS_HOST` | ✅ | WebSocket URL of the backend (`ws://` or `wss://`) |
| `NEXTAUTH_SECRET` | ✅ | Signing key for NextAuth session tokens |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth 2.0 client secret |

> ℹ️ Variables prefixed `NEXT_PUBLIC_` are inlined at build time and exposed to the browser. Never put secrets in `NEXT_PUBLIC_` variables.

#### Google OAuth Setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorised redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Secret into `.env`

### Running Locally

```bash
bun run dev
# → http://localhost:3000
```

## Architecture Notes

### WebSocket Lifecycle

The WebSocket connection is created in `dashboard/layout.tsx` and lives for the entire authenticated session. On connect, three bootstrap messages are sent immediately:

```
CHAT_HISTORY           → populate community sidebar
GET_PRIVATE_CHAT_HISTORY → populate DM sidebar  
GET_COMMUNITIES        → populate discovery page
```

Reconnection uses exponential backoff: `delay = min(2ⁿ, 16) × 1000 ms`, up to 5 attempts. Clean closes (code 1000) are not retried.

### State Architecture

All real-time state lives in three React Contexts:

| Context | Responsibility |
|---------|---------------|
| `AuthContext` | User identity, WebSocket ref, reconnect flag |
| `ChatContext` | Chat history, selected chat, message maps (community + private) |
| `CommunityContext` | Discovery list, search/filter state |

The WebSocket `ref` (not state) is shared via `AuthContext` so `useSendMessage` can access it without triggering re-renders.

### Typed Message Contracts

All WebSocket messages are typed end-to-end using discriminated union types in `src/@types/`. `useHandleMessage` routes inbound messages through a `switch` on `message.type`; `useSendMessage` routes outbound messages the same way. Zod validates forms and payloads before they are sent.

### Route Guard

`src/middleware.ts` uses `next-auth/jwt` to protect all `/dashboard/*` routes server-side. Unauthenticated requests are redirected to `/`; authenticated users visiting `/` are redirected to `/dashboard`.

## Available Scripts

```bash
bun run dev       # Start dev server with hot reload
bun run build     # Production build (standalone)
bun run start     # Start production server
bun run lint      # ESLint
```

## Deployment (Vercel)

The app is pre-configured for Vercel:

1. Import the repository in the Vercel dashboard
2. Set root directory to `frontend`
3. Add all environment variables from the table above
4. Deploy — Vercel detects Next.js automatically

For other platforms, the `output: standalone` setting in `next.config.ts` produces a self-contained build:

```bash
bun run build
# Serve with:
bun .next/standalone/server.js
```

## Docker

```bash
docker build -t linkup-frontend .

docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXT_PUBLIC_HTTP_HOST=http://backend:8080 \
  -e NEXT_PUBLIC_WS_HOST=ws://backend:8080 \
  -e GOOGLE_CLIENT_ID=... \
  -e GOOGLE_CLIENT_SECRET=... \
  linkup-frontend
```

## CI

GitHub Actions runs on every push and PR to `main`/`dev` that touches `frontend/`:

1. Type-check (`tsc --noEmit`)
2. Build (`next build`) with dummy env vars

See [`.github/workflows/frontend.yml`](../.github/workflows/frontend.yml).

## License

[MIT](../LICENSE)