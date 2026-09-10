import type { ComputedRef, InjectionKey, Ref } from "vue"

export { default as Poll } from "./Poll.vue"
export { default as PollAnswer } from "./PollAnswer.vue"
export { default as PollAnswers } from "./PollAnswers.vue"
export { default as PollFooter } from "./PollFooter.vue"
export { default as PollQuestion } from "./PollQuestion.vue"

/** What an answer needs from the poll it sits in. */
export interface PollContext {
  readonly total: Ref<number>
  readonly showResults: Ref<boolean>
  readonly selected: ComputedRef<readonly string[]>
  readonly choose: (value: string) => void
}

export const pollKey: InjectionKey<PollContext> = Symbol("newt-poll")
