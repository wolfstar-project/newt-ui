import { inject, provide, type InjectionKey, type Ref } from "vue"

/*
 * The group owns the value and the order rows were rendered in — the order the
 * arrow keys walk. Rows register themselves, so the group never has to inspect
 * its own slot content.
 */
export interface RadioGroupContext {
  readonly value: Ref<string | undefined>
  readonly select: (value: string) => void
  readonly register: (value: string, disabled: boolean) => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> =
  Symbol("newt-radio-group")

export function provideRadioGroup(context: RadioGroupContext): void {
  provide(RADIO_GROUP_KEY, context)
}

export function useRadioGroup(): RadioGroupContext {
  const context = inject(RADIO_GROUP_KEY, undefined)
  if (context === undefined) {
    throw new Error("<Radio> must be used inside a <RadioGroup>.")
  }
  return context
}
