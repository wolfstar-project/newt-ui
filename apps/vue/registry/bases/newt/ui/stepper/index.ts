export { default as Stepper } from "./Stepper.vue"

/** One stage of the sequence. */
export interface StepperStep {
  title: string
  /** The quieter line under the title. */
  description?: string
}
