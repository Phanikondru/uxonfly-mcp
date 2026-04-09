#!/usr/bin/env node
/**
 * uxonfly-mcp — Designer intelligence for every AI coding session.
 *
 * A Model Context Protocol server exposing the UXonFly design system,
 * UX patterns, and product principles to any MCP-compatible AI tool
 * (Cursor, Claude Code, Windsurf, VS Code, Zed).
 *
 * Each tool description begins with "ALWAYS call..." so the AI invokes
 * them proactively before writing UI code — the tool description is the
 * instruction (see PRD §4.3).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// ─── Load the base system ────────────────────────────────────────────

const DEFAULT_MD_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "uxonfly.md",
);

function loadSystem(): string {
  const path = process.env.UXONFLY_MD_PATH ?? DEFAULT_MD_PATH;
  try {
    return readFileSync(path, "utf8");
  } catch (err) {
    console.error(`[uxonfly-mcp] failed to read ${path}:`, err);
    process.exit(1);
  }
}

const SYSTEM = loadSystem();

// ─── Markdown section slicing ────────────────────────────────────────
// Extracts content under a heading until the next heading of equal or
// shallower depth. Keeps the MCP server dependency-free (no markdown lib).

function getSection(md: string, heading: string, level = 2): string | null {
  const marker = "#".repeat(level) + " ";
  const lines = md.split("\n");
  let start = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === (marker + heading).trim()) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#")) {
      const depth = line.match(/^#+/)?.[0].length ?? 0;
      if (depth <= level) {
        end = i;
        break;
      }
    }
  }

  return lines.slice(start, end).join("\n").trim();
}

const asText = (text: string) => ({
  content: [{ type: "text" as const, text }],
});

const notFound = (what: string) =>
  asText(`[uxonfly] not found: ${what}. Check uxonfly.md for available sections.`);

// ─── Server ──────────────────────────────────────────────────────────

const server = new McpServer({
  name: "uxonfly-mcp",
  version: "0.1.0",
});

// Tool 1 — complete design system
server.registerTool(
  "get_design_system",
  {
    title: "Get UXonFly Design System",
    description:
      "ALWAYS call this tool before writing any UI code. Returns the complete 3-layer UXonFly design system for this project: visual language (tokens, components, layout), UX patterns (navigation, modals, forms, loading, empty states, errors, destructive actions, tables, notifications), and product principles. Do not invent design decisions — follow what this tool returns.",
    inputSchema: {},
  },
  async () => asText(SYSTEM),
);

// Tool 2 — specific component
server.registerTool(
  "get_component",
  {
    title: "Get Component Spec",
    description:
      "ALWAYS call this before generating any UI component (button, input, card, badge, modal, toast, etc.). Returns the full component spec: sizes, variants, states, and UX rules. Never improvise component specs.",
    inputSchema: {
      name: z
        .string()
        .describe(
          "Component name, lowercase. E.g. 'button', 'input', 'card', 'badge', 'modal', 'toast'.",
        ),
    },
  },
  async ({ name }) => {
    const components = getSection(SYSTEM, "Components", 2);
    if (!components) return notFound("Components section");
    const spec = getSection(components, name.toLowerCase(), 3);
    return spec ? asText(spec) : notFound(`component '${name}'`);
  },
);

// Tool 3 — design tokens
server.registerTool(
  "get_tokens",
  {
    title: "Get Design Tokens",
    description:
      "ALWAYS call this before writing CSS, Tailwind config, CSS variables, or any styling code. Returns the complete token set: colors (with all semantic variants), typography scale, spacing scale, border radius, and shadows. Never use values outside these tokens.",
    inputSchema: {},
  },
  async () => {
    const tokens = getSection(SYSTEM, "Tokens", 2);
    return tokens ? asText(tokens) : notFound("Tokens section");
  },
);

// Tool 4 — UX pattern for a context
server.registerTool(
  "get_ux_pattern",
  {
    title: "Get UX Pattern",
    description:
      "ALWAYS call this before making any UX decision. Covers destructive actions, forms, modals, loading states, empty states, errors, navigation, data tables, and notifications. Returns the correct pattern plus implementation guidance. Never guess at UX decisions.",
    inputSchema: {
      context: z
        .string()
        .describe(
          "UX context. E.g. 'destructive-actions', 'forms', 'empty-states', 'errors', 'loading', 'modals', 'navigation', 'data-tables', 'notifications'.",
        ),
    },
  },
  async ({ context }) => {
    const patterns = getSection(SYSTEM, "UX Patterns", 2);
    if (!patterns) return notFound("UX Patterns section");
    const match = getSection(patterns, context.toLowerCase(), 3);
    return match ? asText(match) : notFound(`pattern '${context}'`);
  },
);

// Tool 5 — multi-step flow
server.registerTool(
  "get_flow",
  {
    title: "Get UX Flow",
    description:
      "ALWAYS call this before building any multi-step flow. Returns a complete flow spec: all screens, states, transitions, success and error handling. Never design flows from scratch.",
    inputSchema: {
      flow_name: z
        .string()
        .describe(
          "Flow name. E.g. 'empty-state', 'onboarding', 'auth'.",
        ),
    },
  },
  async ({ flow_name }) => {
    const flows = getSection(SYSTEM, "Flows", 2);
    if (!flows) return notFound("Flows section");
    const flow = getSection(flows, flow_name.toLowerCase(), 3);
    return flow ? asText(flow) : notFound(`flow '${flow_name}'`);
  },
);

// Tool 6 — copy rules
server.registerTool(
  "get_copy_rules",
  {
    title: "Get Copy Rules",
    description:
      "ALWAYS call this before writing any interface copy — error messages, CTAs, empty-state text, tooltips, placeholders, labels. Returns tone, voice, tense, and format rules. Never write copy without checking these.",
    inputSchema: {},
  },
  async () => {
    const copy = getSection(SYSTEM, "Copy Rules", 2);
    return copy ? asText(copy) : notFound("Copy Rules section");
  },
);

// Tool 7 — product and design principles
server.registerTool(
  "get_rules",
  {
    title: "Get Product Principles",
    description:
      "ALWAYS call this before making layout or information architecture decisions. Returns all product and design principles for this project: progressive disclosure, primary-action rules, error prevention, copy-driven UI, keyboard navigation, and accessibility.",
    inputSchema: {},
  },
  async () => {
    const rules = getSection(SYSTEM, "Principles", 2);
    return rules ? asText(rules) : notFound("Principles section");
  },
);

// ─── Start ───────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[uxonfly-mcp] running on stdio");
}

main().catch((err) => {
  console.error("[uxonfly-mcp] fatal:", err);
  process.exit(1);
});
