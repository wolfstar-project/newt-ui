import { copyFile, cp } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/*
 * The site and the two registries are one deployment. `/r/` is the path the
 * React CLI writes into a component.json, and `/vue/r/` is the Vue one, so the
 * built JSON lands where each CLI already looks for it.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, "dist")

const bundles = [
  { from: join(root, "..", "www", "public", "r"), to: join(dist, "r") },
  {
    from: join(root, "..", "vue", "public", "r"),
    to: join(dist, "vue", "r"),
  },
]

/*
 * Both registries are required, not optional: `docs#build` depends on the two
 * `registry:build` tasks that produce them. A deployment missing one of these
 * directories still looks like a valid site while every `newt-ui add` against
 * it answers 404, so a registry that did not arrive fails the build here
 * rather than shipping a half-published release.
 */
for (const { from, to } of bundles) {
  try {
    await cp(from, to, { recursive: true })
  } catch (cause) {
    throw new Error(
      `no registry at ${from}. run \`pnpm registry:build\` before building the docs site.`,
      { cause }
    )
  }
  console.log(`copied ${from} -> ${to}`)
}

/*
 * The router reads `location.pathname`, so a reader who loads or refreshes
 * `/docs/installation` asks static hosting for a file that was never emitted.
 * A host that answers an unknown path with `404.html` — GitHub Pages,
 * Cloudflare Pages, `vite preview` — boots the same application from this
 * copy of the entry document, and the assets resolve from any depth because
 * they are addressed from the domain root. A host configured with its own
 * rewrite to `index.html` never reaches this file, and is unaffected by it.
 */
await copyFile(join(dist, "index.html"), join(dist, "404.html"))
console.log("wrote dist/404.html (deep-link fallback)")
