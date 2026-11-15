export { default as PinInput } from "./PinInput.vue"

/** What the accessible name of one box is built from. */
export interface PinInputCellLabelState {
  /** The place of the box, from 1. */
  position: number
  length: number
  type: "numeric" | "alphanumeric"
}

/** The English default: `Digit 2 of 6`. Pass `formatCellLabel` to translate it. */
export function defaultPinInputCellLabel({
  position,
  length,
  type,
}: PinInputCellLabelState): string {
  return `${type === "numeric" ? "Digit" : "Character"} ${position} of ${length}`
}
