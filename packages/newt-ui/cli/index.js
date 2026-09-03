#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
} from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = join(__dirname, "..")
const REGISTRY_DIR = join(PKG_ROOT, "registry", "html")
const REGISTRY_JSON = join(REGISTRY_DIR, "registry.json")

const CONFIG_FILE = "newt-ui.json"

function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_JSON, "utf-8"))
}

function loadConfig(cwd) {
  const configPath = join(cwd, CONFIG_FILE)
  if (!existsSync(configPath)) {
    console.error(
      `No ${CONFIG_FILE} found. Run \`npx @newtui/html init\` first.`
    )
    process.exit(1)
  }
  return JSON.parse(readFileSync(configPath, "utf-8"))
}

function cmdInit(cwd) {
  const configPath = join(cwd, CONFIG_FILE)
  if (existsSync(configPath)) {
    console.log(`${CONFIG_FILE} already exists. Skipping.`)
  } else {
    const config = {
      $schema: "https://newtui.dev/config-schema.json",
      componentsDir: "components/ui",
      tokensFile: "styles/newt-tokens.css",
    }
    writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n")
    console.log(`Created ${CONFIG_FILE}`)
  }

  const registry = loadRegistry()
  const config = loadConfig(cwd)

  const tokensDest = join(cwd, config.tokensFile)
  mkdirSync(dirname(tokensDest), { recursive: true })
  copyFileSync(join(REGISTRY_DIR, registry.tokens), tokensDest)
  console.log(`Added design tokens -> ${config.tokensFile}`)
  console.log("\nNext: npx @newtui/html add <component> [...components]")
  console.log("Run `npx @newtui/html list` to see available components.")
}

function cmdList() {
  const registry = loadRegistry()
  console.log("Available components:\n")
  for (const c of registry.components) {
    console.log(`  ${c.name.padEnd(18)} ${c.title}`)
  }
}

function resolveDeps(registry, names) {
  const resolved = new Set()
  const stack = [...names]
  while (stack.length) {
    const name = stack.pop()
    if (resolved.has(name)) continue
    const entry = registry.components.find((c) => c.name === name)
    if (!entry) {
      console.warn(`Unknown component "${name}", skipping.`)
      continue
    }
    resolved.add(name)
    if (entry.uses) stack.push(...entry.uses)
  }
  return [...resolved]
}

function cmdAdd(cwd, names) {
  if (names.length === 0) {
    console.error("Usage: newt-ui add <component> [...components]")
    process.exit(1)
  }
  const registry = loadRegistry()
  const config = loadConfig(cwd)
  const all = resolveDeps(registry, names)

  const destDir = join(cwd, config.componentsDir)
  mkdirSync(destDir, { recursive: true })

  for (const name of all) {
    const entry = registry.components.find((c) => c.name === name)
    if (!entry) continue
    for (const file of [...entry.files, ...(entry.js ? [entry.js] : [])]) {
      const src = join(REGISTRY_DIR, "components", file)
      if (!existsSync(src)) {
        console.warn(`  (missing source file ${file}, skipping)`)
        continue
      }
      const dest = join(destDir, file)
      copyFileSync(src, dest)
      console.log(`  + ${join(config.componentsDir, file)}`)
    }
  }
  console.log(
    `\nAdded ${all.length} component(s). Import the tokens file once globally.`
  )
}

const [, , command, ...args] = process.argv
const cwd = process.cwd()

switch (command) {
  case "init":
    cmdInit(cwd)
    break
  case "add":
    cmdAdd(cwd, args)
    break
  case "list":
    cmdList()
    break
  default:
    console.log(`newt-ui — Discord-native UI components

Usage:
  npx @newtui/html init        Set up newt-ui in the current project
  npx @newtui/html list         List available components
  npx @newtui/html add <names...>   Add one or more components
`)
}
