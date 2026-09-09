import { cva, type VariantProps } from "class-variance-authority"

export { default as Typeset } from "./Typeset.vue"

/*
 * Typeset is a wrapper and two class names — the rules live in the stylesheet
 * `add typeset` appended, keyed on `.typeset`. Nothing inside needs a class of
 * its own, which is the point: what goes in is whatever a markdown renderer
 * emitted, and it comes out with the library's rhythm.
 */
export const typesetVariants = cva("typeset", {
  variants: {
    preset: {
      docs: "typeset-docs",
      chat: "typeset-chat",
      article: "typeset-article",
    },
    measure: {
      true: "typeset-measure",
      false: "",
    },
  },
  defaultVariants: {
    preset: "docs",
    measure: false,
  },
})

export type TypesetVariants = VariantProps<typeof typesetVariants>
