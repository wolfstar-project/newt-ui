import { useEffect, useState } from "react"

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
} from "@/lib/preset"

import FrameworkGlyph from "./FrameworkGlyph"
import PresetOutput from "./PresetOutput"

/*
 * The brand hues the library ships as examples. Anything else is the colour
 * input beside them — the point of the picker is that one hue is three tokens,
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

/** The preview element lives in the Astro page; this island only drives it. */
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

function Segmented<T extends string>({
  legend,
  options,
  value,
  labels,
  onChange,
}: {
  readonly legend: string
  readonly options: readonly T[]
  readonly value: T
  readonly labels: Readonly<Record<T, string>>
  readonly onChange: (next: T) => void
}) {
  return (
    <fieldset className="create-field">
      <legend>{legend}</legend>
      <div className="segmented">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="segmented-option"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {labels[option]}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * newt/create. Six choices, a live preview of real components, and a code the
 * CLI can read back — the whole point being that the answer leaves this page
 * as a command rather than as a stylesheet the reader has to keep in step.
 *
 * The URL is the only persistence: a preset worth keeping is a preset worth
 * sending to someone, and `localStorage` cannot be sent.
 */
export default function CreateApp() {
  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET)

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

  return (
    <div className="create-panel">
      <fieldset className="create-field">
        <legend>Framework</legend>
        <div className="create-frameworks">
          {INSTALL_TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              className="create-framework"
              aria-pressed={target.id === preset.t}
              onClick={() => setPreset({ ...preset, t: target.id })}
            >
              <FrameworkGlyph id={target.id} />
              {target.title}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="create-field">
        <legend>Brand</legend>
        <div className="create-hues">
          {HUES.map((hue) => (
            <button
              key={hue.value}
              type="button"
              className="create-hue"
              aria-pressed={hue.value === preset.b}
              onClick={() => setPreset({ ...preset, b: hue.value })}
            >
              <span
                className="theme-swatch"
                style={{ background: hue.value }}
                aria-hidden="true"
              />
              {hue.name}
            </button>
          ))}
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
        </div>
      </fieldset>

      <Segmented
        legend="Radius"
        options={PRESET_RADII}
        value={preset.r}
        labels={LABELS.radius}
        onChange={(r) => setPreset({ ...preset, r })}
      />
      <Segmented
        legend="Font"
        options={PRESET_FONTS}
        value={preset.f}
        labels={LABELS.font}
        onChange={(f) => setPreset({ ...preset, f })}
      />
      <Segmented
        legend="Surfaces"
        options={PRESET_MODES}
        value={preset.m}
        labels={LABELS.mode}
        onChange={(m) => setPreset({ ...preset, m })}
      />
      <Segmented
        legend="Direction"
        options={PRESET_DIRECTIONS}
        value={preset.d}
        labels={LABELS.direction}
        onChange={(d) => setPreset({ ...preset, d })}
      />

      <button
        type="button"
        className="button-secondary create-reset"
        onClick={() => setPreset(DEFAULT_PRESET)}
      >
        Reset
      </button>

      <PresetOutput preset={preset} />
    </div>
  )
}
