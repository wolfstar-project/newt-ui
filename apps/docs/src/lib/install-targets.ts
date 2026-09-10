/*
 * Every way into the library, in the order the installation page offers them.
 * The picker grid, the sidebar group and the commands each path prints all
 * read this one list, so a new target is one entry and not four edits.
 */
export const FRAMEWORK_IDS = [
  "next",
  "vite-react",
  "vite-vue",
  "nuxt",
  "astro",
  "tanstack-start",
  "react-router",
  "laravel",
  "manual",
  "html",
] as const

export type FrameworkId = (typeof FRAMEWORK_IDS)[number]

/**
 * The four targets `init --template` can scaffold from nothing. The rest are
 * documented as existing projects: they are created by their own tool first,
 * and `init` runs inside the result.
 */
export const TEMPLATE_IDS = ["next", "vite-react", "vite-vue", "nuxt"] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]

export interface InstallTarget {
  readonly id: FrameworkId
  readonly title: string
  /** One line under the title in the picker. */
  readonly note: string
  readonly href: string
  /** Present when `init --template <id>` can create the project. */
  readonly template?: TemplateId
  /** The command that creates the project when there is no template. */
  readonly scaffold?: string
}

export const INSTALL_TARGETS: readonly InstallTarget[] = [
  {
    id: "next",
    title: "Next.js",
    note: "App Router, server components, app/globals.css.",
    href: "/docs/installation/next",
    template: "next",
  },
  {
    id: "vite-react",
    title: "Vite (React)",
    note: "React 19, Tailwind through the Vite plugin.",
    href: "/docs/installation/vite",
    template: "vite-react",
  },
  {
    id: "vite-vue",
    title: "Vite (Vue)",
    note: "Vue 3.5, Tailwind through the Vite plugin.",
    href: "/docs/installation/vite-vue",
    template: "vite-vue",
  },
  {
    id: "nuxt",
    title: "Nuxt",
    note: "Nuxt 4, with the module that auto-imports the components.",
    href: "/docs/installation/nuxt",
    template: "nuxt",
  },
  {
    id: "astro",
    title: "Astro",
    note: "React and Vue islands in the same site.",
    href: "/docs/installation/astro",
    scaffold: "create astro@latest",
  },
  {
    id: "tanstack-start",
    title: "TanStack Start",
    note: "Full-stack React on TanStack Router.",
    href: "/docs/installation/tanstack-start",
    scaffold: "create-tsrouter-app@latest",
  },
  {
    id: "react-router",
    title: "React Router",
    note: "Framework mode, tokens in the root stylesheet.",
    href: "/docs/installation/react-router",
    scaffold: "create-react-router@latest",
  },
  {
    id: "laravel",
    title: "Laravel",
    note: "Inertia, with the React or the Vue starter kit.",
    href: "/docs/installation/laravel",
    scaffold: "laravel new",
  },
  {
    id: "manual",
    title: "Manual",
    note: "Copy the source yourself. No CLI, no config file.",
    href: "/docs/installation/manual",
  },
  {
    id: "html",
    title: "HTML & CSS",
    note: "Two stylesheets and a class name. No build step.",
    href: "/docs/html-css",
  },
]

export function findInstallTarget(id: FrameworkId): InstallTarget {
  const target = INSTALL_TARGETS.find((entry) => entry.id === id)
  if (target === undefined) {
    throw new Error(`No install target named "${id}".`)
  }
  return target
}
