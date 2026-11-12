import { z } from "zod"

import snapshot from "../data/directory.json"

/*
 * The community registries `newtui add @registry/item` resolves without any
 * configuration: shadcn/ui's directory for a React project, shadcn-vue's for
 * a Vue one. The data is a committed snapshot written by
 * `scripts/sync-directory.mjs`; the CLI itself reads the live indexes.
 */
const entrySchema = z.object({
  name: z.string(),
  url: z.string(),
  homepage: z.string(),
  description: z.string().optional(),
})

export type DirectoryEntry = z.infer<typeof entrySchema>

export const DIRECTORY = z
  .object({ react: z.array(entrySchema), vue: z.array(entrySchema) })
  .parse(snapshot)

export const DIRECTORY_SOURCES = {
  react: { label: "React", site: "https://ui.shadcn.com/docs/directory" },
  vue: { label: "Vue", site: "https://www.shadcn-vue.com/docs/directory" },
} as const
