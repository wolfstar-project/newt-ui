import type {
  DocsNavConfig,
  SidebarItemConfig,
} from "@prosefly/astro-theme-lotus"
import type {
  DocsPaginationNav,
  DocsSidebarItem,
  DocsSidebarNav,
} from "@prosefly/astro-theme-lotus/navigation"

import { NAV, type NavGroup, type NavItem } from "./nav"

/*
 * The sidebar the theme reads. `NAV` is already the thirteen groups in reading
 * order — `GUIDES` (Get Started, Installation from `INSTALL_TARGETS`, Design,
 * Forms) followed by one group per registry category, `categories` crossed
 * with `COMPONENTS` — so this file translates that shape rather than deriving
 * it a second time. `/docs/registry/**` stays out of the sidebar here for the
 * same reason it does there.
 *
 * Two constraints shape the file.
 *
 * 1. The result is serialised into a virtual module by the integration, so it
 *    can hold only JSON: no functions, no symbols, no class instances. Hence
 *    plain object literals all the way down.
 * 2. Every entry is a `link` rather than a bare slug string. A bare slug makes
 *    the theme label the item from the page's own frontmatter title, and this
 *    sidebar deliberately says "Introduction", "Overview", "Next.js" where the
 *    pages say something longer. `slug` is handed over anyway, because that is
 *    the key prev/next and the group heading match on.
 */

/** `/docs/components/button` → `components/button`; `/docs` → `index`. */
function docsSlug(href: string): string | undefined {
  if (href !== "/docs" && !href.startsWith("/docs/")) return undefined
  const rest = href.slice("/docs".length).replace(/^\/+|\/+$/g, "")
  return rest === "" ? "index" : rest
}

/*
 * Pages outside `/docs` — the colour reference, the changelog index — are still
 * steps in the reading order, so they get a slug of their own. It matches no
 * content entry, which is exactly right: they can be somebody's next page
 * without ever being the current one.
 */
function outsideSlug(href: string): string {
  return href.replace(/^\/+|\/+$/g, "")
}

function toItem(item: NavItem): SidebarItemConfig {
  /* No slug on an external link: `/llms.txt` sits outside the walk. */
  if (item.external === true) {
    return { label: item.label, link: item.href, external: true }
  }
  return {
    label: item.label,
    link: item.href,
    slug: docsSlug(item.href) ?? outsideSlug(item.href),
  }
}

function toGroup(group: NavGroup): SidebarItemConfig {
  return { label: group.label, items: group.items.map(toItem) }
}

/** The slug of the one section, so the SubNav has nothing to switch between. */
export const DOCS_SECTION = "docs"

/**
 * The whole sidebar as Lotus wants it: a single section, which is what lets
 * the SubNav the theme always renders be hidden in CSS without losing
 * anything.
 */
export function buildDocsNav(nav: readonly NavGroup[] = NAV): DocsNavConfig[] {
  return [{ slug: DOCS_SECTION, label: "Docs", items: nav.map(toGroup) }]
}

/* ------------------------------------------------------------------ *
 * prev/next
 *
 * `getSidebarPagination` exists in the theme but is not reachable through its
 * exports map, so the fifteen lines it is made of live here instead. The input
 * is `getDocsContext().sidebars[section]`, the same structure the theme's own
 * copy walks.
 * ------------------------------------------------------------------ */

function flatten(items: readonly DocsSidebarItem[]): DocsSidebarItem[] {
  return items.flatMap((item) => {
    const children = item.items ? flatten(item.items) : []
    return item.slug !== undefined &&
      item.href !== undefined &&
      item.external !== true
      ? [item, ...children]
      : children
  })
}

/** Every linkable item of a sidebar, in reading order. */
export function sidebarItems(sidebar: DocsSidebarNav): DocsSidebarItem[] {
  return [
    ...flatten(sidebar.links),
    ...sidebar.groups.flatMap((group) => flatten(group.items)),
  ]
}

/** The pages either side of `currentSlug`, or nothing when it is not listed. */
export function pagination(
  sidebar: DocsSidebarNav,
  currentSlug: string
): DocsPaginationNav {
  const items = sidebarItems(sidebar)
  const index = items.findIndex((item) => item.slug === currentSlug)
  if (index === -1) return {}
  const at = (offset: number) => {
    const item = items[index + offset]
    return item?.href !== undefined && item.slug !== undefined
      ? { label: item.label, href: item.href, slug: item.slug }
      : undefined
  }
  return { previous: at(-1), next: at(1) }
}

/** The group heading a page sits under, for the eyebrow above its title. */
export function sectionTitleFor(
  sidebar: DocsSidebarNav,
  currentSlug: string
): string | undefined {
  for (const group of sidebar.groups) {
    if (flatten(group.items).some((item) => item.slug === currentSlug)) {
      return group.title
    }
  }
  return undefined
}
