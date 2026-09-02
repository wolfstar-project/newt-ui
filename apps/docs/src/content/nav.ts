import { categories } from "@/registry/registry-categories"

import { COMPONENTS } from "./components"

export interface NavItem {
  readonly href: string
  readonly label: string
}

export interface NavGroup {
  readonly label: string
  readonly items: readonly NavItem[]
}

export interface NavNeighbours {
  readonly previous?: NavItem
  readonly next?: NavItem
}

function itemsFor(categorySlug: string): readonly NavItem[] {
  return COMPONENTS.filter(
    (component) => component.categorySlug === categorySlug
  ).map((component) => ({
    href: `/docs/components/${component.name}`,
    label: component.title,
  }))
}

/*
 * One group per registry category, in registry order, so the sidebar and the
 * component pages agree about what follows what.
 */
export const NAV: readonly NavGroup[] = [
  {
    label: "Start",
    items: [
      { href: "/", label: "Overview" },
      { href: "/docs/installation", label: "Installation" },
    ],
  },
  ...categories.map((category) => ({
    label: category.label,
    items: itemsFor(category.slug),
  })),
]

const FLAT: readonly NavItem[] = NAV.flatMap((group) => group.items)

export function neighbours(path: string): NavNeighbours {
  const index = FLAT.findIndex((item) => item.href === path)
  if (index === -1) return { previous: undefined, next: undefined }
  return { previous: FLAT[index - 1], next: FLAT[index + 1] }
}
