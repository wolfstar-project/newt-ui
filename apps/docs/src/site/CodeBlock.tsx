import { useEffect, useState, type ReactNode } from "react"

import { cn } from "../lib/utils"
import { useSettings } from "./settings"

interface CodeBlockProps {
  readonly code: string
  /** a shell block prints a prompt the reader must not carry into their terminal */
  readonly shell?: boolean
  readonly className?: string
}

export function CodeBlock({ code, shell = false, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

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
        "group relative max-w-2xl border border-reed bg-sunken",
        className
      )}
    >
      <pre className="overflow-x-auto p-4 font-data text-[13px] leading-relaxed text-weft">
        {shell
          ? code.split("\n").map((line, index) => (
              <span key={`${index}:${line}`} className="block">
                {/* outside the copied range, so a selection yields the command alone */}
                <span className="text-weft-faint select-none">$ </span>
                {line}
              </span>
            ))
          : code}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        className="absolute top-2 right-2 h-6 cursor-pointer border border-reed bg-ground px-2 font-data text-[11px] text-weft-dim opacity-0 transition-colors duration-(--dur-instant) ease-(--ease-beat) group-hover:opacity-100 hover:text-weft focus-visible:opacity-100"
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
  readonly className?: string
}

/** The same instruction in both languages; the sidebar has already chosen one. */
export function FrameworkBlock({
  react,
  vue,
  shell,
  className,
}: FrameworkBlockProps) {
  const { framework } = useSettings()
  return (
    <CodeBlock
      code={framework === "react" ? react : vue}
      shell={shell}
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
