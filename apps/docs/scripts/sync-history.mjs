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
 *   pnpm --filter docs history:sync -- --ref origin/main
 *
 * Run it on the main branch's history: a commit that exists only on a branch
 * would be listed with a link that stops working once it is squashed.
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

/*
 * A commit that touches more than this many registry items is a sweep (the
 * first commit, a restyle of every component), not a change to any one of
 * them, and listing it under each page would make every changelog the same.
 */
const BULK = 6

/** The revision to read, `HEAD` unless `--ref <rev>` says otherwise. */
function refArgument() {
  const at = process.argv.indexOf("--ref")
  return at === -1 ? "HEAD" : (process.argv[at + 1] ?? "HEAD")
}

const items = []
for (const file of readdirSync(metaDir).toSorted()) {
  if (!file.endsWith(".json")) continue
  const meta = JSON.parse(readFileSync(resolve(metaDir, file), "utf8"))
  items.push({ name: meta.name, paths: pathsOf(meta) })
}

/** The components a changed file belongs to: it is a path, or lives under one. */
function ownersOf(file) {
  return items
    .filter((item) =>
      item.paths.some((path) => file === path || file.startsWith(`${path}/`))
    )
    .map((item) => item.name)
}

/** Every commit that touched any component, newest first, with the files it changed. */
function commits() {
  const log = git([
    "log",
    refArgument(),
    `--format=${RECORD}%H${FIELD}%cs${FIELD}%s`,
    "--name-only",
    "--",
    ...items.flatMap((item) => item.paths),
  ])
  return log
    .split(RECORD)
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [head, ...files] = record.split("\n").filter(Boolean)
      const [hash, date, subject] = head.split(FIELD)
      const owners = new Set(files.flatMap(ownersOf))
      return { hash, date, subject, owners }
    })
}

const history = Object.fromEntries(items.map((item) => [item.name, []]))
for (const { hash, date, subject, owners } of commits()) {
  if (owners.size > BULK) continue
  for (const name of owners) {
    if (history[name].length < LIMIT) {
      history[name].push(toChange(hash, date, subject))
    }
  }
}

const out = resolve(root, "src/data/component-history.json")
writeFileSync(out, `${JSON.stringify(history, null, 2)}\n`)
console.log(
  `history:sync — ${Object.keys(history).length} components → ${relative(root, out)}`
)
