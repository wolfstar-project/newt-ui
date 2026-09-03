/*
 * The Code tab shows exactly the file `LiveDemo` renders, not the component
 * being demonstrated: the reader already sees the component copied into their
 * own project on the Installation step, this is the shorter file that shows
 * it in use. `?raw` keeps every one of these out of the JS bundle until a
 * reader opens the tab that needs it.
 */
const reactSources = import.meta.glob<string>(
  "../../../www/registry/default/example/*-demo.tsx",
  { query: "?raw", import: "default" }
)

const vueSources = import.meta.glob<string>(
  "../../../vue/app/lib/registry/default/example/*Demo.vue",
  { query: "?raw", import: "default" }
)

function findLoader(
  modules: Record<string, () => Promise<string>>,
  name: string,
  extension: string
): (() => Promise<string>) | undefined {
  const suffix = `/${name}${extension}`
  const path = Object.keys(modules).find((key) => key.endsWith(suffix))
  return path ? modules[path] : undefined
}

/** The React demo's own source, keyed the same way `reactDemo()` is. */
export function reactSource(name: string): Promise<string> | undefined {
  return findLoader(reactSources, name, ".tsx")?.()
}

/** The Vue demo's own source, keyed the same way `vueDemo()` is. */
export function vueSource(name: string): Promise<string> | undefined {
  return findLoader(vueSources, name, ".vue")?.()
}
