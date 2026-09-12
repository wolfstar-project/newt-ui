/*
 * The PWA plugin serves its data through virtual modules, which exist only
 * once Vite is running. These references are what tells the type checker they
 * are real, and what they hold.
 */
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="vite-plugin-pwa/client" />

/*
 * The theme's middleware puts a translate function on `Astro.locals`, and
 * declares it in the package's own `src/virtual.d.ts` — a file the exports map
 * does not reach, so the type never arrives here and this site has to say it.
 * `LotusTranslate` is not exported either, so the shape is restated rather
 * than imported, narrowed to the three members the routes here call.
 *
 * The value type of the interpolation record is the theme's own
 * `TranslationValues`: what `interpolate()` will put in a string.
 */
declare namespace App {
  interface Locals {
    t: ((
      key: string,
      values?: Record<string, string | number | boolean | undefined>
    ) => string) & {
      dir(localeKey?: string): "ltr" | "rtl"
      exists(key: string): boolean
    }
  }
}
