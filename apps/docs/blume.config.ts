import { defineConfig } from "blume"
import type { ComponentMarkdown } from "blume"
import { z } from "zod"

import { newtTokens, newtTokensLight } from "../www/registry/registry-tokens"
import { INSTALL_TARGETS } from "./src/lib/install-targets"
import { NAV, type NavGroup, type NavItem } from "./src/lib/nav"
import {
  categories,
  COMPONENTS,
  findComponent,
  targetPaths,
} from "./src/lib/registry-meta"
import { SITE } from "./src/lib/site"
import { pascalCase } from "./src/lib/strings"

/*
 * The docs site, on Blume.
 *
 * Content lives under `content/`: `content/docs/**` is the documentation, which
 * is why every route starts with `/docs`, and `content/changelog/**` holds the
 * release notes Blume collects into `/changelog`. The pages that are not
 * documents — the home page, the block gallery, the two builders — are Astro
 * routes under `pages/`, and the registry-driven MDX tags the content writes
 * without importing are registered in `components.ts`.
 *
 * This file is loaded twice per run, once by the CLI and once by the generated
 * Astro config, so everything in it is a pure read of the registry.
 */

/* ------------------------------------------------------------------ *
 * The sidebar
 *
 * `NAV` is already the thirteen groups in reading order — the guides, then one
 * group per registry category — so this only translates its shape. Blume
 * labels a bare route from the page's own title; the three entries whose
 * label deliberately differs ("Overview" for the forms index, say) are written
 * as `root` items, which keep the label and still count as that page for the
 * previous/next walk. Links out of the content tree — the generated changelog
 * index and `llms.txt` — are `href` items.
 * ------------------------------------------------------------------ */
function sidebarItem(item: NavItem) {
  if (item.external === true) return { label: item.label, href: item.href }
  if (item.labelDiffers === true) return { label: item.label, root: item.href }
  return item.href
}

function sidebarGroup(group: NavGroup) {
  return { label: group.label, items: group.items.map(sidebarItem) }
}

/* ------------------------------------------------------------------ *
 * Markdown for agents
 *
 * The registry-driven tags are expanded here into the facts they render, so a
 * page's `.md` twin, `llms-full.txt` and the copy-page action state the
 * install command and the files rather than leaving a tag nobody can resolve.
 *
 * Blume hands a serialiser the tag's attributes as literal data, so each one
 * parses what it needs at that boundary and leaves the tag alone (`null`)
 * when the attributes are not what the component documents.
 * ------------------------------------------------------------------ */
const NamedProps = z.object({ name: z.string() })

/** The attributes Blume recovers from a tag, as literal data. */
type TagProps = Parameters<ComponentMarkdown>[0]["props"]

/** The registry item a `name="…"` attribute points at, if it points at one. */
function namedComponent(props: TagProps) {
  const parsed = NamedProps.safeParse(props)
  return parsed.success ? findComponent(parsed.data.name) : undefined
}

const componentPreview: ComponentMarkdown = ({ props }) => {
  const meta = namedComponent(props)
  if (meta === undefined) return null
  return `_Live example of ${meta.title} — see the page for the rendered demo._`
}

const installation: ComponentMarkdown = ({ props }) => {
  const meta = namedComponent(props)
  if (meta === undefined) return null
  const react = targetPaths("react", meta)
  const vue = targetPaths("vue", meta)
  const dependencies =
    meta.dependencies.length > 0
      ? `\n\nnpm dependencies: ${meta.dependencies.join(", ")}.`
      : ""
  const registryDependencies =
    meta.registryDependencies.length > 0
      ? ` Registry dependencies, installed with it: ${meta.registryDependencies.join(", ")}.`
      : ""
  return `\`\`\`bash\n${SITE.cli} add ${meta.name}\n\`\`\`${dependencies}${registryDependencies}\n\nFiles written — React: ${react.join(", ")}. Vue: ${vue.join(", ")}.`
}

const usage: ComponentMarkdown = ({ props }) => {
  const meta = namedComponent(props)
  if (meta === undefined) return null
  const alias =
    meta.type === "registry:block" ? SITE.componentsAlias : SITE.uiAlias
  const vueExports = meta.vueFiles
    .filter((file) => file.endsWith(".vue"))
    .map((file) => file.slice(0, -".vue".length))
  return [
    "React:",
    "",
    "```tsx",
    `import { ${pascalCase(meta.name)} } from "${alias}/${meta.name}"`,
    "```",
    "",
    "Vue:",
    "",
    "```ts",
    `import { ${vueExports.join(", ")} } from "${alias}/${meta.name}"`,
    "```",
  ].join("\n")
}

const tokensNote: ComponentMarkdown = ({ props }) => {
  const meta = namedComponent(props)
  if (meta === undefined) return null
  return `${meta.title} reads its colours, radii and motion from the \`--newt-*\` tokens. Override a token rather than editing the component.`
}

const PmTabsProps = z.object({ cmd: z.string() })

