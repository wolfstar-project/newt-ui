import { onBeforeUnmount, readonly, ref, type Ref } from "vue"

interface UseCopyToClipboard {
  /** `true` for `resetAfter` ms after a successful copy. */
  copied: Readonly<Ref<boolean>>
  copy: (value: string) => Promise<void>
}

/** Clipboard write with a transient "Copied" flag. */
export function useCopyToClipboard(resetAfter = 1500): UseCopyToClipboard {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(value: string): Promise<void> {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, resetAfter)
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return { copied: readonly(copied), copy }
}
