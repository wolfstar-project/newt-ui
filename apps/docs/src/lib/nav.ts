import { categories } from "@/registry/registry-categories"

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

const GET_STARTED: NavGroup = {
  label: "Get Started",
  items: [
    { href: "/docs", label: "Introduction" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/docs/using-with-ai", label: "Using with AI" },
    { href: "/llms.txt", label: "llms.txt", external: true },
  ],
}

/*
 * One group per registry category, in registry order, so the sidebar and the
 * component pages agree about what follows what.
 */
export const NAV: readonly NavGroup[] = [
  GET_STARTED,
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
