/*
 * newt/ui for Nuxt UI: the `ui` key of `app.config.ts` that makes Nuxt UI's
 * own components (`UButton`, `UInput`, `UModal`, …) wear the newt/ui look.
 *
 * Most of the look comes from the stylesheet installed beside this file,
 * which points Nuxt UI's `--ui-*` variables at the `--newt-*` tokens. What is
 * here is the part a variable cannot say: which surface a floating panel
 * sits on, how a menu row lights up, what a neutral button looks like. Every
 * value is still a token, so overriding `--newt-brand` moves both libraries.
 *
 *   // app.config.ts
 *   import { newtNuxtUi } from "~/lib/nuxt-ui"
 *   export default defineAppConfig({ ui: newtNuxtUi })
 *
 * To change one component, spread the theme and replace that key.
 */

/* A panel that floats over the page: menus, selects, popovers. */
const floating =
  "bg-(--newt-bg-floating) ring-(--newt-border) rounded-(--newt-radius-md) shadow-(--newt-shadow-elevation-high)"

/* A menu row lights up in the brand colour with white text. */
const menuItem = {
  item: "text-toned data-highlighted:text-white data-[state=open]:text-white data-highlighted:before:bg-primary data-[state=open]:before:bg-primary",
  itemLeadingIcon:
    "group-data-highlighted:text-white group-data-[state=open]:text-white",
}

/* The same, for the listbox rows of a select. */
const optionItem = {
  item: "text-toned data-highlighted:not-data-disabled:text-white data-highlighted:not-data-disabled:before:bg-primary",
  itemLeadingIcon: "group-data-highlighted:not-group-data-disabled:text-white",
  itemDescription: "group-data-highlighted:text-white/75",
}

/* A text field: the input surface, a hairline border, a brand focus ring. */
const field = {
  outline: "bg-(--newt-bg-input) ring-(--newt-border)",
  subtle: "bg-(--newt-bg-input-elevated) ring-(--newt-border)",
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--newt-text-link)"

export const newtNuxtUi = {
  button: {
    slots: {
      base: "rounded-(--newt-radius-sm) font-medium",
    },
    compoundVariants: [
      {
        color: "primary" as const,
        variant: "solid" as const,
        class: `text-white hover:bg-(--newt-brand-hover) active:bg-(--newt-brand-active) ${focusRing}`,
      },
      {
        color: "error" as const,
        variant: "solid" as const,
        class: `text-white hover:bg-(--newt-danger-hover) active:bg-(--newt-danger-hover) ${focusRing}`,
      },
      {
        color: "success" as const,
        variant: "solid" as const,
        class: `text-white ${focusRing}`,
      },
      {
        /* The secondary button: a raised surface, not an inverted one. */
        color: "neutral" as const,
        variant: "solid" as const,
        class: `text-highlighted bg-(--newt-bg-elevated) hover:bg-accented active:bg-accented disabled:bg-(--newt-bg-elevated) aria-disabled:bg-(--newt-bg-elevated) ${focusRing}`,
      },
    ],
  },
  input: {
    slots: { base: "rounded-(--newt-radius-sm)" },
    variants: { variant: field },
  },
  textarea: {
    slots: { base: "rounded-(--newt-radius-sm)" },
    variants: { variant: field },
  },
  select: {
    slots: {
      base: "rounded-(--newt-radius-sm)",
      content: floating,
      ...optionItem,
    },
    variants: { variant: field },
  },
  selectMenu: {
    slots: {
      base: "rounded-(--newt-radius-sm)",
      content: floating,
      ...optionItem,
    },
    variants: { variant: field },
  },
  /* On is green, the way a setting that is switched on reads in the client. */
  switch: {
    slots: { thumb: "bg-white" },
    defaultVariants: { color: "success" as const },
  },
  checkbox: {
    slots: { base: "rounded-(--newt-radius-sm) ring-(--newt-text-muted)" },
  },
  card: {
    slots: { root: "rounded-(--newt-radius-md)" },
    variants: {
      variant: {
        outline: { root: "bg-(--newt-bg-surface) ring-(--newt-border)" },
      },
    },
  },
  /* A raised dialog with a darker footer strip, over a black scrim. */
  modal: {
    slots: {
      content: "bg-(--newt-bg-elevated) divide-y-0",
      footer: "justify-end gap-2 bg-(--newt-bg-surface)",
    },
    variants: {
      overlay: { true: { overlay: "bg-black/60" } },
      fullscreen: {
        false: {
          content:
            "rounded-(--newt-radius-lg) ring-0 shadow-(--newt-shadow-elevation-high)",
        },
      },
    },
  },
  slideover: {
    slots: {
      overlay: "bg-black/60",
      content: "bg-(--newt-bg-elevated) divide-(--newt-border)",
      footer: "justify-end gap-2 bg-(--newt-bg-surface)",
    },
  },
  popover: {
    slots: { content: floating },
  },
  dropdownMenu: {
    slots: { content: floating },
    variants: { active: { false: menuItem } },
  },
  contextMenu: {
    slots: { content: floating },
    variants: { active: { false: menuItem } },
  },
  /* The bubble is near-black in both palettes, so its text is always light. */
  tooltip: {
    slots: {
      content:
        "bg-inverted text-white ring-0 rounded-(--newt-radius-sm) shadow-(--newt-shadow-elevation-high) font-medium",
    },
  },
  toast: {
    slots: {
      root: "bg-(--newt-bg-elevated) ring-(--newt-border) rounded-(--newt-radius-md) shadow-(--newt-shadow-elevation-high)",
    },
  },
  alert: {
    slots: { root: "rounded-(--newt-radius-sm)" },
  },
  badge: {
    slots: { base: "rounded-(--newt-radius-sm) font-semibold" },
  },
  kbd: {
    base: "rounded-(--newt-radius-sm) font-mono font-semibold",
  },
}
