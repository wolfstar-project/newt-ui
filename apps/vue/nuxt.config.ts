import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",

  future: { compatibilityVersion: 4 },

  modules: [],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: { strict: true, typeCheck: false },

  app: {
    head: {
      title: "newt/ui — Vue",
      htmlAttrs: { lang: "en", class: "dark" },
      bodyAttrs: { class: "newt-root" },
    },
  },

  $development: {
    devtools: { enabled: true },
  },

  $test: {
    ssr: true,
    devtools: { enabled: false },
  },
})
