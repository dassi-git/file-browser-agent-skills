# File Browser Agent

A Windows desktop app (Electron) that works like a file browser, with a chat panel
in the style of Claude Code. The chat is connected as an agent to your file system
and automatically receives the selected file or folder as context.

The agent can read, list, and inspect files (and write them — with your approval).
It also supports **Agent Skills**: `SKILL.md` folders that are loaded at runtime to
extend what the agent can do.

> The full product spec, IPC channels, and tools are documented in [SPEC.md](SPEC.md).

---

## Requirements

- Node.js 18+
- Windows (the app is built around Windows drives, `safeStorage`, and Explorer)
- An Anthropic API key (enter it in the app, or via `.env` — see below)

---

## Install & Run

```bash
# 1. Install dependencies
npm i

# 2. Finish installing the Electron binary
#    Required step — without it the app won't start correctly
node node_modules/electron/install.js

# 3. Run in development mode
npm run dev

> ⚠️ Don't skip step 2. In this setup `npm i` doesn't always fully download the
> Electron binary, and running `node node_modules/electron/install.js` completes it.
| `npm run dev` | Run in development mode (HMR) |

## 📚 Complete Documentation

This project includes comprehensive documentation for all levels:

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[FAQ.md](FAQ.md)** - 40+ common questions answered
- **[README_IMPLEMENTATION.md](README_IMPLEMENTATION.md)** - Detailed walkthrough

### Technical Guides
- **[API.md](API.md)** - Complete API reference
- **[ARCHITECTURE.md](../../../ARCHITECTURE.md)** - System design
- **[DEBUGGING.md](DEBUGGING.md)** - Debugging troubleshooting guide
- **[PERFORMANCE.md](PERFORMANCE.md)** - Performance optimization

### Contributing & Community
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards
- **[SUPPORT.md](SUPPORT.md)** - Support and sponsorship
- **[SECURITY.md](SECURITY.md)** - Security policy

### Reference
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[MAINTENANCE.md](MAINTENANCE.md)** - For maintainers
- **[LICENSE](LICENSE)** - MIT license
- **[examples/ADVANCED_EXAMPLES.md](examples/ADVANCED_EXAMPLES.md)** - Professional patterns

**Total**: 16+ documentation files covering everything from beginner to expert level.

| `npm run build` | Build the app (`electron-vite build`) |
| `npm start` | Run the build (preview) |
| `npm run typecheck` | Type-check both main and renderer |

---

## Skills folder

Skills are stored in **your user folder**, by default under:

```
C:\Users\<username>\.file-browser-agent\skills
```

(for example: `C:\Users\user1\.file-browser-agent\skills`)

Each skill is a sub-folder containing a `SKILL.md` file. When you install a skill
with the "Add skill" button in the app, it is extracted into this folder.

**Make sure this folder exists, or the app won't work.** You can create it manually:

```powershell
mkdir "$env:USERPROFILE\.file-browser-agent\skills"
```

### Changing the folder location

The location is controlled by the `FILE_BROWSER_SKILLS_DIR` environment variable.
To change it, copy [.env.example](.env.example) to `.env` and edit the value:

```env
# Defaults to ~/.file-browser-agent/skills when unset.
FILE_BROWSER_SKILLS_DIR=C:\Users\user1\.file-browser-agent\skills
```

The `.env` file is loaded when the Electron main process starts.

---

## API key

There are two ways to provide the Anthropic API key:

1. **In the app** — on first launch you'll be prompted to enter a key; it is stored
   encrypted using Electron `safeStorage`.
2. **Via `.env`** — add `ANTHROPIC_API_KEY=sk-ant-...` to your `.env` file.

---

## Tech stack

- **Electron** + **electron-vite** — scaffolding and bundling
- **React 19** + **TypeScript** — renderer UI
- **Zustand** — state management
- **@anthropic-ai/sdk** + **ai** — agent loop and tools
- **fflate** — extracting skills from zip files

Project structure:

```
src/
├─ main/        ← Main process (Node): IPC, fs-service, agent, secrets, skills
├─ preload/     ← contextBridge: exposes a small window.api to the renderer
└─ renderer/    ← React app (chat, browser, tree)
```
