import { useEffect, useState } from "react"

import {
  DEFAULT_TYPESET,
  FONT_CHOICES,
  FONT_STACKS,
  MEASURES,
  matchesPreset,
  NO_LOCKS,
  parseTypeset,
  RHYTHM_RANGES,
  shuffleTypeset,
  TYPESET_PRESETS,
  typesetCss,
  typesetSearch,
  typesetSnippet,
  withPreset,
  type FontChoice,
  type SnippetFlavour,
  type TypesetLocks,
  type TypesetParams,
} from "@/lib/typeset"

import TypesetPreview, {
  SURFACE_LABELS,
  SURFACES,
  type Surface,
} from "./TypesetPreview"

const RHYTHM_LABELS = {
  size: "Size",
  leading: "Leading",
  flow: "Flow",
} as const

const FLAVOUR_LABELS = {
  react: "React",
  vue: "Vue",
  html: "HTML",
} as const

const FLAVOURS: readonly SnippetFlavour[] = ["react", "vue", "html"]

const MEASURE_LABELS = {
  none: "Off",
  "55ch": "55ch",
  "68ch": "68ch",
  "80ch": "80ch",
} as const

function LockButton({
  locked,
  label,
  onToggle,
}: {
  readonly locked: boolean
  readonly label: string
  readonly onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="typeset-lock"
      aria-pressed={locked}
      onClick={onToggle}
    >
      <span className="sr-only">
        {locked ? `Unlock ${label}` : `Lock ${label}`}
      </span>
      <span aria-hidden="true">{locked ? "🔒" : "🔓"}</span>
    </button>
  )
}

/**
 * The Typeset builder. Three numbers and three fonts, a lock beside each so a
 * shuffle keeps the half that was already right, and a preview of the four
 * surfaces this library actually renders markdown into.
 */
export default function TypesetApp() {
  const [params, setParams] = useState<TypesetParams>(DEFAULT_TYPESET)
  const [locks, setLocks] = useState<TypesetLocks>(NO_LOCKS)
  const [surface, setSurface] = useState<Surface>("article")
  const [flavour, setFlavour] = useState<SnippetFlavour>("react")
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  /* Hydration renders the defaults; a shared link is read straight after. */
  useEffect(() => setParams(parseTypeset(window.location.search)), [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.search = typesetSearch(params)
    window.history.replaceState(null, "", url)
  }, [params])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const custom = !matchesPreset(params)
  const css = typesetCss(params)
  const snippet = typesetSnippet(flavour, params)

  const toggleLock = (key: keyof TypesetLocks) =>
    setLocks({ ...locks, [key]: !locks[key] })

  return (
    <div className="typeset-app">
      <div className="typeset-controls">
        <fieldset className="create-field">
          <legend>Preset</legend>
          <div className="segmented">
            {TYPESET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="segmented-option"
                aria-pressed={preset === params.preset}
                onClick={() => setParams(withPreset(params, preset))}
              >
                {preset}
              </button>
            ))}
          </div>
          {custom && (
            <p className="create-note">
              The numbers no longer match <code>typeset-{params.preset}</code>;
              Get code prints them as a class of their own.
            </p>
          )}
        </fieldset>

        {(["body", "heading", "mono"] as const).map((slot) => (
          <fieldset key={slot} className="create-field typeset-row">
            <legend>{slot === "mono" ? "Mono" : `${slot} font`}</legend>
            <select
              value={params[slot]}
              onChange={(event) => {
                const next = FONT_CHOICES.find(
                  (choice: FontChoice) => choice === event.target.value
                )
                if (next !== undefined) setParams({ ...params, [slot]: next })
              }}
            >
              {FONT_CHOICES.map((choice) => (
                <option key={choice} value={choice}>
                  {FONT_STACKS[choice].label}
                </option>
              ))}
            </select>
            <LockButton
              locked={locks[slot]}
              label={slot}
              onToggle={() => toggleLock(slot)}
            />
          </fieldset>
        ))}

        {(["size", "leading", "flow"] as const).map((key) => (
          <fieldset key={key} className="create-field typeset-row">
            <legend>
              {RHYTHM_LABELS[key]}{" "}
              <span className="typeset-value">
                {params[key]}
                {RHYTHM_RANGES[key].unit}
              </span>
            </legend>
            <input
              type="range"
              min={RHYTHM_RANGES[key].min}
              max={RHYTHM_RANGES[key].max}
              step={RHYTHM_RANGES[key].step}
              value={params[key]}
              aria-valuetext={`${params[key]}${RHYTHM_RANGES[key].unit}`}
              onChange={(event) =>
                setParams({ ...params, [key]: Number(event.target.value) })
              }
            />
            <LockButton
              locked={locks[key]}
              label={RHYTHM_LABELS[key]}
              onToggle={() => toggleLock(key)}
            />
          </fieldset>
        ))}

        <fieldset className="create-field">
          <legend>Measure</legend>
          <div className="segmented">
            {MEASURES.map((measure) => (
              <button
                key={measure}
                type="button"
                className="segmented-option"
                aria-pressed={measure === params.measure}
                onClick={() => setParams({ ...params, measure })}
              >
                {MEASURE_LABELS[measure]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="create-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => setParams(shuffleTypeset(params, locks))}
          >
            Shuffle
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              setParams(DEFAULT_TYPESET)
              setLocks(NO_LOCKS)
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="button-secondary"
            aria-expanded={showCode}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? "Hide code" : "Get code"}
          </button>
          <a
            className="button-secondary"
            href={`/typeset/preview?${typesetSearch(params)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in a new tab
          </a>
        </div>

        {showCode && (
          <section className="typeset-code" aria-label="What to copy">
            <p className="create-note">
              The stylesheet comes from the registry; only the overrides are
              yours to paste.
            </p>
            <pre className="create-css">
              <code>npx newtui@latest add typeset</code>
            </pre>

            {custom && (
              <pre className="create-css">
                <code>{css}</code>
              </pre>
            )}

            <div className="segmented">
              {FLAVOURS.map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  className="segmented-option"
                  aria-pressed={candidate === flavour}
                  onClick={() => setFlavour(candidate)}
                >
                  {FLAVOUR_LABELS[candidate]}
                </button>
              ))}
            </div>
            <pre className="create-css">
              <code>{snippet}</code>
            </pre>

            <button
              type="button"
              className="create-copy"
              onClick={() => {
                void navigator.clipboard
                  .writeText(custom ? `${css}\n${snippet}` : snippet)
                  .then(() => setCopied(true))
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </section>
        )}
      </div>

      <div className="typeset-stage">
        <fieldset className="create-field">
          <legend>Preview</legend>
          <div className="segmented">
            {SURFACES.map((candidate) => (
              <button
                key={candidate}
                type="button"
                className="segmented-option"
                aria-pressed={candidate === surface}
                onClick={() => setSurface(candidate)}
              >
                {SURFACE_LABELS[candidate]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="typeset-surface newt-root">
          <TypesetPreview params={params} surface={surface} />
        </div>
      </div>
    </div>
  )
}
