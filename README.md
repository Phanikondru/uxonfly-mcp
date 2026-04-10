# UXonFly

> An open-source design system for AI coding sessions.
> Strong opinions. MIT licensed.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## What this is

Every AI coding session starts blind. Generic shadcn components. Default
Tailwind colors. Modal-inside-a-modal. Empty states with no CTA. Errors in
toasts that should be inline. Destructive actions with single-click delete.

UXonFly is a curated set of design and UX rules — tokens, components, UX
patterns, flows, copy rules, and principles — that your AI reads before
generating UI. The rules live in one markdown file: `uxonfly.md`.

**Two ways to use it. Same content, same rules:**

1. **As a file** — copy `uxonfly.md` into your project. Your AI reads it natively every session. Zero install.
2. **As an MCP server** — run `uxonfly-mcp` and your AI invokes 7 tools (`get_component`, `get_ux_pattern`, …) on demand.

The file install is the recommended starting point. The MCP server is the
upgrade for power users who want tool-call precision.

MIT licensed. Fork it. Improve it. Send a PR.

## What's in it

- **5 token categories** — colors, typography, spacing, shape, shadows
- **6 components** — button, input, card, badge, modal, toast
- **9 UX patterns** — navigation, modals, forms, loading, empty states, errors, destructive actions, data tables, notifications
- **3 flows** — empty-state, onboarding, auth
- **Copy rules** — voice, tense, errors, CTAs, tooltips, placeholders, labels
- **7 principles** — accessibility first, one primary action, error prevention, progressive disclosure, copy-driven, keyboard navigable, trust the system

Strong opinions. Border-first. Modern SaaS aesthetic (Linear / Stripe / Vercel-aligned).

---

## Install option 1 — file (recommended, 30 seconds)

Run **one command** from your project root. Pick the line for your AI tool — it downloads the rules and saves them with the exact filename your tool auto-loads on every session.

> **Important:** the filename matters. If the file is saved as `uxonfly.md`, your AI will **not** auto-read it. Each command below saves it with the right name in one shot so you can't miss the rename step.

```bash
# Claude Code
curl -o CLAUDE.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# Cursor
curl -o .cursorrules https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# Windsurf
curl -o .windsurfrules https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# Gemini CLI
curl -o GEMINI.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# Zed / Google Antigravity / any tool using the AGENTS.md convention
curl -o AGENTS.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# GitHub Copilot
mkdir -p .github && curl -o .github/copilot-instructions.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# JetBrains Junie
mkdir -p .junie && curl -o .junie/guidelines.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md

# Aider
curl -o CONVENTIONS.md https://raw.githubusercontent.com/Phanikondru/uxonfly-mcp/main/uxonfly.md
# then run: aider --read CONVENTIONS.md
```

Filename reference if your tool isn't listed:

| AI tool | Save as | Location |
| --- | --- | --- |
| **Claude Code** | `CLAUDE.md` | project root |
| **Cursor** | `.cursorrules` | project root |
| **Windsurf** | `.windsurfrules` | project root |
| **Gemini CLI** | `GEMINI.md` | project root |
| **Zed** | `AGENTS.md` | project root |
| **Google Antigravity** | `AGENTS.md` | project root |
| **GitHub Copilot** | `copilot-instructions.md` | `.github/` |
| **Aider** | `CONVENTIONS.md` (then `aider --read CONVENTIONS.md`) | project root |
| **JetBrains Junie** | `guidelines.md` | `.junie/` |
| **Any other tool** | `AGENTS.md` | project root (emerging universal convention) |

**That's it. No npm install, no config, no login.** Works with any AI tool that reads project-level context files — which is most of them in 2026.

### Verify it's actually loaded (do this once)

The file install has one silent failure mode: if the filename is wrong, your AI won't read it — and you won't know until you get generic UI back. Confirm in 10 seconds by asking your AI:

> *"What design system rules are you following in this project? List the token categories and components by name."*

If it mentions UXonFly, the token categories (colors, typography, spacing, shape, shadows), or components like `button` / `input` / `card` — it's loaded. If it says "I don't see any design system" or invents generic answers, the file isn't being read. Check the filename and location against the table above.

If you want a zero-ambiguity install where the AI is *forced* to load rules before generating UI, use the MCP server below instead.

---

## Install option 2 — MCP server (power users)

If you want your AI to invoke specific tools (`get_component`,
`get_ux_pattern`, `get_tokens`, …) on demand instead of reading the whole
file every prompt, run UXonFly as a local MCP server.

