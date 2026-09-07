import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/*
 * Every registry component gets a page. The page is a stub: the preview,
 * installation and usage sections are rendered from the meta file, so a new
 * component is documented the moment its meta lands, and prose, examples and
 * an API table are added to the same file by hand afterwards.
 *
 * Existing files are never touched — that hand-written prose is the point.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const metaDir = join(root, "..", "www", "registry", "meta")
const outDir = join(root, "src", "content", "docs", "components")

mkdirSync(outDir, { recursive: true })

/** MDX frontmatter is YAML: a value with a colon or quote has to be quoted. */
function yamlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function template(meta) {
  return `---
title: ${yamlString(meta.title)}
description: ${yamlString(meta.description)}
component: true
---

<ComponentPreview name="${meta.name}" />

## Installation

<Installation name="${meta.name}" />

## Usage

<Usage name="${meta.name}" />

## Tokens

<TokensNote name="${meta.name}" />
`
}

let created = 0
let skipped = 0

for (const file of readdirSync(metaDir).toSorted()) {
  if (!file.endsWith(".json")) continue
  const meta = JSON.parse(readFileSync(join(metaDir, file), "utf8"))
  const target = join(outDir, `${meta.name}.mdx`)
  if (existsSync(target)) {
    skipped += 1
    continue
  }
  writeFileSync(target, template(meta))
  created += 1
}

console.log(`created ${created}, skipped ${skipped}`)
