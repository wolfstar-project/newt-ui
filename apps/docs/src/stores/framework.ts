import { atom, onMount } from "nanostores"

/*
 * Which registry the reader is looking at. One canonical URL per page serves
 * both frameworks, so the choice lives here and in `localStorage` rather than
 * in the path: search results, `.md` twins and `llms.txt` stay single-valued.
 *
 * The store is imported by React islands, Vue islands and inline scripts, and
 * the bundler emits it once, so all three observe the same atom.
 */
export const FRAMEWORKS = ["react", "vue"] as const

export type Framework = (typeof FRAMEWORKS)[number]

export const FRAMEWORK_STORAGE_KEY = "newt-ui:framework"

export function isFramework(value: string | null): value is Framework {
  return FRAMEWORKS.some((candidate) => candidate === value)
}

export const $framework = atom<Framework>("react")

onMount($framework, () => {
  const stored = localStorage.getItem(FRAMEWORK_STORAGE_KEY)
  if (isFramework(stored)) $framework.set(stored)

  /*
   * Server-rendered markup for the inactive framework is hidden by CSS keyed
   * off this attribute, so writing it here is what makes install snippets and
   * code blocks follow the switch without a re-render.
   */
  return $framework.subscribe((value) => {
    localStorage.setItem(FRAMEWORK_STORAGE_KEY, value)
    document.documentElement.dataset.framework = value
  })
})
