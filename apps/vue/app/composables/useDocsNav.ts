import { categories } from "@/lib/registry/registry-categories"
import { ui } from "@/lib/registry/registry-ui"

export interface DocsNavLink {
  id: string
  label: string
  /** Component entries are in-page anchors; getting-started links are not. */
  anchor: boolean
}

export interface DocsNavGroup {
  label: string
  links: DocsNavLink[]
}

/** Human title for a registry entry, falling back to its slug. */
function titleFor(name: string): string {
  return ui.find((item) => item.name === name)?.title ?? name
}

/** Side-nav model shape returned by {@link useDocsNav}. */
export interface DocsNavResult {
  groups: DocsNavGroup[]
  componentCount: number
}

/**
 * Side-nav model: the hand-written "Getting started" links followed by one
 * group per registry category.
 */
export function useDocsNav(): DocsNavResult {
  const groups: DocsNavGroup[] = [
    {
      label: "Getting started",
      links: [
        { id: "overview", label: "Overview", anchor: false },
        { id: "installation", label: "Installation", anchor: false },
        { id: "tokens", label: "Design tokens", anchor: false },
      ],
    },
    ...categories.map((category) => ({
      label: category.label,
      links: category.components.map((name) => ({
        id: name,
        label: titleFor(name),
        anchor: true,
      })),
    })),
  ]

  const componentCount = categories.reduce(
    (sum, category) => sum + category.components.length,
    0
  )

  return { groups, componentCount }
}
