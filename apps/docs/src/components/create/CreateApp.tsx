import { useEffect, useRef, useState, type ReactNode } from "react"

import { INSTALL_TARGETS } from "@/lib/install-targets"
import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
  PresetError,
  presetVariables,
  PRESET_DIRECTIONS,
  PRESET_FONTS,
  PRESET_HEADINGS,
  PRESET_MODES,
  PRESET_NEUTRALS,
  PRESET_RADII,
  PRESET_SHADOWS,
  type Preset,
  type PresetFont,
  type PresetNeutral,
  type PresetRadius,
  type PresetShadow,
} from "@/lib/preset"

import FrameworkGlyph from "./FrameworkGlyph"
import Picker, { type PickerOption } from "./Picker"
import PresetOutput, { CopyButton } from "./PresetOutput"

/*
 * The brand hues the library ships as examples. Anything else is the colour
 * input under them — the point of the picker is that one hue is three tokens,
 * not that there are eight approved answers.
 */
const HUES = [
  { name: "Blurple", value: "#5865f2" },
  { name: "Violet", value: "#7a5af8" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Teal", value: "#1abc9c" },
  { name: "Emerald", value: "#23a55a" },
  { name: "Amber", value: "#f0b232" },
  { name: "Ember", value: "#e8590c" },
  { name: "Rose", value: "#eb459e" },
] as const

const LABELS = {
  radius: {
    none: "Square",
    sm: "Tight",
    md: "Default",
    lg: "Round",
    xl: "Soft",
  },
  font: {
    inter: "Inter",
    system: "System",
    serif: "Serif",
    rounded: "Rounded",
    "mono-first": "Mono",
  },
  neutral: { slate: "Slate", neutral: "Neutral", stone: "Stone", ink: "Ink" },
  shadow: { soft: "Soft", flat: "Flat", deep: "Deep" },
  mode: { dark: "Dark", light: "Light" },
  direction: { ltr: "Left to right", rtl: "Right to left" },
} as const

/* What each choice looks like, small enough to sit at the end of a row. */
const RADIUS_CORNERS = {
  none: "0",
  sm: "2px",
  md: "5px",
  lg: "9px",
  xl: "14px",
} as const satisfies Record<PresetRadius, string>

const FONT_SAMPLES = {
  inter: '"Inter", sans-serif',
  system: "system-ui, sans-serif",
  serif: '"Iowan Old Style", Palatino, Georgia, serif',
  rounded: 'ui-rounded, "SF Pro Rounded", Quicksand, system-ui, sans-serif',
  "mono-first": '"JetBrains Mono", ui-monospace, monospace',
} as const satisfies Record<PresetFont, string>

/*
 * The dark `--newt-bg-elevated` of each neutral: the one surface that tells
 * the four apart at the size of a swatch. `slate` is the shipped token.
 */
const NEUTRAL_SWATCHES = {
  slate: "#313338",
  neutral: "#2e2e2e",
  stone: "#33302d",
  ink: "#17181c",
} as const satisfies Record<PresetNeutral, string>

const SHADOW_SAMPLES = {
  soft: "0 2px 4px rgba(0, 0, 0, 0.35)",
  flat: "0 0 0 1px var(--newt-border)",
  deep: "0 5px 10px rgba(0, 0, 0, 0.7)",
} as const satisfies Record<PresetShadow, string>

function Swatch({ color }: { readonly color: string }) {
  return <span className="theme-swatch" style={{ background: color }} />
}

/** A neutral is nearly the panel's own colour, so its swatch is outlined. */
function NeutralSwatch({ neutral }: { readonly neutral: PresetNeutral }) {
  return (
    <span
      className="theme-swatch theme-swatch-ring"
      style={{ background: NEUTRAL_SWATCHES[neutral] }}
    />
  )
}

function FontSample({ font }: { readonly font: PresetFont }) {
  return (
    <span className="picker-sample" style={{ fontFamily: FONT_SAMPLES[font] }}>
      Aa
    </span>
  )
}

const FRAMEWORK_OPTIONS = INSTALL_TARGETS.map((target) => ({
  value: target.id,
  label: target.title,
  mark: <FrameworkGlyph id={target.id} />,
}))

const HUE_OPTIONS: readonly PickerOption<string>[] = HUES.map((hue) => ({
  value: hue.value,
  label: hue.name,
  mark: <Swatch color={hue.value} />,
}))

const NEUTRAL_OPTIONS = PRESET_NEUTRALS.map((neutral) => ({
  value: neutral,
  label: LABELS.neutral[neutral],
  mark: <NeutralSwatch neutral={neutral} />,
}))

const RADIUS_OPTIONS = PRESET_RADII.map((radius) => ({
  value: radius,
  label: LABELS.radius[radius],
  mark: (
    <span
      className="picker-corner"
      style={{ borderStartStartRadius: RADIUS_CORNERS[radius] }}
    />
  ),
}))

const FONT_OPTIONS = PRESET_FONTS.map((font) => ({
  value: font,
  label: LABELS.font[font],
  mark: <FontSample font={font} />,
}))

const HEADING_OPTIONS = PRESET_HEADINGS.map((heading) => ({
  value: heading,
  label: heading === "same" ? "Same as body" : LABELS.font[heading],
  mark:
    heading === "same" ? (
      <span className="picker-sample">=</span>
    ) : (
      <FontSample font={heading} />
    ),
}))

const SHADOW_OPTIONS = PRESET_SHADOWS.map((shadow) => ({
  value: shadow,
  label: LABELS.shadow[shadow],
  mark: (
    <span
      className="picker-shadow"
      style={{ boxShadow: SHADOW_SAMPLES[shadow] }}
    />
  ),
}))

const MODE_OPTIONS = PRESET_MODES.map((mode) => ({
  value: mode,
  label: LABELS.mode[mode],
  mark: <span className="picker-mode" data-mode={mode} />,
}))

const DIRECTION_OPTIONS = PRESET_DIRECTIONS.map((direction) => ({
  value: direction,
  label: LABELS.direction[direction],
  mark: <span className="picker-sample">{direction.toUpperCase()}</span>,
}))

/** The canvas lives in the Astro page; this island only drives it. */
const PREVIEW_SELECTOR = "[data-create-preview]"

/* Only ever called from an effect, so `window` is there by construction. */
function readLocation(): Preset {
  const code = new URLSearchParams(window.location.search).get("p")
  if (code === null) return DEFAULT_PRESET
  try {
    return decodePreset(code)
  } catch {
    /* A shared link that no longer decodes should still open the builder. */
    return DEFAULT_PRESET
  }
}

function pick<T>(options: readonly T[], current: T): T {
  const others = options.filter((option) => option !== current)
  return others[Math.floor(Math.random() * others.length)] ?? current
}

/** Everything that is a matter of taste; the target and the direction are not. */
function shuffled(preset: Preset): Preset {
  return {
    ...preset,
    b: pick(
      HUES.map((hue) => hue.value),
      preset.b
    ),
    n: pick(PRESET_NEUTRALS, preset.n),
    r: pick(PRESET_RADII, preset.r),
    f: pick(PRESET_FONTS, preset.f),
    h: pick(PRESET_HEADINGS, preset.h),
    s: pick(PRESET_SHADOWS, preset.s),
  }
}

/**
 * A pasted code, or a whole builder link, or the `--preset nt1.…` flag as it
 * was copied from a terminal: whichever it is, the code is the `nt1.` token.
 */
function extractCode(input: string): string {
  return input.match(/nt\d+\.[\w-]+/)?.[0] ?? input.trim()
}

/* A shortcut is a bare letter, so it must not fire while someone is typing. */
function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

/*
 * A dialog on the page owns the keyboard while focus is in it. The canvas draws
 * a Modal demo of its own, so "a modal exists" cannot be the test (it always
 * does); "focus is inside one" is.
 */
function inDialog(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('dialog, [role="dialog"], [role="alertdialog"]') !== null
  )
}

