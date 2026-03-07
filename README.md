# ⚗️ CodeAlchemist

> **Transmute JavaScript fundamentals into Python • Rust • TypeScript mastery** — with golden toggleable examples, real-time execution, and stunning debugging visualization.

![License](https://img.shields.io/badge/license-MIT-gold)
![Runtime](https://img.shields.io/badge/runtime-Bun-f472b6)
![Framework](https://img.shields.io/badge/framework-Next.js_15-000)

---

## ✨ Features

- **Multi-Language Editor** — Write code in Python, Rust, or TypeScript with a premium sliding pill tab switcher
- **Golden Examples** — Toggleable reference solutions that reveal the "perfect" answer after you solve each exercise
- **Real-Time Execution** — Run your code instantly with our custom runner API
- **Visual Debugging** — Watch variables change and call stack evolve in real-time
- **Progress Tracking** — Earn XP, maintain streaks, and unlock badges as you master each language
- **Responsive Design** — Seamless experience on desktop and mobile with view toggling
- **Authentication** — Secure sign-in with Google or GitHub OAuth
- **Dashboard** — Track your learning progress, mastery percentages, and achievements

---

## 🚀 Quick Start

### Prerequisites

- **Bun** v1.1+ (required)
- **PostgreSQL** database (local or hosted)

### Setup

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Clone and install dependencies
bun install

# 3. Copy environment variables
cp .env.local.example .env.local

# 4. Configure your .env.local
# - Set BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - Configure OAuth credentials (Google/GitHub)
# - Set DATABASE_URL (PostgreSQL)

# 5. Set up the database
bun run db:push

# 6. Start development server
bun run dev

# 7. Open in browser
open http://localhost:3000
```

> ⚠️ **Bun is required** — this project uses Bun for all scripts, API routes, and execution. It will not run on plain Node.js.

---

## 📋 Environment Variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Secret key for Better Auth (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Base URL for auth (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `DATABASE_URL` | PostgreSQL connection string |
| `RUNNER_API_URL` | URL for code execution runner API |
| `RUNNER_AUTH_TOKEN` | Auth token for runner API |

---

## 🏗️ Project Structure

```
codealchemist/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Auth route group (sign-in, sign-up)
│   │   │   ├── layout.tsx     # Auth layout with fonts
│   │   │   ├── sign-in/       # Sign in page
│   │   │   └── sign-up/       # Sign up page
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Better Auth endpoints
│   │   │   ├── execute/      # Code execution
│   │   │   ├── run/           # Run code
│   │   │   └── stats/         # User stats
│   │   ├── dashboard/         # User dashboard
│   │   ├── workspace/        # Main editor workspace
│   │   ├── layout.tsx         # Root layout (fonts, metadata)
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Tailwind + CSS variables
│   │
│   ├── components/
│   │   ├── auth/              # Auth components (providers, buttons)
│   │   ├── dashboard/         # Dashboard UI components
│   │   ├── editor/            # Monaco editor, language switcher, action bar
│   │   ├── effects/           # Particle effects
│   │   ├── landing/           # Landing page sections
│   │   ├── layout/            # Sidebar, TopBar
│   │   ├── marketing/         # Hero, Features, Pricing, FAQ, etc.
│   │   ├── panels/            # Instructions, Output, Visualization panels
│   │   └── workspace/         # Workspace-specific components
│   │
│   ├── db/
│   │   ├── index.ts           # Database connection (Drizzle)
│   │   └── schema.ts          # Table definitions
│   │
│   ├── hooks/                 # Custom React hooks
│   │
│   ├── lib/
│   │   ├── editor/            # Monaco theme, keybindings
│   │   ├── execution/         # Multi-language executor
│   │   └── utils.ts           # Utilities
│   │
│   ├── stores/
│   │   └── index.ts           # Zustand stores (editor, execution, progress)
│   │
│   ├── data/
│   │   └── curriculum.ts     # Lesson layers + exercises
│   │
│   └── types/
│       └── index.ts           # TypeScript definitions
│
├── public/                     # Static assets, PWA manifest
├── .env.local.example         # Environment template
├── package.json               # Bun scripts
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript strict config
└── drizzle.config.ts          # Drizzle ORM config
```

---

## 📚 Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push database schema |
| `bun run db:studio` | Open Drizzle Studio |

---

## 🎨 Design System

**Alchemical Dark Theme:**

| Token | Hex | Usage |
|---|---|---|
| `--color-void` | `#0a0612` | Page background |
| `--color-abyss` | `#110b20` | Panel backgrounds |
| `--color-deep` | `#1a1030` | Editor background |
| `--color-gold` | `#f5c542` | Primary accent, buttons |
| `--color-python` | `#3776ab` | Python tab/indicator |
| `--color-rust` | `#ce422b` | Rust tab/indicator |
| `--color-typescript` | `#3178c6` | TypeScript tab/indicator |
| `--color-neon-cyan` | `#00f0ff` | Visualization accents |
| `--color-neon-magenta` | `#ff00ff` | Error/special accents |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + Enter` | Transmute & Run |
| `Ctrl/Cmd + B` | Toggle Golden Example |

---

## 📚 Curriculum (12 Layers)

1. ⚗️ Variables & Immutability
2. 🧪 Primitive & Compound Data Types
3. 🔀 Control Flow & Pattern Matching
4. 🔮 Functions & Closures
5. 🔗 Ownership & References
6. 📚 Collections & Iterators
7. 🛡️ Error Handling & Result/Option
8. 📦 Modules & Project Structure
9. 🧬 Generics & Traits/Interfaces
10. ⚡ Async & Concurrency
11. 🪄 Metaprogramming & Macros
12. 🏎️ Performance & Memory Mastery

---

## 🗄️ Database

The project uses **Drizzle ORM** with **PostgreSQL**. The schema includes:

- `users` — User accounts (managed by Better Auth)
- `userStats` — XP, streak, total exercises completed
- `userProgress` — Per-layer, per-language mastery percentages
- `submissions` — Code submission history

Run `bun run db:push` after modifying `src/db/schema.ts`.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables (Production)

```
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://... (use Transaction Pooler port 6543)
```

### Code Execution

For security, code execution runs in a separate service. Configure:
- `RUNNER_API_URL` — Your execution service URL
- `RUNNER_AUTH_TOKEN` — Secret token for authentication

---

## 📋 Tech Stack

- **Runtime:** Bun v1.1+
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CSS Variables
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth
- **Editor:** Monaco Editor
- **Animation:** Framer Motion
- **State:** Zustand
- **Icons:** Lucide React

---

## License

MIT © CodeAlchemist
