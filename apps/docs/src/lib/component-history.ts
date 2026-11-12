import { z } from "zod"

import snapshot from "../data/component-history.json"
import { SITE } from "./site"

/*
 * What changed in each registry item, newest first: the commits that touched
 * its sources in any of the three flavours. The data is a committed snapshot
 * written by `scripts/sync-history.mjs` — the hosts that build the site clone
 * one commit deep, so git cannot be asked during the build.
 */
const changeSchema = z.object({
  hash: z.string(),
  /** `YYYY-MM-DD`, the day the commit landed. */
  date: z.string(),
  /** The Conventional Commits type: `feat`, `fix`, … */
  type: z.string(),
  subject: z.string(),
  pr: z.number().optional(),
})

export type ComponentChange = z.infer<typeof changeSchema>

const HISTORY = z.record(z.string(), z.array(changeSchema)).parse(snapshot)

/** A registry item's recent changes; empty for one the snapshot predates. */
export function componentHistory(name: string): readonly ComponentChange[] {
  return HISTORY[name] ?? []
}

/** The pull request when the commit names one, the commit otherwise. */
export function changeUrl(change: ComponentChange): string {
  return change.pr === undefined
    ? `${SITE.github}/commit/${change.hash}`
    : `${SITE.github}/pull/${change.pr}`
}
