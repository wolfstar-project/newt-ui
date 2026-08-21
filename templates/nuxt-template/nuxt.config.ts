import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  future: { compatibilityVersion: 4 },
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
