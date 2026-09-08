import { categories } from "@/registry/registry-categories"

import { INSTALL_TARGETS } from "./install-targets"
import { COMPONENTS } from "./registry"

export interface NavItem {
  readonly href: string
  readonly label: string
  readonly badge?: "new" | "updated"
  /** Machine routes and external links sit outside the previous/next walk. */
  readonly external?: boolean
}

export interface NavGroup {
  readonly label: string
  readonly items: readonly NavItem[]
}

export interface NavNeighbours {
  readonly previous?: NavItem
  readonly next?: NavItem
}

/*
 * The sidebar, in reading order: what you need to get a component on screen,
 * then the decisions behind the library, then how to publish your own items,
 * then every component grouped the way the registry groups them.
 */
const GUIDES: readonly NavGroup[] = [
  {
    label: "Get Started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/components-json", label: "components.json" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/dark-mode", label: "Dark mode" },
      { href: "/docs/rtl", label: "RTL", badge: "new" },
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/javascript", label: "JavaScript" },
      { href: "/docs/html-css", label: "HTML & CSS" },
      { href: "/docs/using-with-ai", label: "Using with AI" },
      { href: "/docs/mcp", label: "MCP server", badge: "new" },
      { href: "/docs/skills", label: "Skills", badge: "new" },
      { href: "/docs/changelog", label: "Changelog" },
      { href: "/llms.txt", label: "llms.txt", external: true },
    ],
  },
  {
    label: "Installation",
    /*
     * The same list the picker grid renders, minus the HTML flavour: its guide
     * is `/docs/html-css`, which already sits in Get Started, and one href in
     * two groups would give the previous/next walk two answers.
     */
    items: INSTALL_TARGETS.filter((target) => target.id !== "html").map(
      (target) => ({ href: target.href, label: target.title })
    ),
  },
  {
    label: "Design",
    items: [
      { href: "/docs/design", label: "Design guide" },
      { href: "/docs/accessibility", label: "Accessibility" },
      { href: "/docs/trademark", label: "Trademark" },
      { href: "/colors", label: "Colours and tokens" },
    ],
  },
  {
    label: "Forms",
    items: [
      { href: "/docs/forms", label: "Overview", badge: "new" },
      { href: "/docs/forms/react-hook-form", label: "react-hook-form" },
      { href: "/docs/forms/tanstack-form", label: "TanStack Form" },
      { href: "/docs/forms/vee-validate", label: "vee-validate" },
    ],
  },
  {
    label: "Registry",
    items: [
      { href: "/docs/registry", label: "Introduction" },
      { href: "/docs/registry/getting-started", label: "Getting started" },
      { href: "/docs/registry/registry-json", label: "registry.json" },
      {
        href: "/docs/registry/registry-item-json",
        label: "registry-item.json",
      },
      { href: "/docs/registry/examples", label: "Examples" },
      { href: "/docs/registry/mcp", label: "MCP" },
    ],
  },
]

/*
 * One group per registry category, in registry order, so the sidebar and the
 * component pages agree about what follows what.
 */
export const NAV: readonly NavGroup[] = [
  ...GUIDES,
  ...categories.map((category) => ({
    label: category.label,
    items: COMPONENTS.filter(
      (component) => component.categorySlug === category.slug
    ).map((component) => ({
      href: `/docs/components/${component.name}`,
      label: component.title,
    })),
  })),
]

const FLAT: readonly NavItem[] = NAV.flatMap((group) => group.items).filter(
  (item) => item.external !== true
)

export function neighbours(path: string): NavNeighbours {
  const index = FLAT.findIndex((item) => item.href === path)
  if (index === -1) return {}
  return { previous: FLAT[index - 1], next: FLAT[index + 1] }
}
