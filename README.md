# ⚗️ CodeAlchemist

> **Transmute JavaScript fundamentals into Python • Rust • TypeScript mastery** — with golden toggleable examples, real-time execution, and stunning debugging visualization.

![License](https://img.shields.io/badge/license-MIT-gold)
![Runtime](https://img.shields.io/badge/runtime-Bun-f472b6)
![Framework](https://img.shields.io/badge/framework-Next.js_15-000)

---

## 🚀 Quick Start (Bun Required)

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Install dependencies
bun install

# 3. Start development server
bun run dev

# 4. Open in browser
open http://localhost:3000
```

> ⚠️ **Bun is required** — this project will not run on plain Node.js. All scripts, API routes, and execution are optimized for Bun.

---

## 🏗️ Architecture

```
codealchemist/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Main application page
│   │   ├── globals.css         # Alchemical design system
│   │   └── api/
│   │       └── execute/ts/     # TypeScript execution endpoint
│   ├── components/
│   │   ├── layout/             # Sidebar, TopBar
│   │   ├── editor/             # CodeEditor, GoldenExample, OutputPane
│   │   ├── visualization/      # VisualizationPanel (variables, call stack)
│   │   └── effects/            # ParticleEffect
│   ├── data/
│   │   └── curriculum.ts       # 12 lesson layers + exercises
│   ├── lib/
│   │   ├── editor/             # Monaco theme + keybindings
│   │   ├── execution/          # Multi-language executor
│   │   └── utils.ts            # Tailwind merge utility
│   ├── stores/
│   │   └── index.ts            # Zustand stores (editor, execution, progress)
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets, PWA manifest
├── package.json                # Bun scripts
├── bunfig.toml                 # Bun configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript strict config
└── SKILL.md                    # Development best practices
```

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
| `F10` | Step Over (debug) |
| `F11` | Step Into (debug) |

---

## 📚 Curriculum (12 Layers)

1. ⚗️ Variables & Immutability
2. 🧪 Primitive & Compound Data Types
3. 🔀 **Control Flow & Pattern Matching** *(fully implemented)*
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

## 🔧 Execution Engines

| Language | Engine | Environment |
|---|---|---|
| **Python, Rust, TS** | Custom Docker Runner | Server-side (Koyeb / Render / AWS) |

---

## 🚢 Deployment

CodeAlchemist uses a split-deployment model for security and performance.

### 1. Deploy Frontend (Vercel)
Deploy the main Next.js repository to Vercel. Ensure you provide the `DATABASE_URL` (using the Transaction Pooler port 6543) and all OAuth credentials.

### 2. Deploy Custom Runner (Koyeb / Render)
The execution engine must run in a Docker container to provide the necessary compilers (Python, Rust, Node).
1. Connect Koyeb or Render to this repository.
2. Set the build directory to `scripts/runner`.
3. Set an environment variable `AUTH_TOKEN` with a secure password.
4. Deploy the Docker container.

### 3. Link them together
Add the Koyeb/Render URL to your Vercel Environment Variables as `RUNNER_API_URL` and the secret password as `RUNNER_AUTH_TOKEN`. Redeploy Vercel.

---

## 📋 Tech Stack

- **Runtime:** Bun v1.1+
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Editor:** Monaco (@monaco-editor/react)
- **Animation:** Framer Motion 12
- **State:** Zustand 5
- **Icons:** Lucide React
- **UI Primitives:** Radix UI

---

## License

MIT © CodeAlchemist
