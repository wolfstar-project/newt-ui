#!/usr/bin/env node
/*
 * Snapshot each registry item's commit history into
 * `src/data/component-history.json`.
 *
 * A component page ends with what changed in that component and when — the
 * commits that touched its React source, its Vue source, its HTML and CSS
 * reference or its meta file. The site reads this committed copy rather than
 * asking git during the build, because the hosts that build it clone one
 * commit deep and would print an empty list. Run it before a release, or
 * whenever a component page should show a change that has just landed:
 *
 *   pnpm --filter docs history:sync
 */
import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const repo = resolve(root, "../..")
const metaDir = resolve(root, "../www/registry/meta")

/* Enough to show a component's recent life without becoming its whole log. */
const LIMIT = 8

/* Unit and record separators: neither can appear in a commit subject. */
const FIELD = "\u001f"
const RECORD = "\u001e"

function git(args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" })
}

if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") {
  console.error(
    "history:sync needs the full history — run `git fetch --unshallow` first."
  )
  process.exit(1)
}

/** Every path whose history is this component's history. */
function pathsOf(meta) {
  const kind = meta.type === "registry:block" ? "blocks" : "ui"
  const react = (meta.reactFiles ?? [`ui/${meta.name}.tsx`]).map(
    (file) => `apps/www/registry/bases/newt/${file}`
  )
  return [
    ...react,
    `apps/vue/registry/bases/newt/${kind}/${meta.name}`,
    `packages/cli/registry/html/components/${meta.name}.css`,
    `packages/cli/registry/html/components/${meta.name}.html`,
    `packages/cli/registry/html/components/${meta.name}.js`,
    `apps/www/registry/meta/${meta.name}.json`,
  ]
}

/** `feat(registry): add poll (#12)` → its type, its subject and its PR. */
function toChange(hash, date, raw) {
  const pr = raw.match(/\s\(#(\d+)\)$/)
  const subject = pr === null ? raw : raw.slice(0, pr.index)
  const conventional = subject.match(/^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/)
  const change = {
    hash,
    date,
    type: conventional?.[1] ?? "chore",
    subject: conventional?.[2] ?? subject,
  }
  if (pr !== null) change.pr = Number(pr[1])
  return change
}

function historyOf(meta) {
  const log = git([
    "log",
    `--max-count=${LIMIT}`,
    `--format=%H${FIELD}%cs${FIELD}%s${RECORD}`,
    "--",
    ...pathsOf(meta),
  ])
  return log
    .split(RECORD)
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [hash, date, subject] = record.split(FIELD)
      return toChange(hash, date, subject)
    })
}

const history = {}
for (const file of readdirSync(metaDir).toSorted()) {
  if (!file.endsWith(".json")) continue
  const meta = JSON.parse(readFileSync(resolve(metaDir, file), "utf8"))
  history[meta.name] = historyOf(meta)
}

const out = resolve(root, "src/data/component-history.json")
writeFileSync(out, `${JSON.stringify(history, null, 2)}\n`)
console.log(
  `history:sync — ${Object.keys(history).length} components → ${relative(root, out)}`
)