interface MenuAction {
  readonly label: string
  readonly keys: string
  readonly run: () => void
  /** Drawn under a rule: the one action that throws work away. */
  readonly separated?: boolean
}

/** Where an arrow key, Home or End moves focus in a menu; `undefined` for any other key. */
function menuTarget(key: string, at: number, last: number): number | undefined {
  switch (key) {
    case "ArrowDown":
      return at >= last ? 0 : at + 1
    case "ArrowUp":
      return at <= 0 ? last : at - 1
    case "Home":
      return 0
    case "End":
      return last
    default:
      return undefined
  }
}

/**
 * The builder's own menu: the actions that act on the preset as a whole, each
 * with the key that does the same from anywhere on the page.
 */
function Menu({ actions }: { readonly actions: readonly MenuAction[] }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const popup = useRef<HTMLDivElement>(null)

  /* The items, in the order the arrow keys walk them. */
  const items = () =>
    Array.from(
      popup.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ??
        []
    )

  /* Closing from the keyboard hands focus back, so the reader keeps their place. */
  const close = (restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) trigger.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    /* Opening moves focus into the menu, to its first action. */
    items()[0]?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div className="create-menu" ref={root} data-open={open}>
      <button
        type="button"
        className="create-menu-trigger"
        ref={trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        Menu
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 9h14M5 15h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div
          className="create-menu-popup"
          role="menu"
          ref={popup}
          onKeyDown={(event) => {
            const all = items()
            const at = all.findIndex((item) => item === document.activeElement)
            const last = all.length - 1
            const target = menuTarget(event.key, at, last)
            if (target !== undefined) {
              event.preventDefault()
              all[target]?.focus()
            } else if (event.key === "Tab") {
              close(false)
            }
          }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className="create-menu-item"
              data-separated={action.separated}
              onClick={() => {
                close(true)
                action.run()
              }}
            >
              {action.label}
              <kbd>{action.keys}</kbd>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Group({
  label,
  children,
}: {
  readonly label: string
  readonly children: ReactNode
}) {
  return (
    <section className="create-group" aria-label={label}>
      {children}
    </section>
  )
}

/**
 * newt/create. Nine choices, a canvas of real components that follows them,
 * and a code the CLI can read back — the whole point being that the answer
 * leaves this page as a command rather than as a stylesheet the reader has to
 * keep in step.
 *
 * The URL is the only persistence: a preset worth keeping is a preset worth
 * sending to someone, and `localStorage` cannot be sent.
 */
export default function CreateApp() {
  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET)
  const [draft, setDraft] = useState("")
  const [draftError, setDraftError] = useState<string>()
  const createDialog = useRef<HTMLDialogElement>(null)
  const openDialog = useRef<HTMLDialogElement>(null)
  /* What the last preset wrote on the canvas, so this one can take it back. */
  const written = useRef<readonly string[]>([])

  /* Hydration renders the defaults; the shared link is read straight after. */
  useEffect(() => setPreset(readLocation()), [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("p", encodePreset(preset))
    window.history.replaceState(null, "", url)

    const preview = document.querySelector<HTMLElement>(PREVIEW_SELECTOR)
    if (preview === null) return
    const variables = presetVariables(preset)
    const names = variables.map((variable) => variable.property)
    /* An axis back at its default writes nothing, so its old value must go. */
    for (const property of written.current) {
      if (!names.includes(property)) preview.style.removeProperty(property)
    }
    for (const { property, value } of variables) {
      preview.style.setProperty(property, value)
    }
    written.current = names
    preview.dir = preset.d
    preview.dataset.newtTheme = preset.m
  }, [preset])

  const showOpenDialog = () => {
    setDraft("")
    setDraftError(undefined)
    openDialog.current?.showModal()
  }

  const actions: readonly MenuAction[] = [
    { label: "Shuffle", keys: "R", run: () => setPreset(shuffled) },
    {
      label: "Light / dark",
      keys: "D",
      run: () =>
        setPreset((current) => ({
          ...current,
          m: current.m === "dark" ? "light" : "dark",
        })),
    },
    {
      label: "Flip direction",
      keys: "F",
      run: () =>
        setPreset((current) => ({
          ...current,
          d: current.d === "ltr" ? "rtl" : "ltr",
        })),
    },
    { label: "Open preset…", keys: "O", run: showOpenDialog },
    {
      label: "Create project…",
      keys: "↵",
      run: () => createDialog.current?.showModal(),
    },
    {
      label: "Reset",
      keys: "⇧R",
      run: () => setPreset(DEFAULT_PRESET),
      separated: true,
    },
  ]

  /*
   * The same actions from the keyboard. Read through a ref so the listener is
   * bound once and still calls the handlers of the latest render.
   */
  const latest = useRef(actions)
  latest.current = actions
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (
        isTyping(event.target) ||
        inDialog(event.target) ||
        document.querySelector("dialog[open]")
      ) {
        return
      }
      const key = event.key.toLowerCase()
      const wanted =
        key === "enter"
          ? "↵"
          : `${event.shiftKey ? "⇧" : ""}${key.toUpperCase()}`
      /* Enter on a focused control is that control's; only a bare one creates. */
      if (key === "enter" && event.target !== document.body) return
      const action = latest.current.find((entry) => entry.keys === wanted)
      if (action === undefined) return
      event.preventDefault()
      action.run()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const code = encodePreset(preset)

  return (
    <aside className="create-panel" aria-label="Customize">
      <header className="create-panel-head">
        <h1>newt/create</h1>
        <Menu actions={actions} />
        <p>
          Nine choices, one code. Paste it into <code>init</code> and the
          project comes out already wearing it.
        </p>
      </header>

      <div className="create-pickers">
        <Group label="Project">
          <Picker
            label="Framework"
            options={FRAMEWORK_OPTIONS}
            value={preset.t}
            onChange={(t) => setPreset({ ...preset, t })}
          />
        </Group>

        <Group label="Colour">
          <Picker
            label="Base colour"
            options={NEUTRAL_OPTIONS}
            value={preset.n}
            onChange={(n) => setPreset({ ...preset, n })}
          />
          <Picker
            label="Brand"
            options={HUE_OPTIONS}
            value={preset.b}
            mark={<Swatch color={preset.b} />}
            onChange={(b) => setPreset({ ...preset, b })}
          >
            <label className="theme-custom">
              <span>Custom</span>
              <input
                type="color"
                value={preset.b}
                onChange={(event) =>
                  setPreset({ ...preset, b: event.target.value })
                }
              />
            </label>
          </Picker>
          <Picker
            label="Surfaces"
            options={MODE_OPTIONS}
            value={preset.m}
            onChange={(m) => setPreset({ ...preset, m })}
          />
        </Group>

        <Group label="Type">
          <Picker
            label="Heading"
            options={HEADING_OPTIONS}
            value={preset.h}
            onChange={(h) => setPreset({ ...preset, h })}
          />
          <Picker
            label="Font"
            options={FONT_OPTIONS}
            value={preset.f}
            onChange={(f) => setPreset({ ...preset, f })}
          />
        </Group>

        <Group label="Shape">
          <Picker
            label="Radius"
            options={RADIUS_OPTIONS}
            value={preset.r}
            onChange={(r) => setPreset({ ...preset, r })}
          />
          <Picker
            label="Shadows"
            options={SHADOW_OPTIONS}
            value={preset.s}
            onChange={(s) => setPreset({ ...preset, s })}
          />
          <Picker
            label="Direction"
            options={DIRECTION_OPTIONS}
            value={preset.d}
            onChange={(d) => setPreset({ ...preset, d })}
          />
        </Group>
      </div>

      <footer className="create-panel-foot">
        <div className="create-preset">
          <code>--preset {code}</code>
          <CopyButton value={code} label="Copy" />
        </div>
        <div className="create-panel-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={showOpenDialog}
          >
            Open preset
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setPreset(shuffled)}
          >
            Shuffle
          </button>
        </div>
        <button
          type="button"
          className="button-primary create-submit"
          onClick={() => createDialog.current?.showModal()}
        >
          Create project
        </button>
      </footer>

      <dialog
        ref={createDialog}
        className="create-dialog"
        aria-labelledby="create-dialog-title"
        onClick={(event) => {
          /* The backdrop is the dialog element itself; its content is not. */
          if (event.target === createDialog.current)
            createDialog.current.close()
        }}
      >
        <div className="create-dialog-body">
          <div className="create-output-row">
            <h2 id="create-dialog-title">Create project</h2>
            <button
              type="button"
              className="create-copy"
              onClick={() => createDialog.current?.close()}
            >
              Close
            </button>
          </div>
          <PresetOutput preset={preset} />
        </div>
      </dialog>

      <dialog
        ref={openDialog}
        className="create-dialog create-dialog-open"
        aria-labelledby="open-dialog-title"
        onClick={(event) => {
          if (event.target === openDialog.current) openDialog.current.close()
        }}
      >
        <form
          className="create-dialog-body"
          onSubmit={(event) => {
            event.preventDefault()
            try {
              setPreset(decodePreset(extractCode(draft)))
              openDialog.current?.close()
            } catch (error) {
              setDraftError(
                error instanceof PresetError
                  ? error.message
                  : "That is not a preset code."
              )
            }
          }}
        >
          <div className="create-output-row">
            <h2 id="open-dialog-title">Open preset</h2>
            <button
              type="button"
              className="create-copy"
              onClick={() => openDialog.current?.close()}
            >
              Close
            </button>
          </div>
          <label className="create-open-field">
            <span>
              Paste a preset code, a <code>--preset</code> flag or a builder
              link.
            </span>
            <input
              type="text"
              value={draft}
              placeholder="nt1.…"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={draftError !== undefined}
              aria-describedby={
                draftError === undefined ? undefined : "open-dialog-error"
              }
              onChange={(event) => {
                setDraft(event.target.value)
                setDraftError(undefined)
              }}
            />
          </label>
          {draftError !== undefined && (
            <p
              className="create-open-error"
              id="open-dialog-error"
              role="alert"
            >
              {draftError}
            </p>
          )}
          <button type="submit" className="button-primary create-submit">
            Open
          </button>
        </form>
      </dialog>
    </aside>
  )
}
