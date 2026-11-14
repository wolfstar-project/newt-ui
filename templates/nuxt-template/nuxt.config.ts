import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  future: { compatibilityVersion: 4 },
  // `newtui add` writes an index.ts barrel into each component folder. Nuxt
  // would read it as a second component with the same name (NUXT_B3011).
  // The first two entries are the directories Nuxt scans by default.
  components: [
    { path: "~/components/islands", island: true },
    { path: "~/components/global", global: true },
    { path: "~/components", ignore: ["ui/**/index.ts"] },
  ],
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  app: {
    head: {
      title: "newt/ui — Nuxt template",
      htmlAttrs: { lang: "en", class: "dark" },
    },
  },
})
