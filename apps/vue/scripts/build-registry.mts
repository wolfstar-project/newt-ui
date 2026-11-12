// Builds public/r/<style>/<name>.json (registry-item format) from registry/
import { promises as fs } from "node:fs"
import path from "node:path"

import { registry } from "../registry/index"
import { styles } from "../registry/registry-styles"
import {
  registryItemSchema,
  type Registry,
  type RegistryItem,
} from "../registry/schema"

const REGISTRY_PATH = path.join(process.cwd(), "public/r")
const APP_LIB = path.join(process.cwd(), "app/lib")
const REGISTRY_SOURCE = path.join(process.cwd(), "registry/bases/newt")
// Every item in this app targets Vue; the field is stamped here so a
// consumer reading a single item JSON knows which framework it belongs to.
const REGISTRY_FRAMEWORK = "vue" as const

// Registry directories (ui.shadcn.com, shadcn-vue.com) expect a flat registry:
// `/registry.json` and `/<name>.json` at the root. The default style is
// published there as well as under `styles/default/`.
const FLAT_STYLE = styles[0].name
const RESERVED_NAMES = new Set(["index", "registry", "styles"])

async function writeItem(
  styleName: string,
  target: string,
  name: string,
  item: RegistryItem
) {
  const body = JSON.stringify(item, null, 2)
  await fs.writeFile(path.join(target, `${name}.json`), body)
  if (styleName === FLAT_STYLE) {
    await fs.writeFile(path.join(REGISTRY_PATH, `${name}.json`), body)
  }
}

async function buildIndex(allItems: Registry) {
  const items = allItems
    .filter((i) =>
      ["registry:ui", "registry:block", "registry:lib"].includes(i.type)
    )
    .map((i) =>
      Object.assign({}, i, {
        framework: REGISTRY_FRAMEWORK,
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
  const clash = allItems.find((item) => RESERVED_NAMES.has(item.name))
  if (clash) {
    throw new Error(
      `item name "${clash.name}" collides with a flat registry file`
    )
  }
  for (const style of styles) {
    const target = path.join(REGISTRY_PATH, "styles", style.name)
    await fs.mkdir(target, { recursive: true })
    for (const item of allItems) {
      // Items without files still ship (the theme carries only tokens).
      if (!item.files) {
        await writeItem(
          style.name,
          target,
          item.name,
          registryItemSchema.parse({ ...item, framework: REGISTRY_FRAMEWORK })
        )
        continue
      }
      const files = await Promise.all(
        item.files.map(async (f) => {
          const file = f instanceof Object ? f : { path: f, type: item.type }
          const abs = file.path.startsWith("lib/")
            ? path.join(APP_LIB, file.path.replace(/^lib\//, ""))
            : path.join(REGISTRY_SOURCE, file.path)
          return { ...file, content: await fs.readFile(abs, "utf8") }
        })
      )
      const payload = registryItemSchema.parse({
        ...item,
        framework: REGISTRY_FRAMEWORK,
        files,
      })
      await writeItem(style.name, target, item.name, payload)
    }
  }
  await fs.writeFile(
    path.join(REGISTRY_PATH, "styles/index.json"),
    JSON.stringify(styles, null, 2)
  )
}

await buildIndex(registry)
await buildStyles(registry)
// The `registry.json` that `scripts/gen-registry.mjs` writes lists every item
// with file paths only, no `content`, as the directories require.
await fs.copyFile(
  path.join(process.cwd(), "registry.json"),
  path.join(REGISTRY_PATH, "registry.json")
)
console.log("✅ Vue registry built to public/r")
