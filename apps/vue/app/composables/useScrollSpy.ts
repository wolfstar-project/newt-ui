import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  type Ref,
} from "vue"

interface UseScrollSpyOptions {
  /** Selector for the elements to observe. Each must carry an `id`. */
  selector: string
  /** Fallback id used before the first intersection fires. */
  initial?: string
  rootMargin?: string
  /** Observation is skipped (and torn down) while this returns `false`. */
  enabled?: () => boolean
}

interface UseScrollSpy {
  activeId: Readonly<Ref<string>>
  /** Re-scan the DOM — call after the route (and therefore the sections) change. */
  refresh: () => void
}

/**
 * Tracks which `[id]` section is currently in view so the side nav can
 * highlight it.
 */
export function useScrollSpy(options: UseScrollSpyOptions): UseScrollSpy {
  const { selector, initial = "", rootMargin = "-10% 0px -75% 0px" } = options
  const activeId = ref(initial)
  let observer: IntersectionObserver | null = null

  function refresh(): void {
    observer?.disconnect()
    observer = null
    if (import.meta.server) return
    if (options.enabled && !options.enabled()) return
    const created = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId.value = entry.target.id
        }
      },
      { rootMargin }
    )
    document
      .querySelectorAll<HTMLElement>(selector)
      .forEach((section) => created.observe(section))
    observer = created
  }

  onMounted(async () => {
    await nextTick()
    refresh()
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { activeId: readonly(activeId), refresh }
}
