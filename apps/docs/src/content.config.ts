import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

/*
 * Two collections, both MDX. `docs` ids are the path without the extension —
 * `index`, `installation`, `components/button` — which is also the URL after
 * `/docs/`, so routing, the `.md` twin and `llms.txt` all share one key.
 */
const docs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Component pages get the registry-driven chrome. */
    component: z.boolean().default(false),
    new: z.boolean().default(false),
    updated: z.boolean().default(false),
    links: z
      .object({
        doc: z.url().optional(),
        api: z.url().optional(),
      })
      .optional(),
    toc: z.boolean().default(true),
    pager: z.boolean().default(true),
  }),
})

const changelog = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
})

export const collections = { docs, changelog }