Published to npm as [`uxonfly-mcp`](https://www.npmjs.com/package/uxonfly-mcp).
MCP is a standard protocol — any MCP-compatible AI tool can load this server
with the same command: `npx -y uxonfly-mcp`. Only the config location varies
per tool. Snippets for the most common tools below.

### Claude Code

```bash
claude mcp add uxonfly -- npx -y uxonfly-mcp
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "uxonfly": {
      "command": "npx",
      "args": ["-y", "uxonfly-mcp"]
    }
  }
}
```

### Claude Desktop

On macOS, edit `~/Library/Application Support/Claude/claude_desktop_config.json`.
On Windows, edit `%APPDATA%\Claude\claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "uxonfly": {
      "command": "npx",
      "args": ["-y", "uxonfly-mcp"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "uxonfly": {
      "command": "npx",
      "args": ["-y", "uxonfly-mcp"]
    }
  }
}
```

### VS Code (with MCP support)

Add to `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "uxonfly": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "uxonfly-mcp"]
    }
  }
}
```

### Zed

Add to `~/.config/zed/settings.json` under `context_servers`:

```json
{
  "context_servers": {
    "uxonfly": {
      "command": {
        "path": "npx",
        "args": ["-y", "uxonfly-mcp"]
      }
    }
  }
}
```

### Any other MCP-compatible tool

MCP is a standard protocol. The command is always the same across tools:

```bash
npx -y uxonfly-mcp
```

Gemini CLI, Google Antigravity, JetBrains Junie, and a growing list of other
editors and agents support MCP. Consult your tool's documentation for where
to register MCP servers, then use the command above.

### Tools without MCP support

For tools that don't speak MCP yet (Aider, basic terminal LLM CLIs, older
editors), use **Install option 1** above. The file install works with any AI
that reads project context files.

### Install from source (contributors)

If you want to run the MCP server from a local clone — for example, to
modify the base `uxonfly.md` or the server code — build from source and
point your AI tool at the compiled binary:

```bash
git clone https://github.com/Phanikondru/uxonfly-mcp.git
cd uxonfly-mcp
npm install
npm run build
```

Then in your MCP config, replace `npx -y uxonfly-mcp` with
`node /absolute/path/to/uxonfly-mcp/build/index.js`.

### Available tools

| Tool | When AI calls it | Returns |
| --- | --- | --- |
| `get_design_system` | Before any UI task | Full system |
| `get_component` | Before generating a component | Component spec |
| `get_tokens` | Before writing CSS / Tailwind | Tokens |
| `get_ux_pattern` | Before any UX decision | Pattern |
| `get_flow` | Before any multi-step flow | Flow spec |
| `get_copy_rules` | Before writing interface copy | Copy rules |
| `get_rules` | Before layout / IA decisions | Principles |

Each tool description begins with `ALWAYS call…` so your AI invokes them
proactively before generating UI code (the trick: the tool description
itself is the instruction).

### Custom rulebook

Point the MCP server at your own version of `uxonfly.md` via the
`UXONFLY_MD_PATH` environment variable:

```bash
UXONFLY_MD_PATH=/absolute/path/to/your/uxonfly.md npx -y uxonfly-mcp
```

---

## Local development

```bash
git clone https://github.com/Phanikondru/uxonfly-mcp.git
cd uxonfly-mcp
npm install
npm run dev    # run with tsx
npm run build  # compile to ./build
npm start      # run the compiled server
```

---

## Contributing

The whole point of this project: one designer's opinions become a shared
standard the community keeps improving. PRs welcome.

How to help:

- Open an issue if you think a rule is wrong, missing, or unclear
- Send a PR for new components, patterns, or principles you've battle-tested
- Add real-world usage examples (apps you've built with `uxonfly.md`)

Goal: make UXonFly *better* than any one designer's taste alone.

---

## About

Built by **Phanindhra Kondru** — designer with 4 years of production UX
experience, building in public.

Just trying to build good things. **Design + AI + Code.**

UXonFly was built with Gemini, Cursor, and the rules in `uxonfly.md`
itself — the same system that ships with this package. The tool eats its
own dog food.

### Connect

- X: [@Phanikondru](https://x.com/Phanikondru)
- LinkedIn: [Phanindhra Kondru](https://www.linkedin.com/in/phanindhra-kondru-436220205/)

---

## License

MIT. Use it commercially. Fork it. Modify it. Just keep the LICENSE file.
