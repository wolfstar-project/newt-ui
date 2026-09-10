import type { ComputedRef, InjectionKey } from "vue"

export { default as Tabs } from "./Tabs.vue"
export { default as TabsTrigger } from "./TabsTrigger.vue"
export { default as TabsContent } from "./TabsContent.vue"

export interface TabsContext {
  value: ComputedRef<string | undefined>
  setValue: (value: string) => void
}

export const TABS_INJECTION_KEY: InjectionKey<TabsContext> = Symbol("NewtTabs")
