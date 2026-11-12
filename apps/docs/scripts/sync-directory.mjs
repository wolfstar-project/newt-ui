#!/usr/bin/env node
/*
 * Snapshot the two community registry directories into `src/data/directory.json`.
 *
 * The directory page lists what `newtui add @registry/item` can reach. The CLI
 * reads the live indexes when it runs; the site reads this committed copy, so
 * a build never waits on somebody else's server and the page cannot change
 * between two builds of the same commit. Run it to refresh the list:
 *
 *   pnpm --filter docs directory:sync
 */
import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const SOURCES = {
  react: "https://ui.shadcn.com/r/registries.json",
  vue: "https://www.shadcn-vue.com/r/registries.json",
}

/** One line of the page: the template, where to read about it, what it is. */
function toEntry(name, url, homepage, description) {
  const entry = { name, url, homepage: homepage ?? new URL(url).origin }
  if (description) entry.description = description
  return entry
}

/** shadcn/ui serves a list of entries; shadcn-vue a map of name to template. */
function normalize(data) {
  const entries = Array.isArray(data)
    ? data
        .filter((entry) => entry.health?.hidden !== true)
        .map((entry) =>
          toEntry(entry.name, entry.url, entry.homepage, entry.description)
        )
    : Object.entries(data).map(([name, entry]) =>
        toEntry(name, entry instanceof Object ? entry.url : entry)
      )
  return entries.toSorted((a, b) => a.name.localeCompare(b.name))
}

const directory = {}
for (const [framework, url] of Object.entries(SOURCES)) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${url} answered ${response.status} ${response.statusText}`)
  }
  directory[framework] = normalize(await response.json())
  console.log(`${framework}: ${directory[framework].length} registries`)
}

const target = fileURLToPath(
  new URL("../src/data/directory.json", import.meta.url)
)
await writeFile(target, `${JSON.stringify(directory, null, 2)}\n`)
