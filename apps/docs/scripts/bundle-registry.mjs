import { cp } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/*
 * The site and the two registries are one deployment. `/r/` is the path the
 * React CLI writes into a component.json, and `/vue/r/` is the Vue one, so the
 * built JSON lands where each CLI already looks for it.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))

const bundles = [
  { from: join(root, "..", "www", "public", "r"), to: join(root, "dist", "r") },
  {
    from: join(root, "..", "vue", "public", "r"),
    to: join(root, "dist", "vue", "r"),
  },
]

for (const { from, to } of bundles) {
  try {
    await cp(from, to, { recursive: true })
    console.log(`copied ${from} -> ${to}`)
  } catch {
    /* a registry that was never built is a warning: the site still deploys */
    console.warn(`no registry at ${from}, skipping. run registry:build first.`)
  }
}
