"use client"

import * as React from "react"

interface PreviewProps {
  children: React.ReactNode
  /** Markup or code copied by the copy button. */
  code?: string
  /** Renders on the deepest background, like the original `.preview--dark`. */
  dark?: boolean
  /** Stacks the preview content vertically (`.preview--col`). */
  column?: boolean
  className?: string
}

export function Preview({
  children,
  code,
  dark,
  column,
  className,
}: PreviewProps) {
  const [copied, setCopied] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const copy = async () => {
    const markup =
      code ??
      (contentRef.current?.innerHTML ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n")
    try {
      await navigator.clipboard.writeText(markup)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — ignore, same as the original docs
    }
  }

  return (
    <div
      className={[
        "preview",
        dark ? "preview--dark" : "",
        column ? "preview--col" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        className={`preview__copy${copied ? " is-copied" : ""}`}
        onClick={() => void copy()}
        type="button"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <div className="preview__content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
