import { inject, ref, type InjectionKey, type Ref } from "vue"

export type Direction = "ltr" | "rtl"

export const DIRECTION_KEY: InjectionKey<Ref<Direction>> = Symbol("newt-dir")

/**
 * The direction the nearest provider set, or `"ltr"` when there is none — the
 * same default the document has.
 */
export function useDirection(): Ref<Direction> {
  return inject(DIRECTION_KEY, ref<Direction>("ltr"))
}
