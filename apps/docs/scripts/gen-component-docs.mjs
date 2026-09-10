import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import ts from "typescript"

/*
 * Every registry item gets a useful first documentation page. Preview,
 * installation and usage are registry-driven; the source parser adds its
 * public interfaces and exported parts so new pages do not land as empty
 * shells while their hand-written examples are still being prepared.
 *
 * Existing files are never touched unless `--refresh-stubs` is passed. That
 * mode only upgrades byte-for-byte legacy stubs, preserving hand-written prose.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const metaDir = join(root, "..", "www", "registry", "meta")
const outDir = join(root, "src", "content", "docs", "components")
const registryDir = join(root, "..", "www", "registry", "default")
const refreshStubs = process.argv.includes("--refresh-stubs")

mkdirSync(outDir, { recursive: true })

/** MDX frontmatter is YAML: a value with a colon or quote has to be quoted. */
function yamlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function legacyStub(meta) {
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

const accessibilityNotes = {
  "app-launcher":
    "Give the launcher an accessible heading, keep search labelled, and expose the active item while keyboard focus moves through the results.",
  "command-panel":
    "The suggestion list is one keyboard focus stop. Arrow keys, Home and End move its active descendant while the detail card is announced through a polite live region. Give the list a contextual label and keep command IDs unique.",
  "channel-header":
    "Every icon-only toolbar action needs an `aria-label`. Preserve the visible focus ring and keep the channel name in the accessible heading hierarchy.",
  "context-menu":
    "Open the menu from both pointer and keyboard input, move focus into it, support arrow-key navigation, and restore focus to the trigger when it closes.",
  dropdown:
    "Connect the trigger and menu with `aria-controls` and `aria-expanded`, support arrow keys and `Escape`, and return focus to the trigger on close.",
  "form-fields":
    "Associate every control with a visible label. Connect help or error text with `aria-describedby`, and pair invalid styling with `aria-invalid` rather than colour alone.",
  invite:
    "Use descriptive alternative text for a meaningful server image and an empty `alt` for a decorative one. The join action must remain a real button.",
  "message-composer":
    "Keep the textarea labelled with the channel context, let `Enter` and `Shift+Enter` retain their documented meanings, and give every icon-only action an accessible name.",
  modal:
    "Provide a visible title, trap focus while open, close on `Escape`, and restore focus to the element that opened the dialog.",
  pagination:
    'Label the navigation region and mark the current page with `aria-current="page"`. Previous and next controls need descriptive accessible names.',
  permission:
    "Expose deny, inherit and allow as one labelled choice group. The selected state must be announced programmatically and not communicated by colour alone.",
  reaction:
    "The reaction is a real button and publishes its toggled state through `aria-pressed`. Keep the emoji name and count understandable to screen readers.",
  "select-menu":
    "The trigger uses combobox semantics. Keep focus on the trigger, update `aria-activedescendant` as the active option changes, and support arrows, Enter and Escape.",
  "slash-command-suggestions":
    "Keep focus in the composer and point `aria-activedescendant` at the active option. Announce disabled options and label both the app rail and command list.",
  spoiler:
    "The reveal control must be keyboard operable and expose its expanded state. Do not place essential instructions only inside hidden spoiler content.",
  tabs: "Use the roving-tabindex pattern: arrow keys move among tabs, the active trigger has `aria-selected`, and each panel is labelled by its trigger.",
  toast:
    'Use `role="status"` for routine updates and `role="alert"` only for urgent failures. Do not move focus into a toast, and give its close button an accessible name.',
  "token-field":
    "Label the token input, announce copy feedback through a polite live region, and never make the reveal or copy actions icon-only without an accessible name.",
  tooltip:
    "Tooltips supplement a trigger's accessible name rather than replacing it. Show them for keyboard focus as well as hover and connect them with `aria-describedby`.",
}

function sourcePath(meta) {
  const relative =
    meta.reactFiles?.[0] ??
    `${meta.type === "registry:block" ? "block" : "ui"}/${meta.name}.tsx`
  return join(registryDir, relative)
}

function jsDoc(member) {
  const block = ts
    .getJSDocCommentsAndTags(member)
    .find((entry) => ts.isJSDoc(entry))
  const comment = ts.getTextOfJSDocComment(block?.comment)
  return comment?.replace(/\s+/g, " ")
}

function publicContract(meta) {
  const file = sourcePath(meta)
  if (!existsSync(file)) return { interfaces: [], parts: [] }

  const source = readFileSync(file, "utf8")
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const interfaces = []
  const parts = new Set()

  for (const statement of ast.statements) {
    if (
      ts.isInterfaceDeclaration(statement) &&
      statement.name.text.endsWith("Props")
    ) {
      const rows = statement.members.flatMap((member) => {
        if (!ts.isPropertySignature(member) || member.name === undefined) {
          return []
        }
        const name = member.name.getText(ast).replaceAll(/["']/g, "")
        const baseType = member.type?.getText(ast) ?? "unknown"
        return [
          {
            name,
            type: member.questionToken ? `${baseType} | undefined` : baseType,
            description:
              jsDoc(member) ??
              `${member.questionToken ? "Optional" : "Required"} ${name} value.`,
          },
        ]
      })
      if (rows.length > 0) {
        interfaces.push({
          part: statement.name.text.replace(/Props$/, ""),
          rows,
        })
      }
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        const name = element.name.text
        if (/^[A-Z]/.test(name) && !name.endsWith("Props")) parts.add(name)
      }
    }

    const exported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
    if (
      exported &&
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)) &&
      statement.name
    ) {
      const name = statement.name.text
      if (/^[A-Z]/.test(name) && !name.endsWith("Props")) parts.add(name)
    }
  }

  return { interfaces, parts: [...parts] }
}

