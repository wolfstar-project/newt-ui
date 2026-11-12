import { useEffect, useRef, useState } from "react"

import { INSTALL_TARGETS } from "@/lib/install-targets"
import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
  presetVariables,
  PRESET_DIRECTIONS,
  PRESET_FONTS,
  PRESET_MODES,
  PRESET_RADII,
  type Preset,
  type PresetFont,
  type PresetRadius,
} from "@/lib/preset"

import FrameworkGlyph from "./FrameworkGlyph"
import Picker, { type PickerOption } from "./Picker"
import PresetOutput, { CopyButton } from "./PresetOutput"

/*
 * The brand hues the library ships as examples. Anything else is the colour
 * input under them — the point of the picker is that one hue is three tokens,
 * not that there are five approved answers.
 */
const HUES = [
  { name: "Blurple", value: "#5865f2" },
  { name: "Violet", value: "#7a5af8" },
  { name: "Teal", value: "#1abc9c" },
  { name: "Amber", value: "#f0b232" },
  { name: "Rose", value: "#eb459e" },
] as const

const LABELS = {
  radius: { sm: "Tight", md: "Default", lg: "Round" },
  font: { inter: "Inter", system: "System", "mono-first": "Mono" },
  mode: { dark: "Dark", light: "Light" },
  direction: { ltr: "Left to right", rtl: "Right to left" },
} as const

/* What each choice looks like, small enough to sit at the end of a row. */
const RADIUS_CORNERS = {
  sm: "2px",
  md: "5px",
  lg: "9px",
} as const satisfies Record<PresetRadius, string>

const FONT_SAMPLES = {
  inter: '"Inter", sans-serif',
  system: "system-ui, sans-serif",
  "mono-first": '"JetBrains Mono", ui-monospace, monospace',
} as const satisfies Record<PresetFont, string>

function Swatch({ color }: { readonly color: string }) {
  return <span className="theme-swatch" style={{ background: color }} />
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
  mark: (
    <span className="picker-sample" style={{ fontFamily: FONT_SAMPLES[font] }}>
      Aa
    </span>
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

/**
 * newt/create. Six choices, a canvas of real components that follows them,
 * and a code the CLI can read back — the whole point being that the answer
 * leaves this page as a command rather than as a stylesheet the reader has to
 * keep in step.
 *
 * The URL is the only persistence: a preset worth keeping is a preset worth
 * sending to someone, and `localStorage` cannot be sent.
 */
export default function CreateApp() {
  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET)
  const dialog = useRef<HTMLDialogElement>(null)

  /* Hydration renders the defaults; the shared link is read straight after. */
  useEffect(() => setPreset(readLocation()), [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("p", encodePreset(preset))
    window.history.replaceState(null, "", url)

    const preview = document.querySelector<HTMLElement>(PREVIEW_SELECTOR)
    if (preview === null) return
    for (const { property, value } of presetVariables(preset)) {
      preview.style.setProperty(property, value)
    }
    preview.dir = preset.d
    preview.dataset.newtTheme = preset.m
  }, [preset])

  const code = encodePreset(preset)

  return (
    <aside className="create-panel" aria-label="Customize">
      <header className="create-panel-head">
        <h1>newt/create</h1>
        <p>
          Six choices, one code. Paste it into <code>init</code> and the project
          comes out already wearing it.
        </p>
      </header>

      <div className="create-pickers">
        <Picker
          label="Framework"
          options={FRAMEWORK_OPTIONS}
          value={preset.t}
          onChange={(t) => setPreset({ ...preset, t })}
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
          label="Radius"
          options={RADIUS_OPTIONS}
          value={preset.r}
          onChange={(r) => setPreset({ ...preset, r })}
        />
        <Picker
          label="Font"
          options={FONT_OPTIONS}
          value={preset.f}
          onChange={(f) => setPreset({ ...preset, f })}
        />
        <Picker
          label="Surfaces"
          options={MODE_OPTIONS}
          value={preset.m}
          onChange={(m) => setPreset({ ...preset, m })}
        />
        <Picker
          label="Direction"
          options={DIRECTION_OPTIONS}
          value={preset.d}
          onChange={(d) => setPreset({ ...preset, d })}
        />
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
            onClick={() =>
              setPreset({
                ...preset,
                b: pick(
                  HUES.map((hue) => hue.value),
                  preset.b
                ),
                r: pick(PRESET_RADII, preset.r),
                f: pick(PRESET_FONTS, preset.f),
              })
            }
          >
            Shuffle
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setPreset(DEFAULT_PRESET)}
          >
            Reset
          </button>
        </div>
        <button
          type="button"
          className="button-primary create-submit"
          onClick={() => dialog.current?.showModal()}
        >
          Create project
        </button>
      </footer>

      <dialog
        ref={dialog}
        className="create-dialog"
        aria-labelledby="create-dialog-title"
        onClick={(event) => {
          /* The backdrop is the dialog element itself; its content is not. */
          if (event.target === dialog.current) dialog.current.close()
        }}
      >
        <div className="create-dialog-body">
          <div className="create-output-row">
            <h2 id="create-dialog-title">Create project</h2>
            <button
              type="button"
              className="create-copy"
              onClick={() => dialog.current?.close()}
            >
              Close
            </button>
          </div>
          <PresetOutput preset={preset} />
        </div>
      </dialog>
    </aside>
  )
}
