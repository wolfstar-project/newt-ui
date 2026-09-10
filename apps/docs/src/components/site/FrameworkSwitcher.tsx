import { useStore } from "@nanostores/react"
import type { ReactElement } from "react"

import { $framework, FRAMEWORKS, type Framework } from "@/stores/framework"

/*
 * The one control that decides what the whole site shows: demos, code tabs,
 * install paths and usage snippets all key off this store. It is an island
 * rather than an inline script because it has to re-render its own pressed
 * state, and the two marks are the only colours the palette does not own — a
 * framework is recognised by its hue before it is read as a word.
 */
const MARKS = {
  react: (
    <svg
      viewBox="0 0 24 24"
      className="framework-mark framework-mark-react"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10.5" ry="4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(120 12 12)"
        />
      </g>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  ),
  vue: (
    <svg
      viewBox="0 0 24 24"
      className="framework-mark framework-mark-vue"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      >
        <path d="M1.5 4.5 12 21 22.5 4.5" />
        <path d="M8 4.5 12 10.5 16 4.5" />
      </g>
    </svg>
  ),
} satisfies Record<Framework, ReactElement>

const LABELS = { react: "React", vue: "Vue" } satisfies Record<
  Framework,
  string
>

export default function FrameworkSwitcher() {
  // Other islands may restore Vue from storage before this island hydrates.
  // Match the server's initial React snapshot, then apply the current store.
  const active = useStore($framework, { ssr: "initial" })

  return (
    <fieldset className="segmented">
      <legend className="sr-only">Framework</legend>
      {FRAMEWORKS.map((framework) => (
        <button
          key={framework}
          type="button"
          className="segmented-option"
          aria-pressed={framework === active}
          onClick={() => $framework.set(framework)}
        >
          {MARKS[framework]}
          {LABELS[framework]}
        </button>
      ))}
    </fieldset>
  )
}
