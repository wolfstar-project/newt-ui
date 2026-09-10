import type { InjectionKey, Ref } from "vue"

export { default as CheckboxGroup } from "./CheckboxGroup.vue"
export { default as CheckboxOption } from "./CheckboxOption.vue"

/** What a row needs from the group it sits in. */
export interface CheckboxGroupContext {
  readonly values: Ref<readonly string[]>
  readonly toggle: (value: string) => void
  readonly name: Ref<string>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol(
  "newt-checkbox-group"
)
