import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const codeTokenVariants = cva("", {
  variants: {
    kind: {
      keyword: "text-[#569cd6]",
      string: "text-[#ce9178]",
      comment: "text-[#6a9955]",
      function: "text-[#dcdcaa]",
    },
  },
})

export interface CodeTokenProps
  extends
    React.ComponentProps<"span">,
    VariantProps<typeof codeTokenVariants> {}

const CodeToken = React.forwardRef<HTMLSpanElement, CodeTokenProps>(
  ({ className, kind, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(codeTokenVariants({ kind }), className)}
      {...props}
    />
  )
)
CodeToken.displayName = "CodeToken"

/** A run of source, coloured by `kind` when given, plain when not. */
export interface CodeTokenSpec {
  readonly text: string
  readonly kind?: VariantProps<typeof codeTokenVariants>["kind"]
}

/* ---------------------------------------------------------------------------
 * The scanner
 *
 * Four colours is all this block has, so it needs four answers, not a parse
 * tree: comment, string, keyword, call. That is small enough to ship inside
 * the component — a chat message showing six lines of code should not pull a
 * highlighter and a grammar in behind it. Anything that needs real grammar
 * (a diff, a language not listed here, semantic colours) produces its own runs
 * and hands them over as `tokens`.
 * ------------------------------------------------------------------------ */

export type CodeLanguage = "ts" | "tsx" | "js" | "jsx" | "json" | "bash" | "sh"

interface LanguageRules {
  /** Words painted as keywords wherever they stand alone. */
  readonly keywords: readonly string[]
  /** Runs to the end of the line. Empty when the language has none. */
  readonly lineComment: string
  /** Whether a slash-star pair opens a comment. */
  readonly blockComments: boolean
  /** The characters that open a string, each closed by itself. */
  readonly quotes: string
}

const JS_KEYWORDS = [
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "satisfies",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "yield",
]

const SHELL_KEYWORDS = [
  "case",
  "cd",
  "do",
  "done",
  "echo",
  "elif",
  "else",
  "esac",
  "exit",
  "export",
  "fi",
  "for",
  "function",
  "if",
  "in",
  "local",
  "return",
  "then",
  "while",
]

const JS_RULES = {
  keywords: JS_KEYWORDS,
  lineComment: "//",
  blockComments: true,
  quotes: "\"'`",
} as const satisfies LanguageRules

const SHELL_RULES = {
  keywords: SHELL_KEYWORDS,
  lineComment: "#",
  blockComments: false,
  quotes: "\"'",
} as const satisfies LanguageRules

const LANGUAGES = {
  ts: JS_RULES,
  tsx: JS_RULES,
  js: JS_RULES,
  jsx: JS_RULES,
  json: {
    keywords: ["false", "null", "true"],
    lineComment: "",
    blockComments: false,
    quotes: '"',
  },
  bash: SHELL_RULES,
  sh: SHELL_RULES,
} as const satisfies Record<CodeLanguage, LanguageRules>

const IDENTIFIER_START = /[A-Za-z_$]/
const IDENTIFIER_PART = /[A-Za-z0-9_$]/

/** Where the string opened at `start` ends, past its closing quote. */
function endOfString(code: string, start: number): number {
  const quote = code[start]
  let index = start + 1
  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2
      continue
    }
    if (code[index] === quote) return index + 1
    index += 1
  }
  return code.length
}

/** Where the identifier starting at `start` ends. */
function endOfIdentifier(code: string, start: number): number {
  let index = start + 1
  while (index < code.length && IDENTIFIER_PART.test(code[index] ?? "")) {
    index += 1
  }
  return index
}

/**
 * Splits source into coloured runs. Unrecognised text stays plain, so a
 * language this scanner reads badly is dull rather than wrong.
 */
