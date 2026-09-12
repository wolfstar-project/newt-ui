#!/usr/bin/env node
/**
 * Deprecation shim. `@newtui/vue` and `@newtui/react` were merged into a
 * single unscoped `newtui` package; this bin forwards every invocation there
 * so existing scripts keep working until the next major removes it.
 */
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const cli = path.resolve(
  path.dirname(require.resolve("newtui/package.json")),
  "dist/index.js"
)

console.warn(
  "@newtui/vue is deprecated. Use `npx newtui` instead — forwarding this run to it."
)

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
})
child.on("exit", (code) => process.exit(code ?? 0))
