/*
 * Nuxt UI reads its colours, text and surface levels, borders and radius from
 * `--ui-*` custom properties. Pointing each one at the `--newt-*` token that
 * plays the same part is what makes its components follow the newt/ui theme,
 * including the light palette and any token a project has overridden.
 *
 * The two literal values are the ones newt/ui itself keeps literal: white
 * text on a filled control, and the near-black of a tooltip bubble, which is
 * the same in both palettes.
 */
export const nuxtUiVars = {
  "--ui-primary": "var(--newt-brand)",
  "--ui-secondary": "var(--newt-text-link)",
  "--ui-success": "var(--newt-online)",
  "--ui-info": "var(--newt-text-link)",
  "--ui-warning": "var(--newt-idle)",
  "--ui-error": "var(--newt-danger)",
  "--ui-text-dimmed": "var(--newt-text-muted)",
  "--ui-text-muted": "var(--newt-text-muted)",
  "--ui-text-toned": "var(--newt-text-secondary)",
  "--ui-text": "var(--newt-text-secondary)",
  "--ui-text-highlighted": "var(--newt-text-primary)",
  "--ui-text-inverted": "#fff",
  "--ui-bg": "var(--newt-bg-base)",
  "--ui-bg-muted": "var(--newt-bg-surface)",
  "--ui-bg-elevated": "var(--newt-bg-elevated)",
  "--ui-bg-accented": "var(--newt-bg-active)",
  "--ui-bg-inverted": "#111214",
  "--ui-border": "var(--newt-border)",
  "--ui-border-muted": "var(--newt-border)",
  "--ui-border-accented": "var(--newt-border)",
  "--ui-border-inverted": "var(--newt-text-primary)",
  /*
   * Nuxt UI's controls are `rounded-md`, which is one and a half times this
   * value; dividing makes that land on the newt/ui control radius.
   */
  "--ui-radius": "calc(var(--newt-radius-sm) / 1.5)",
  "--font-sans": "var(--newt-font-sans)",
  "--font-mono": "var(--newt-font-mono)",
}

/*
 * Nuxt UI declares its light values on `:root` and `.light` and its dark ones
 * on `.dark`; naming all three replaces both sets with one that follows the
 * tokens instead.
 */
export const NUXT_UI_SELECTOR = ":root, .light, .dark"
