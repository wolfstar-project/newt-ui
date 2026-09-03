import { useEffect, useState, type ReactNode } from "react"

import { cn } from "../lib/utils"
import { tokenizeLines, type Lang } from "./highlight"
import { useSettings } from "./settings"

/** the corner tick's colour: the framework a block is written in, or the brand when it is neither */
type Accent = "brand" | "react" | "vue"

const ACCENT_BORDER = {
  brand: "border-indigo",
  react: "border-[var(--brand-react)]",
  vue: "border-[var(--brand-vue)]",
} satisfies Record<Accent, string>

interface CodeBlockProps {
  readonly code: string
  /** a shell block prints a prompt the reader must not carry into their terminal */
  readonly shell?: boolean
  /** a listing that is not source in this language stays plain, unhighlighted text */
  readonly lang?: Lang
  readonly accent?: Accent
  readonly className?: string
}

type Lines = Awaited<ReturnType<typeof tokenizeLines>>

export function CodeBlock({
  code,
  shell = false,
  lang,
  accent = "brand",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [lines, setLines] = useState<Lines | undefined>(undefined)

  useEffect(() => {
    if (!lang) {
      setLines(undefined)
      return undefined
    }
    let live = true
    void tokenizeLines(code, lang).then((result) => {
      if (live) setLines(result)
    })
    return () => {
      live = false
    }
  }, [code, lang])

  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timer)
  }, [copied])

  /*
   * A denied clipboard permission is an ordinary answer, not a crash: the
   * button simply never says it copied.
   */
  const copy = () => {
    void navigator.clipboard.writeText(code).then(
      () => setCopied(true),
      () => setCopied(false)
    )
  }

  return (
    <div
      className={cn(
        "relative max-w-2xl border border-reed bg-sunken",
        className
      )}
    >
      {/* the corner tick a preview is signed with, drawn on the border itself */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-px -left-px size-2 border-t border-l",
          ACCENT_BORDER[accent]
        )}
      />
      <pre className="overflow-x-auto p-4 pt-9 font-data text-[13px] leading-relaxed text-weft">
        {code.split("\n").map((line, index) => (
          <span key={`${index}:${line}`} className="block">
            {shell && (
              /* outside the copied range, so a selection yields the command alone */
              <span className="text-weft-faint select-none">$ </span>
            )}
            {lines?.[index]?.map((token, tokenIndex) => (
              <span
                key={`${tokenIndex}:${token.content}`}
                style={{ color: token.color }}
              >
                {token.content}
              </span>
            )) ?? line}
          </span>
        ))}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        className={cn(
          "absolute top-2 right-2 h-6 cursor-pointer border px-2 font-data text-[11px] tracking-[0.04em] uppercase transition-colors duration-(--dur-instant) ease-(--ease-beat)",
          copied
            ? "border-jade text-jade"
            : "border-reed text-weft-faint hover:border-weft-faint hover:text-weft"
        )}
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  )
}

interface FrameworkBlockProps {
  readonly react: string
  readonly vue: string
  readonly shell?: boolean
  readonly lang?: Lang
  readonly className?: string
}

/** The same instruction in both languages; the sidebar has already chosen one. */
export function FrameworkBlock({
  react,
  vue,
  shell,
  lang,
  className,
}: FrameworkBlockProps) {
  const { framework } = useSettings()
  return (
    <CodeBlock
      code={framework === "react" ? react : vue}
      shell={shell}
      lang={lang}
      accent={framework}
      className={className}
    />
  )
}

interface FrameworkTextProps {
  readonly react: ReactNode
  readonly vue: ReactNode
}

/** Prose bends with the framework too, so a sentence can name the right file. */
export function FrameworkText({ react, vue }: FrameworkTextProps) {
  const { framework } = useSettings()
  return framework === "react" ? react : vue
}