const pmTabs: ComponentMarkdown = ({ props }) => {
  const parsed = PmTabsProps.safeParse(props)
  return parsed.success ? `\`\`\`bash\nnpx ${parsed.data.cmd}\n\`\`\`` : null
}

const pathTabs: ComponentMarkdown = ({ children }) =>
  [
    `Create the project with \`${SITE.cli} init\` — \`--template <name>\` scaffolds Next.js, Vite and Nuxt from nothing, and \`--preset <code>\` applies a preset from ${SITE.url}/create — or wire it into a project you already have:`,
    "",
    children,
  ].join("\n")

const frameworkGrid: ComponentMarkdown = () =>
  INSTALL_TARGETS.map(
    (target) => `- [${target.title}](${target.href}): ${target.note}`
  ).join("\n")

/** The rows every component page writes into `<PropsTable rows={[…]}>`. */
const PropsTableProps = z.object({
  of: z.string().optional(),
  rows: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      default: z.string().optional(),
      description: z.string(),
    })
  ),
})

const cell = (value: string): string => value.replaceAll("|", "\\|")

const propsTable: ComponentMarkdown = ({ props }) => {
  const parsed = PropsTableProps.safeParse(props)
  if (!parsed.success) return null
  const { of: part, rows } = parsed.data
  const heading = part === undefined ? "" : `**\`${part}\`**\n\n`
  return [
    `${heading}| Prop | Type | Default | Description |`,
    "| --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| \`${cell(row.name)}\` | \`${cell(row.type)}\` | ${row.default === undefined ? "—" : `\`${cell(row.default)}\``} | ${cell(row.description)} |`
    ),
  ].join("\n")
}

const tokenReference: ComponentMarkdown = () => {
  const light: Record<string, string> = newtTokensLight
  return [
    "| Token | Dark | Light |",
    "| --- | --- | --- |",
    ...Object.entries(newtTokens).map(
      ([name, dark]) =>
        `| \`--${name}\` | \`${cell(dark)}\` | \`${cell(light[name] ?? dark)}\` |`
    ),
  ].join("\n")
}

const componentIndex: ComponentMarkdown = () =>
  categories
    .map((category) => {
      const items = COMPONENTS.filter(
        (component) => component.categorySlug === category.slug
      )
      if (items.length === 0) return ""
      return [
        `## ${category.label}`,
        "",
        ...items.map(
          (component) =>
            `- [${component.title}](/docs/components/${component.name}): ${component.description}`
        ),
      ].join("\n")
    })
    .filter(Boolean)
    .join("\n\n")

export default defineConfig({
  title: SITE.name,
  description: SITE.tagline,
  /* Four strokes and a bar, drawn in `currentColor` so it follows the theme. */
  logo: { image: "/logo.svg", text: SITE.name },

  content: { root: "content" },

  github: { owner: "wolfstar-project", repo: "newt-ui", dir: "apps/docs" },

  theme: {
    /* `--newt-brand`; legible on both palettes, so both modes use it. */
    accent: "#5865f2",
    radius: "md",
    /* The dark surface the site opens on; the header toggle offers light. */
    mode: "dark",
    fonts: { display: "inter", body: "inter", mono: "jetbrains-mono" },
  },

  navigation: {
    actions: SITE.nav.map((item) => ({ label: item.label, href: item.href })),
    sidebar: NAV.map(sidebarGroup),
  },

  footer: {
    links: [{ label: "Trademark notice", href: SITE.disclaimer }],
  },

  changelog: {
    title: "Changelog",
    description:
      "What shipped, when, and what it changes for a project that already has newt/ui installed.",
  },

  /* No analytics adapter is configured, so a rating would be recorded nowhere. */
  feedback: false,

  agents: {
    markdownComponents: {
      ComponentIndex: componentIndex,
      ComponentPreview: componentPreview,
      FrameworkGrid: frameworkGrid,
      Installation: installation,
      PathTabs: pathTabs,
      PmTabs: pmTabs,
      PropsTable: propsTable,
      TokenReference: tokenReference,
      TokensNote: tokensNote,
      Usage: usage,
    },
  },

  seo: {
    og: {
      logo: "/logo.svg",
      /* The `--newt-*` dark palette, spelled out: the card has no cascade. */
      palette: {
        accent: "#5865f2",
        background: "#1e1f22",
        foreground: "#f2f3f5",
        muted: "#949ba4",
        border: "#3f4147",
      },
      titles: {
        "/blocks": "Blocks",
        "/create": "newt/create",
        "/typeset": "Typeset",
        "/typeset/preview": "Typeset preview",
      },
    },
  },

  /*
   * Two routes moved: the token reference is a documentation page now, and the
   * changelog is the index Blume generates from the typed entries.
   */
  redirects: [
    { from: "/colors", to: "/docs/colors" },
    { from: "/docs/changelog", to: "/changelog" },
    {
      from: "/docs/changelog/2026-08-components-rework",
      to: "/changelog/2026-08-components-rework",
    },
    {
      from: "/docs/changelog/2026-08-npm-oidc",
      to: "/changelog/2026-08-npm-oidc",
    },
  ],

  deployment: { site: SITE.url },
})
