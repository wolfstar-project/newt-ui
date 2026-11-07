"use client"

import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

export type ExpressionKind = "emoji" | "sticker" | "gif"

/** IDs must be unique across all three kinds. Media previews must be static. */
export type ExpressionItem = {
  id: string
  label: string
  keywords?: readonly string[]
  disabled?: boolean
} & (
  | { kind: "emoji"; value: string; previewSrc?: never }
  | { kind: "sticker" | "gif"; value: string; previewSrc?: string }
)

export interface ExpressionsPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  items?: readonly ExpressionItem[]
  label?: string
  disabled?: boolean
  onSelect?: (item: ExpressionItem) => void
}

const kinds: { kind: ExpressionKind; label: string }[] = [
  { kind: "emoji", label: "Emoji" },
  { kind: "sticker", label: "Stickers" },
  { kind: "gif", label: "GIFs" },
]

export const expressionsPickerVariants = cva(
  "min-h-[var(--newt-expressions-target-size)] cursor-pointer rounded-sm border border-newt-border bg-newt-bg-elevated px-[var(--newt-space-3)] py-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary enabled:hover:bg-newt-bg-hover enabled:active:bg-newt-bg-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:text-newt-text-muted",
  {
    variants: {
      selected: {
        true: "underline underline-offset-[var(--newt-space-1)] bg-newt-bg-active",
        false: "",
      },
    },
    defaultVariants: { selected: false },
  }
)

function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return
  const controls = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [tabindex="0"]'
    ),
  ].filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
  )
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

const ExpressionsPicker = React.forwardRef<
  HTMLDivElement,
  ExpressionsPickerProps
>(
  (
    {
      items = [],
      label = "Choose an expression",
      disabled = false,
      onSelect,
      className,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const dialog = React.useRef<HTMLDialogElement>(null)
    const trigger = React.useRef<HTMLButtonElement>(null)
    const search = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [kind, setKind] = React.useState<ExpressionKind>("emoji")
    const [query, setQuery] = React.useState("")
    const visible = items.filter(
      (item) =>
        item.kind === kind &&
        [item.label, ...(item.keywords ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )

    function close() {
      dialog.current?.close()
    }
    function show() {
      if (disabled) return
      setQuery("")
      dialog.current?.showModal()
      setOpen(true)
      search.current?.focus()
    }
    React.useEffect(() => {
      if (disabled) dialog.current?.close()
    }, [disabled])

    function tabKey(
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
    ) {
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
      const step =
        event.key === "ArrowRight"
          ? rtl
            ? -1
            : 1
          : event.key === "ArrowLeft"
            ? rtl
              ? 1
              : -1
            : 0
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? 2
            : step
              ? (index + step + 3) % 3
              : -1
      const nextTab = kinds[next]
      if (!nextTab) return
      event.preventDefault()
      setKind(nextTab.kind)
      dialog.current
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        .item(next)
        ?.focus()
    }

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        <button
          ref={trigger}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={id}
          onClick={show}
          className={expressionsPickerVariants()}
        >
          {label}
        </button>
        <dialog
          onKeyDown={trapFocus}
          ref={dialog}
          id={id}
          aria-label={label}
          className="m-auto box-border w-[var(--newt-expressions-width)] max-w-[calc(100%-2*var(--newt-space-3))] max-h-[calc(100dvh-2*var(--newt-space-3))] overflow-y-auto rounded-lg border border-newt-border bg-newt-bg-floating p-[var(--newt-space-3)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary shadow-elevation-high backdrop:bg-[color-mix(in_srgb,var(--newt-bg-base)_80%,transparent)]"
          onClose={() => {
            setOpen(false)
            trigger.current?.focus()
          }}
        >
          <div className="grid gap-[var(--newt-space-3)]">
            <div className="flex items-center justify-between gap-[var(--newt-space-2)]">
              <strong>{label}</strong>
              <button
                type="button"
                aria-label="Close expressions picker"
                onClick={close}
                className={expressionsPickerVariants()}
              >
                ×
              </button>
            </div>
            <div
              role="tablist"
              aria-label="Expression type"
              className="flex items-center justify-between gap-[var(--newt-space-2)]"
            >
              {kinds.map((tab, index) => (
                <button
                  key={tab.kind}
                  id={`${id}-${tab.kind}`}
                  role="tab"
                  type="button"
                  aria-selected={kind === tab.kind}
                  aria-controls={`${id}-results`}
                  tabIndex={kind === tab.kind ? 0 : -1}
                  onClick={() => setKind(tab.kind)}
                  onKeyDown={(event) => tabKey(event, index)}
                  className={expressionsPickerVariants({
                    selected: kind === tab.kind,
                  })}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <label className="grid gap-[var(--newt-space-3)]">
              Search expressions
              <input
                ref={search}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="box-border min-h-[var(--newt-expressions-target-size)] w-full rounded-sm border border-newt-border bg-newt-bg-input p-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary placeholder:text-newt-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
                placeholder="Search by name or keyword"
              />
            </label>
            <div
              id={`${id}-results`}
              role="tabpanel"
              aria-labelledby={`${id}-${kind}`}
              tabIndex={0}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
            >
              <ul className="m-0 grid max-h-[var(--newt-expressions-results-height)] grid-cols-3 gap-[var(--newt-space-2)] overflow-y-auto p-[var(--newt-space-1)] list-none">
                {visible.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={disabled || item.disabled}
                      onClick={() => {
                        close()
                        onSelect?.(item)
                      }}
                      className={cn(
                        expressionsPickerVariants(),
                        "flex h-full w-full min-w-0 flex-col items-center justify-center gap-[var(--newt-space-1)] break-words"
                      )}
                    >
                      {item.kind === "emoji" ? (
                        <span
                          aria-hidden="true"
                          className="text-[length:var(--newt-font-size-expression)]"
                        >
                          {item.value}
                        </span>
                      ) : item.previewSrc ? (
                        <img
                          src={item.previewSrc}
                          alt=""
                          loading="lazy"
                          className="size-[var(--newt-expressions-preview-size)] object-contain"
                        />
                      ) : null}
                      <span>{item.label}</span>
                      {item.disabled ? <span>Unavailable</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <p role="status" className="m-0 text-newt-text-secondary">
              {visible.length
                ? `${visible.length} expressions`
                : "No expressions found. Try another search or type."}
            </p>
          </div>
        </dialog>
      </div>
    )
  }
)
ExpressionsPicker.displayName = "ExpressionsPicker"
export { ExpressionsPicker }
