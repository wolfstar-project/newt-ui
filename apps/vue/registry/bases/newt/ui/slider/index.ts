export { default as Slider } from "./Slider.vue"

/** A named point on the track, drawn above it. */
export interface SliderMark {
  value: number
  /** What the mark says. Omitted, it shows the number. */
  label?: string
}
