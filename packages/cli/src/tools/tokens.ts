/**
 * The `--newt-*` design tokens, inlined at author time from
 * `packages/newt-ui/registry/html/tokens.css` (the source of truth).
 *
 * The published `newt-ui-vue` package only ships `dist`, so the tokens are
 * embedded rather than read from disk at runtime. Keep this in sync with
 * `registry/html/tokens.css` whenever the tokens change.
 */
const TOKENS_CSS = `:root {
  /* Surfaces */
  --newt-bg-base: #1e1f22;
  --newt-bg-surface: #2b2d31;
  --newt-bg-elevated: #313338;
  --newt-bg-floating: #1e1f22;
  --newt-bg-input: #1e1f22;
  --newt-bg-hover: rgba(78, 80, 88, 0.4);
  --newt-bg-active: rgba(78, 80, 88, 0.6);
  --newt-border: #3f4147;

  /* Text */
  --newt-text-primary: #f2f3f5;
  --newt-text-secondary: #b5bac1;
  --newt-text-muted: #949ba4;
  --newt-text-link: #00a8fc;

  /* Brand */
  --newt-brand: #5865f2;
  --newt-brand-hover: #4752c4;
  --newt-brand-active: #3c45a5;

  /* Status */
  --newt-online: #23a55a;
  --newt-idle: #f0b232;
  --newt-dnd: #f23f42;
  --newt-offline: #80848e;
  --newt-danger: #da373c;
  --newt-danger-hover: #a12828;

  /* Type */
  --newt-font-sans: "Inter", "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --newt-font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --newt-font-display: "Inter", sans-serif;

  /* Radius */
  --newt-radius-sm: 4px;
  --newt-radius-md: 8px;
  --newt-radius-lg: 12px;
  --newt-radius-full: 9999px;

  /* Shadows */
  --newt-shadow-elevation-low: 0 1px 0 rgba(0,0,0,0.2), 0 1.5px 0 rgba(0,0,0,0.05), 0 2px 0 rgba(0,0,0,0.05);
  --newt-shadow-elevation-high: 0 8px 16px rgba(0,0,0,0.24);

  /* Motion */
  --newt-ease: cubic-bezier(0.3, 0.7, 0.4, 1);
  --newt-duration-fast: 100ms;
  --newt-duration-base: 150ms;
}`

export const TOKENS_MARKER = "--newt-bg-base"

/**
 * The `:root { --newt-* }` block wrapped for Tailwind `@layer base`, ready to
 * be appended to the user's global stylesheet.
 */
export function getTokensCssBlock(): string {
  const indented = TOKENS_CSS.split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n")
  return [
    "",
    "/* newt/ui design tokens — source of truth: newt-ui/registry/html/tokens.css */",
    "@layer base {",
    indented,
    "",
    "  .newt-root {",
    "    font-family: var(--newt-font-sans);",
    "    color: var(--newt-text-primary);",
    "    -webkit-font-smoothing: antialiased;",
    "  }",
    "}",
    "",
  ].join("\n")
}
