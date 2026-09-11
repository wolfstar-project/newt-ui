/*
 * The PWA plugin serves its data through virtual modules, which exist only
 * once Vite is running. These references are what tells the type checker they
 * are real, and what they hold.
 */
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="vite-plugin-pwa/client" />

/*
 * Spike: Lotus declares `App.Locals.t` in the package's own `src/virtual.d.ts`,
 * which is not reachable through the exports map, so the site has to declare it
 * itself. `LotusTranslate` is not exported either.
 */
declare namespace App {
  interface Locals {
    t: ((key: string, values?: Record<string, unknown>) => string) & {
      dir(localeKey?: string): "ltr" | "rtl"
      exists(key: string): boolean
    }
  }
}