function propsTable({ part, rows }) {
  return `<PropsTable
  of=${yamlString(part)}
  rows={${JSON.stringify(rows, null, 4)}}
/>
`
}

function completeTemplate(meta) {
  const contract = publicContract(meta)
  const primaryPart =
    contract.parts[0] ??
    meta.title
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join("")
  const tables =
    contract.interfaces.length > 0
      ? contract.interfaces.map(propsTable).join("\n")
      : propsTable({
          part: primaryPart,
          rows: [
            {
              name: "children / default slot",
              type: "React.ReactNode / Vue slot",
              description: "Content rendered inside the component.",
            },
            {
              name: "className / class",
              type: "string",
              description:
                "Additional classes merged with the component defaults.",
            },
          ],
        })
  const parts = contract.parts.length
    ? `\nThe registry exports ${contract.parts.map((part) => `\`${part}\``).join(", ")}. Parts without a table accept the native attributes for the element they render; React uses \`className\`, while Vue uses \`class\` and fallthrough attributes.\n`
    : ""
  const accessibility =
    accessibilityNotes[meta.name] ??
    "Preserve the native semantics of the rendered elements and pass through ARIA attributes when the surrounding context needs a label or description. Any interactive child needs a visible focus indicator, and meaning must not rely on colour alone."

  return `---
title: ${yamlString(meta.title)}
description: ${yamlString(meta.description)}
component: true
---

${meta.description} Compose it from the exported registry parts so local content and behaviour stay in the application while the visual contract stays token-driven.

<ComponentPreview name="${meta.name}" />

## Installation

<Installation name="${meta.name}" />

## Usage

<Usage name="${meta.name}" />

## API reference

${tables}${parts}
## Accessibility

${accessibility}

## Tokens

<TokensNote name="${meta.name}" />
`
}

let created = 0
let skipped = 0
let refreshed = 0

for (const file of readdirSync(metaDir).toSorted()) {
  if (!file.endsWith(".json")) continue
  const meta = JSON.parse(readFileSync(join(metaDir, file), "utf8"))
  const target = join(outDir, `${meta.name}.mdx`)
  if (existsSync(target)) {
    if (refreshStubs && readFileSync(target, "utf8") === legacyStub(meta)) {
      writeFileSync(target, completeTemplate(meta))
      refreshed += 1
      continue
    }
    skipped += 1
    continue
  }
  writeFileSync(target, completeTemplate(meta))
  created += 1
}

console.log(`created ${created}, refreshed ${refreshed}, skipped ${skipped}`)
