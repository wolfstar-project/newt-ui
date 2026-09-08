import { cva, type VariantProps } from "class-variance-authority"

export { default as CodeBlock } from "./CodeBlock.vue"
export { default as CodeToken } from "./CodeToken.vue"

export const codeTokenVariants = cva("", {
  variants: {
    kind: {
      keyword: "text-[#569cd6]",
      string: "text-[#ce9178]",
      comment: "text-[#6a9955]",
      function: "text-[#dcdcaa]",
    },
  },
})

export type CodeTokenVariants = VariantProps<typeof codeTokenVariants>