export function tokenizeCode(
  code: string,
  language: CodeLanguage
): readonly CodeTokenSpec[] {
  const rules: LanguageRules = LANGUAGES[language]
  const tokens: CodeTokenSpec[] = []
  let plain = ""
  let index = 0

  function flush() {
    if (plain !== "") {
      tokens.push({ text: plain })
      plain = ""
    }
  }

  while (index < code.length) {
    const char = code[index] ?? ""

    if (rules.lineComment !== "" && code.startsWith(rules.lineComment, index)) {
      const newline = code.indexOf("\n", index)
      const end = newline === -1 ? code.length : newline
      flush()
      tokens.push({ text: code.slice(index, end), kind: "comment" })
      index = end
      continue
    }

    if (rules.blockComments && code.startsWith("/*", index)) {
      const close = code.indexOf("*/", index + 2)
      const end = close === -1 ? code.length : close + 2
      flush()
      tokens.push({ text: code.slice(index, end), kind: "comment" })
      index = end
      continue
    }

    if (rules.quotes.includes(char)) {
      const end = endOfString(code, index)
      flush()
      tokens.push({ text: code.slice(index, end), kind: "string" })
      index = end
      continue
    }

    if (IDENTIFIER_START.test(char)) {
      const end = endOfIdentifier(code, index)
      const word = code.slice(index, end)
      /* A name is a call when a bracket follows it, which is as far as a
       * scanner without a parser can honestly go. */
      const kind = rules.keywords.includes(word)
        ? "keyword"
        : code[end] === "("
          ? "function"
          : undefined
      if (kind === undefined) {
        plain += word
      } else {
        flush()
        tokens.push({ text: word, kind })
      }
      index = end
      continue
    }

    plain += char
    index += 1
  }

  flush()
  return tokens
}

/* ------------------------------------------------------------------------ */

type PreProps = Omit<React.ComponentProps<"pre">, "children">

interface HighlightedCodeBlockProps extends PreProps {
  /** Colours the source with the built-in scanner. */
  language: CodeLanguage
  /** The source, when a prop reads better than a child. */
  code?: string
  /** The source. A template literal keeps its newlines; JSX text does not. */
  children?: string
  tokens?: never
}

interface TokenisedCodeBlockProps extends PreProps {
  language?: never
  code?: never
  /** Runs from a real highlighter, for what the scanner cannot read. */
  tokens: readonly CodeTokenSpec[]
  children?: never
}

interface ComposedCodeBlockProps extends PreProps {
  language?: never
  code?: never
  tokens?: never
  /** `CodeToken` children, placed by hand. */
  children?: React.ReactNode
}

export type CodeBlockProps =
  | HighlightedCodeBlockProps
  | TokenisedCodeBlockProps
  | ComposedCodeBlockProps

function paint(tokens: readonly CodeTokenSpec[]): React.ReactNode {
  return tokens.map((token, index) =>
    token.kind === undefined ? (
      <React.Fragment key={index}>{token.text}</React.Fragment>
    ) : (
      <CodeToken key={index} kind={token.kind}>
        {token.text}
      </CodeToken>
    )
  )
}

function contentOf(props: CodeBlockProps): React.ReactNode {
  if (props.language !== undefined) {
    return paint(
      tokenizeCode(props.code ?? props.children ?? "", props.language)
    )
  }
  if (props.tokens !== undefined) return paint(props.tokens)
  return props.children
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (props, ref) => {
    /* The four authoring props are read by `contentOf`; peeling them off here
     * is only so they never reach the DOM. */
    const {
      className,
      language: _language,
      code: _code,
      tokens: _tokens,
      children: _children,
      ...rest
    } = props
    return (
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-md border border-newt-border bg-[#111214] p-4 font-mono text-[13px] leading-[1.6] text-newt-text-secondary",
          className
        )}
        {...rest}
      >
        {contentOf(props)}
      </pre>
    )
  }
)
CodeBlock.displayName = "CodeBlock"

export { CodeBlock, CodeToken, codeTokenVariants }
