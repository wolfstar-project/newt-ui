import { z } from "zod"

export const registryItemTypeSchema = z.enum([
  "registry:style",
  "registry:lib",
  "registry:example",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
])

export const registryItemFileSchema = z.union([
  z.string(),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema,
    target: z.string().optional(),
  }),
])

/**
 * Tailwind v3 only. Consumers on v4 get the same values through
 * `cssVars.theme`, which maps to an `@theme` block instead of a JS config.
 */
export const registryItemTailwindSchema = z.object({
  config: z
    .object({
      content: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      plugins: z.array(z.string()).optional(),
    })
    .optional(),
})

/**
 * `theme` holds Tailwind v4 `@theme` entries (`--color-*`, `--radius-*`, …);
 * `light`/`dark` hold plain custom properties written into the matching
 * selector. Both are emitted for every item so a single registry serves
 * Tailwind v3 and v4 projects.
 */
export const registryItemCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

/**
 * Raw CSS keyed by at-rule or selector — `@layer base`, `@layer components`,
 * `@utility …`, `@keyframes …`. Tailwind v4 consumers get these appended to
 * their stylesheet; v3 consumers get the same rules wrapped by the CLI.
 */
export const registryItemCssSchema = z.record(
  z.string(),
  z.union([z.string(), z.record(z.string(), z.any())])
)

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  tailwind: registryItemTailwindSchema.optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  css: registryItemCssSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>
export type RegistryItemType = z.infer<typeof registryItemTypeSchema>

export const registrySchema = z.array(registryItemSchema)
export type Registry = z.infer<typeof registrySchema>

export const registryIndexSchema = z.array(
  registryItemSchema.extend({ files: z.array(z.string()).optional() })
)
export type RegistryIndex = z.infer<typeof registryIndexSchema>
