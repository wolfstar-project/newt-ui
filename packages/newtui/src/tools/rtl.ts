/*
 * The registry ships logical properties, so nothing installed after that change
 * needs converting. This exists for the components already sitting in
 * somebody's project from before it: the same rewrite, applied to their copy.
 *
 * It is textual on purpose. The files it edits are the user's, they have been
 * changed since they were installed, and a parser that reformatted them would
 * cost more than the rewrite is worth.
 */

/** A physical Tailwind utility and the logical one that replaces it. */
interface Pair {
  readonly from: string
  readonly to: string
}

/*
 * Longest first: `rounded-tl` has to be matched before `rounded-l`, and
 * `scroll-ml` before `ml`.
 */
const PAIRS: readonly Pair[] = [
  { from: "rounded-tl", to: "rounded-ss" },
  { from: "rounded-tr", to: "rounded-se" },
  { from: "rounded-bl", to: "rounded-es" },
  { from: "rounded-br", to: "rounded-ee" },
  { from: "rounded-l", to: "rounded-s" },
  { from: "rounded-r", to: "rounded-e" },
  { from: "scroll-ml", to: "scroll-ms" },
  { from: "scroll-mr", to: "scroll-me" },
  { from: "scroll-pl", to: "scroll-ps" },
  { from: "scroll-pr", to: "scroll-pe" },
  { from: "border-l", to: "border-s" },
  { from: "border-r", to: "border-e" },
  { from: "ml", to: "ms" },
  { from: "mr", to: "me" },
  { from: "pl", to: "ps" },
  { from: "pr", to: "pe" },
  { from: "left", to: "start" },
  { from: "right", to: "end" },
]

/*
 * A utility is `<prefix>-<value>`, optionally negated and optionally behind
 * variants (`hover:`, `md:`, `before:`). The leading `-?` is the negation, and
 * the lookbehind sits before it, so `before:-left-2` matches while
 * `data-left-panel` and `margin-left:` do not. The lookahead requires a value,
 * so a bare word is never rewritten.
 */
const RULES: readonly { readonly pattern: RegExp; readonly to: string }[] =
  PAIRS.map(({ from, to }) => ({
    pattern: new RegExp(`(?<![\\w-])(-?)${from}(?=-(?:\\[|[\\w./%]))`, "g"),
    to,
  }))

const LITERALS: readonly { readonly pattern: RegExp; readonly to: string }[] = [
  { pattern: /(?<![\w-])text-left(?![\w-])/g, to: "text-start" },
  { pattern: /(?<![\w-])text-right(?![\w-])/g, to: "text-end" },
]

/** `space-x-*` is not direction-safe on Tailwind v3; `gap` is. */
const SPACE_X = /(?<![\w-])(-?)space-x-([\w[\]./%-]+)/g

export interface RtlRewrite {
  readonly code: string
  /** One line per substitution, for the command to print. */
  readonly changes: string[]
}

/**
 * Rewrite the physical Tailwind utilities in `code` to their logical
 * equivalents. Running it twice changes nothing the second time: the outputs
 * are not themselves inputs of any rule.
 */
export function rewriteRtl(code: string): RtlRewrite {
  const changes: string[] = []
  let out = code

  for (const { pattern, to } of RULES) {
    out = out.replace(pattern, (match: string, sign: string) => {
      changes.push(`${match} → ${sign}${to}`)
      return `${sign}${to}`
    })
  }

  for (const { pattern, to } of LITERALS) {
    out = out.replace(pattern, (match: string) => {
      changes.push(`${match} → ${to}`)
      return to
    })
  }

  // `gap` applies to the whole flex container, not to the gaps between its
  // children, so this is reported rather than silently applied.
  out = out.replace(SPACE_X, (match, sign: string, value: string) => {
    changes.push(`${match} → ${sign}gap-${value} (check the layout)`)
    return `${sign}gap-${value}`
  })

  return { code: out, changes }
}
