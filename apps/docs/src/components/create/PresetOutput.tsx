import { useEffect, useState } from "react"

import {
  applyCommand,
  encodePreset,
  presetCommands,
  presetToCss,
  templateFor,
  type PackageManager,
  type Preset,
} from "@/lib/preset"

const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "pnpm",
  "npm",
  "yarn",
  "bun",
]

/* The key the site's command tabs already use, so one choice covers both. */
const PM_STORAGE_KEY = "newt-ui:tabs:pm"

function isPackageManager(value: string | null): value is PackageManager {
  return PACKAGE_MANAGERS.some((candidate) => candidate === value)
}

function CopyButton({
  value,
  label,
}: {
  readonly value: string
  readonly label: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      className="create-copy"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => setCopied(true))
      }}
    >
      {copied ? "Copied" : label}
    </button>
  )
}

/**
 * What the reader leaves with: the code, the commands that consume it, and a
 * link that restores the whole thing. The CSS block is folded away because it
 * is the answer to a different question — what if I do not use the CLI.
 */
export default function PresetOutput({ preset }: { readonly preset: Preset }) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm")
  const [showCss, setShowCss] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(PM_STORAGE_KEY)
    if (isPackageManager(stored)) setPackageManager(stored)
  }, [])

  useEffect(() => {
    if (!shareCopied) return
    const timer = setTimeout(() => setShareCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [shareCopied])

  const code = encodePreset(preset)
  const commands = presetCommands(preset, packageManager)
  const template = templateFor(preset)

  return (
    <section className="create-output" aria-label="What to run">
      <div className="create-output-row">
        <h2>Your preset</h2>
        <CopyButton value={code} label="Copy code" />
      </div>
      <p className="create-code">{code}</p>

      <fieldset className="segmented create-pm">
        <legend className="sr-only">Package manager</legend>
        {PACKAGE_MANAGERS.map((candidate) => (
          <button
            key={candidate}
            type="button"
            className="segmented-option"
            aria-pressed={candidate === packageManager}
            onClick={() => {
              setPackageManager(candidate)
              localStorage.setItem(PM_STORAGE_KEY, candidate)
            }}
          >
            {candidate}
          </button>
        ))}
      </fieldset>

      <ol className="create-commands">
        {commands.map((command) => (
          <li key={command}>
            <code>{command}</code>
            <CopyButton value={command} label="Copy" />
          </li>
        ))}
      </ol>

      <p className="create-note">
        {template === undefined
          ? "This framework has no scaffold template, so its own creator runs first and init runs inside the result."
          : "One command: it creates the project, writes the tokens, then the preset on top."}
      </p>

      <div className="create-output-row">
        <h3>Already have a project?</h3>
        <CopyButton value={applyCommand(preset, packageManager)} label="Copy" />
      </div>
      <p className="create-command-single">
        <code>{applyCommand(preset, packageManager)}</code>
      </p>

      <div className="create-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            void navigator.clipboard
              .writeText(window.location.href)
              .then(() => setShareCopied(true))
          }}
        >
          {shareCopied ? "Link copied" : "Copy link"}
        </button>
        <button
          type="button"
          className="button-secondary"
          aria-expanded={showCss}
          onClick={() => setShowCss(!showCss)}
        >
          {showCss ? "Hide the CSS" : "Show the CSS"}
        </button>
      </div>

      {showCss && (
        <div>
          <p className="create-note">
            The same overrides by hand, for a project the CLI does not run in.
            They belong after the token block.
          </p>
          <pre className="create-css">
            <code>{presetToCss(preset)}</code>
          </pre>
          <CopyButton value={presetToCss(preset)} label="Copy the CSS" />
        </div>
      )}
    </section>
  )
}
