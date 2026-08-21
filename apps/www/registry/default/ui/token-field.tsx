"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/form-fields"

export interface TokenFieldProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The secret value. Masked until revealed. */
  value: string
  /** Id forwarded to the input so a label can target it. */
  id?: string
  /** Accessible name for the input when no visible label is linked. */
  name?: string
  /** Label of the reveal button while hidden. */
  revealLabel?: string
  /** Label of the reveal button while shown. */
  hideLabel?: string
  /** Label of the copy button. */
  copyLabel?: string
  /** Label of the copy button right after copying. */
  copiedLabel?: string
  /** How long (ms) the copied label is shown. */
  copiedDuration?: number
  /** Called after the value is written to the clipboard. */
  onCopy?: () => void
}

const TokenField = React.forwardRef<HTMLDivElement, TokenFieldProps>(
  (
    {
      className,
      value,
      id,
      name,
      revealLabel = "Reveal",
      hideLabel = "Hide",
      copyLabel = "Copy",
      copiedLabel = "Copied!",
      copiedDuration = 1500,
      onCopy,
      ...props
    },
    ref
  ) => {
    const [revealed, setRevealed] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(
      () => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      },
      []
    )

    const handleCopy = async () => {
      await navigator.clipboard.writeText(value)
      onCopy?.()
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), copiedDuration)
    }

    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        <Input
          id={id}
          name={name}
          type={revealed ? "text" : "password"}
          value={value}
          readOnly
          className="font-mono tracking-[0.05em]"
        />
        <Button
          type="button"
          variant="secondary"
          aria-pressed={revealed}
          onClick={() => setRevealed((r) => !r)}
        >
          {revealed ? hideLabel : revealLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          aria-live="polite"
          onClick={() => void handleCopy()}
        >
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
    )
  }
)
TokenField.displayName = "TokenField"

export { TokenField }
