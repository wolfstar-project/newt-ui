import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"

/*
 * `changeset version` plus a page on the site. The packages' CHANGELOG.md
 * files and the GitHub releases come from Changesets already; this writes the
 * same release into `apps/docs/content/changelog/` so `/changelog` on the
 * site stops depending on someone remembering to write it by hand.
 *
 * The changesets are read before `changeset version` deletes them, and the
 * versions after it bumps the manifests. The entry lands in the release PR,
 * where it can be edited like any other page before it ships.
 */

const rootDir = new URL("../", import.meta.url)
const changesetDir = new URL(".changeset/", rootDir)
const entryDir = new URL("apps/docs/content/changelog/", rootDir)
const workspaceDirs = ["packages/"]

/**
 * @typedef {{ packages: string[], summary: string }} Changeset
 * @typedef {{ name: string, version: string, summaries: string[] }} Release
 */

/**
 * Runs a command from the repository root, exiting the process when it fails.
 *
 * @param {string} command
 * @param {string[]} args
 * @returns {void}
 */
function run(command, args) {
  const { status, error } = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (error) throw error
  if (status !== 0) process.exit(status ?? 1)
}

/**
 * Splits a changeset file into the packages it bumps and its summary.
 *
 * @param {string} source
 * @returns {Changeset}
 */
function parseChangeset(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) return { packages: [], summary: source.trim() }
  const packages = [...match[1].matchAll(/^\s*["']?([^"':]+)["']?\s*:/gm)].map(
    (line) => line[1].trim()
  )
  return { packages, summary: match[2].trim() }
}

/**
 * Every pending changeset, in file order.
 *
 * @returns {Promise<Changeset[]>}
 */
async function readChangesets() {
  const entries = await readdir(changesetDir, { withFileTypes: true })
  const files = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "README.md"
    )
    .map((entry) => entry.name)
    .toSorted()
  return Promise.all(
    files.map(async (name) =>
      parseChangeset(await readFile(new URL(name, changesetDir), "utf8"))
    )
  )
}

/**
 * The name, version and visibility of every package the site talks about.
 *
 * @returns {Promise<Map<string, { version: string, private: boolean }>>}
 */
async function readManifests() {
  /** @type {Map<string, { version: string, private: boolean }>} */
  const manifests = new Map()
  for (const dir of workspaceDirs) {
    const base = new URL(dir, rootDir)
    for (const entry of await readdir(base, { withFileTypes: true })) {
      const file = new URL(`${entry.name}/package.json`, base)
      if (!entry.isDirectory() || !existsSync(file)) continue
      const manifest = JSON.parse(await readFile(file, "utf8"))
      manifests.set(manifest.name, {
        version: manifest.version,
        private: manifest.private === true,
      })
    }
  }
  return manifests
}

/**
 * The first sentence of a summary, as plain text for the page description.
 *
 * @param {string} summary
 * @returns {string}
 */
function firstSentence(summary) {
  const line = summary.split(/\n\s*\n/)[0].replace(/\s+/g, " ")
  const sentence = /^(.+?[.!?])(\s|$)/.exec(line)?.[1] ?? line
  return sentence.replaceAll("`", "").replaceAll('"', "'")
}

/**
 * Indents every line after the first so a multi-paragraph summary stays
 * inside its list item.
 *
 * @param {string} summary
 * @returns {string}
 */
function asListItem(summary) {
  return `- ${summary.replace(/\n(?!\n)/g, "\n  ").replace(/\n\n/g, "\n\n  ")}`
}

/**
 * The MDX page for one release.
 *
 * @param {Release[]} releases
 * @param {Date} now
 * @param {string} slug
 * @returns {string}
 */
function renderEntry(releases, now, slug) {
  const date = now.toISOString().slice(0, 10)
  const month = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
  const versions = releases.map((r) => `${r.name} ${r.version}`).join(", ")
  const description = firstSentence(releases[0].summaries[0] ?? versions)
  const sections = releases.map(
    (release) =>
      `## \`${release.name}\` ${release.version}\n\n${release.summaries.map(asListItem).join("\n\n")}`
  )
  return [
    "---",
    `title: "${month} — ${versions}"`,
    `description: "${description}"`,
    "type: changelog",
    `slug: changelog/${slug}`,
    `date: ${date}`,
    "---",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n")
}

/**
 * A slug for today's release that no earlier entry already uses.
 *
 * @param {Date} now
 * @returns {string}
 */
function freeSlug(now) {
  const base = `${now.toISOString().slice(0, 10)}-release`
  let slug = base
  for (let n = 2; existsSync(new URL(`${slug}.mdx`, entryDir)); n++) {
    slug = `${base}-${n}`
  }
  return slug
}

const changesets = await readChangesets()
run("changeset", ["version"])

const manifests = await readManifests()
/** @type {Map<string, Release>} */
const releases = new Map()
for (const changeset of changesets) {
  for (const name of changeset.packages) {
    const manifest = manifests.get(name)
    if (!manifest || manifest.private || !changeset.summary) continue
    const release = releases.get(name) ?? {
      name,
      version: manifest.version,
      summaries: [],
    }
    release.summaries.push(changeset.summary)
    releases.set(name, release)
  }
}

if (releases.size === 0) {
  console.log("No published package changed, skipping the site changelog.")
} else {
  const now = new Date()
  const slug = freeSlug(now)
  const file = new URL(`${slug}.mdx`, entryDir)
  await writeFile(file, renderEntry([...releases.values()], now, slug))
  run("oxfmt", [
    "-c",
    "tooling/oxc/.oxfmtrc.json",
    `apps/docs/content/changelog/${slug}.mdx`,
  ])
  console.log(`Wrote apps/docs/content/changelog/${slug}.mdx`)
}
