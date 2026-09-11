import { categories } from "@/registry/registry-categories"

import { INSTALL_TARGETS } from "./install-targets"
import { COMPONENTS } from "./registry"

export interface NavItem {
  readonly href: string
  readonly label: string
  /** Machine routes and external links sit outside the previous/next walk. */
  readonly external?: boolean
}

export interface NavGroup {
  readonly label: string
  readonly items: readonly NavItem[]
}

/*
 * The sidebar, in reading order: what you need to get a component on screen,
 * then the decisions behind the library, then how to publish your own items,
 * then every component grouped the way the registry groups them.
 */
export const GUIDES: readonly NavGroup[] = [
  {
    label: "Get Started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/create", label: "Presets" },
      { href: "/docs/typeset", label: "Typeset" },
      { href: "/docs/components-json", label: "components.json" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/dark-mode", label: "Dark mode" },
      { href: "/docs/rtl", label: "RTL" },
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/javascript", label: "JavaScript" },
      { href: "/docs/html-css", label: "HTML & CSS" },
      { href: "/docs/using-with-ai", label: "Using with AI" },
      { href: "/docs/mcp", label: "MCP server" },
      { href: "/docs/skills", label: "Skills" },
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
      { href: "/docs/forms", label: "Overview" },
      { href: "/docs/forms/react-hook-form", label: "react-hook-form" },
      { href: "/docs/forms/tanstack-form", label: "TanStack Form" },
      { href: "/docs/forms/vee-validate", label: "vee-validate" },
    ],
  },
]

/*
 * The registry-authoring guides (`/docs/registry/**`) stay published — the CLI's
 * `--registry` flag and `NEWT_REGISTRY_URL` are real, and `components.json` and
 * the MCP guide both link into them — but they sit outside the sidebar. A
 * shadcn-based library's own docs are where a reader expects to find its
 * components, not a spec for hosting a registry of your own; that page is one
 * a reader following one of those two links opts into, not one to browse into.
 */

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
