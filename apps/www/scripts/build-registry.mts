// Builds public/r/<style>/<name>.json (registry-item format) from registry/index.ts
import { promises as fs } from "node:fs"
import path from "node:path"

import { registry } from "../registry/index"
import { styles } from "../registry/registry-styles"
import { registryItemSchema, type Registry } from "../registry/schema"

const REGISTRY_PATH = path.join(process.cwd(), "public/r")

type RegistryItemFile = NonNullable<Registry[number]["files"]>[number]

/** Registry file entries are either a plain path or an object carrying one. */
function isFilePathShorthand(f: RegistryItemFile): f is string {
  return Object.prototype.toString.call(f) === "[object String]"
}

async function buildRegistryIndex(allItems: Registry) {
  const items = allItems
    .filter((item) =>
      ["registry:ui", "registry:lib", "registry:theme"].includes(item.type)
    )
    .map((item) =>
      Object.assign({}, item, {
        files: item.files?.map((f) => (isFilePathShorthand(f) ? f : f.path)),
      })
    )
  await fs.mkdir(REGISTRY_PATH, { recursive: true })
  await fs.writeFile(
    path.join(REGISTRY_PATH, "index.json"),
    JSON.stringify(items, null, 2)
  )
}

async function buildStyles(allItems: Registry) {
  for (const style of styles) {
    const target = path.join(REGISTRY_PATH, "styles", style.name)
    await fs.mkdir(target, { recursive: true })
    for (const item of allItems) {
      // Items without files still ship (the theme carries only tokens).
      if (!item.files) {
        await fs.writeFile(
          path.join(target, `${item.name}.json`),
          JSON.stringify(registryItemSchema.parse(item), null, 2)
        )
        continue
      }
      const files = await Promise.all(
        item.files.map(async (f) => {
          const file = isFilePathShorthand(f) ? { path: f, type: item.type } : f
          const abs = file.path.startsWith("lib/")
            ? path.join(process.cwd(), file.path)
            : path.join(process.cwd(), "registry", style.name, file.path)
          const content = await fs.readFile(abs, "utf8")
          return { ...file, content }
        })
      )
      const payload = registryItemSchema.parse({ ...item, files })
      await fs.writeFile(
        path.join(target, `${item.name}.json`),
        JSON.stringify(payload, null, 2)
      )
    }
  }
  await fs.writeFile(
    path.join(REGISTRY_PATH, "styles/index.json"),
    JSON.stringify(styles, null, 2)
  )
}

await buildRegistryIndex(registry)
await buildStyles(registry)
console.log("✅ Registry built to public/r")
