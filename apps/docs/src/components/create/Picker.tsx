import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"

export interface PickerOption<T extends string> {
  readonly value: T
  readonly label: string
  /** Drawn before the label in the list, and in the row when selected. */
  readonly mark?: ReactNode
}

/**
 * One row of the customizer: what the setting is called, what it is set to,
 * and a list that opens over the panel to change it. Ten frameworks and five
 * hues do not fit a segmented control, and a row that only ever shows the
 * current answer is what lets six settings sit above the fold.
 *
 * It is the listbox pattern — the button owns the popup, the arrow keys move
 * through it, Escape hands focus back — because a native `<select>` cannot
 * draw a swatch or a framework mark in its options.
 */
export default function Picker<T extends string>({
  label,
  options,
  value,
  onChange,
  mark,
  children,
}: {
  readonly label: string
  readonly options: readonly PickerOption<T>[]
  readonly value: T
  readonly onChange: (next: T) => void
  /** The row's mark when the value is not one of the options. */
  readonly mark?: ReactNode
  /** Extra controls under the list, such as the custom colour input. */
  readonly children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const id = useId()

  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    /* Focus lands on the current answer, so the arrow keys start from it. */
    const current =
      list.current?.querySelector<HTMLElement>('[aria-selected="true"]') ??
      list.current?.querySelector<HTMLElement>('[role="option"]')
    current?.focus()

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      close()
      return
    }
    const items = Array.from(
      list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []
    )
    const index = items.findIndex((item) => item === document.activeElement)
    if (index === -1) return
    const target = {
      ArrowDown: items[(index + 1) % items.length],
      ArrowUp: items[(index - 1 + items.length) % items.length],
      Home: items[0],
      End: items.at(-1),
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    target.focus()
  }

  return (
    <div className="picker" ref={root} data-open={open}>
      <button
        ref={trigger}
        type="button"
        className="picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        <span className="picker-text">
          <span className="picker-label">{label}</span>
          <span className="picker-value">{selected?.label ?? "Custom"}</span>
        </span>
        <span className="picker-mark" aria-hidden="true">
          {selected?.mark ?? mark}
        </span>
      </button>

      {open && (
        <div className="picker-popup" onKeyDown={onKeyDown}>
          <div ref={list} id={id} role="listbox" aria-label={label}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                className="picker-option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value)
                  close()
                }}
              >
                <span className="picker-mark" aria-hidden="true">
                  {option.mark}
                </span>
                {option.label}
              </button>
            ))}
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
