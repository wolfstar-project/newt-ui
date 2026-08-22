// Builds public/r/<style>/<name>.json (registry-item format) from app/lib/registry
import { promises as fs } from "node:fs"
import path from "node:path"

import { registry } from "../app/lib/registry/index"
import { styles } from "../app/lib/registry/registry-styles"
import { registryItemSchema, type Registry } from "../app/lib/registry/schema"

const REGISTRY_PATH = path.join(process.cwd(), "public/r")
const SRC = path.join(process.cwd(), "app/lib")

async function buildIndex(allItems: Registry) {
  const items = allItems
    .filter((i) => ["registry:ui", "registry:lib"].includes(i.type))
    .map((i) =>
      Object.assign({}, i, {
        files: i.files?.map((f) => (f instanceof Object ? f.path : f)),
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
          const file = f instanceof Object ? f : { path: f, type: item.type }
          const abs = file.path.startsWith("lib/")
            ? path.join(SRC, file.path.replace(/^lib\//, ""))
            : path.join(SRC, "registry", style.name, file.path)
          return { ...file, content: await fs.readFile(abs, "utf8") }
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

await buildIndex(registry)
await buildStyles(registry)
console.log("✅ Vue registry built to public/r")
