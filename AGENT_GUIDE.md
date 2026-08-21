# AGENT_GUIDE.md — Building components for newt/ui

This document is written for AI agents (and humans) extending **newt/ui**, the
Discord-native component library published by Newt Devs. Follow it exactly when
adding, modifying, or porting components, so the library stays visually and
structurally consistent regardless of who — or what — builds the next piece.

> **Trademark note**: newt/ui is an independent, community-built project. It is
> _visually inspired by_ Discord's client design but is **not affiliated with,
> endorsed by, or sponsored by Discord Inc.** in any way. See `DISCLAIMER.md`
> at the repo root for the full notice — its terms (no Discord logos/wordmarks,
> no copyrighted assets, "Discord-inspired" framing in all copy) apply to every
> component, doc page, and example added to this library.

## 0. Repository structure (monorepo)

newt/ui is a pnpm + turborepo monorepo mirroring shadcn-ui (React) and
shadcn-vue (Vue). Every component exists in three forms:

| Form                             | Location                                                                                                                             | Notes                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| HTML/CSS (canonical visual spec) | `packages/newt-ui/registry/html/components/<name>.{css,html,js}`                                                                     | Original sources. `tokens.css` lives next to them.                 |
| React                            | `apps/www/registry/default/ui/<name>.tsx` + `example/<name>-demo.tsx` + `content/docs/components/<name>.mdx`                         | `cva` + `cn` + Tailwind utilities mapped to `--newt-*` tokens.     |
| Vue                              | `apps/vue/src/lib/registry/default/ui/<name>/{Pascal.vue,index.ts}` + `example/PascalDemo.vue` + `content/docs/components/<name>.md` | SFC `<script setup lang="ts">`, variants exported from `index.ts`. |

Per-component metadata lives in `apps/www/registry/meta/<name>.json`
(`title`, `description`, `dependencies`, `registryDependencies`, `vueFiles`).
Run `node scripts/gen-registry.mjs` after adding or renaming a component: it
regenerates `registry-ui.ts`, `registry-examples.ts`, `__registry__/` for both
apps and `packages/*/registry.json` (shadcn registry schema).

Tailwind token classes (both apps, see `tailwind.config.ts` → `newtPreset`):
`bg-newt-bg-base|surface|elevated|floating|input|hover|active`,
`border-newt-border`, `text-newt-text-primary|secondary|muted|link`,
`bg-newt-brand|brand-hover|brand-active`, `bg-newt-online|idle|dnd|offline|danger|danger-hover`,
`rounded-sm|md|lg|full`, `font-sans|mono|display`, `shadow-elevation-low|high`,
`ease-newt`, `duration-fast|base`.

## 1. What newt/ui is

newt/ui is a **copy-into-your-project** component library (shadcn-style, not an
npm runtime dependency). Components are plain HTML/CSS with optional vanilla JS,
plus framework wrappers (React first). Everything is built from a single token
file (`tokens.css`) so any component automatically matches Discord's actual
client surfaces, colors, and motion.

Source of truth for tokens: `packages/newt-ui/registry/html/tokens.css`, `:root` block (mirrored into `apps/www/styles/globals.css` and `apps/vue/src/assets/css/tailwind.css`). Never hardcode a
color, radius, font, or shadow — reference a `--newt-*` variable. If a value you
need doesn't exist as a token, propose adding it to `:root` rather than inlining
a raw hex code.

## 2. Naming conventions

- All classes are prefixed `newt-` and follow BEM-lite: `.newt-block`,
  `.newt-block__element`, `.newt-block--variant`.
- Component file names are kebab-case and match the primary class:
  `status-indicator.html` → `.newt-status`.
- Variant modifiers describe **state or intent**, not appearance:
  use `--danger`, `--success`, `--online`, not `--red`, `--green`.

## 3. Reference palette (Discord-derived)

| Token                                              | Value                                         | Use for                           |
| -------------------------------------------------- | --------------------------------------------- | --------------------------------- |
| `--newt-bg-base`                                   | `#1e1f22`                                     | App background, deepest layer     |
| `--newt-bg-surface`                                | `#2b2d31`                                     | Sidebars, channel lists           |
| `--newt-bg-elevated`                               | `#313338`                                     | Cards, main content, modals       |
| `--newt-border`                                    | `#3f4147`                                     | Hairlines, dividers               |
| `--newt-text-primary`                              | `#f2f3f5`                                     | Headings, primary text            |
| `--newt-text-secondary`                            | `#b5bac1`                                     | Body text                         |
| `--newt-text-muted`                                | `#949ba4`                                     | Captions, placeholders            |
| `--newt-brand`                                     | `#5865f2`                                     | Primary actions, links-as-buttons |
| `--newt-online` / `--idle` / `--dnd` / `--offline` | `#23a55a` / `#f0b232` / `#f23f42` / `#80848e` | Presence states                   |
| `--newt-danger`                                    | `#da373c`                                     | Destructive actions               |

If Discord changes a brand color, update only this table and `:root` — never
chase down hardcoded hex values across components.

## 4. Anatomy of a component

Every component file/section includes, in order:

1. **Markup** — semantic HTML, ARIA roles where the native element doesn't
   imply them (e.g. `role="status"` for presence dots, `role="dialog"` +
   `aria-modal="true"` for modals).
2. **Styles** — scoped under the `.newt-<name>` root class, using only
   `--newt-*` tokens for color/spacing/radius/motion.
3. **Behavior (optional)** — vanilla JS attached via `data-newt-*` attributes,
   not inline `onclick`. Keep JS framework-agnostic; React wrappers are a thin
   layer on top.
4. **States** — hover, focus-visible, active, disabled, and any relevant
   semantic state (online/idle/dnd, success/error) must all be styled.
5. **A preview block** for the docs channel-style page (`index.html`), placed
   under the matching `#section-id` and wrapped in a `.msg` "message" card so
   it renders consistently with the rest of the docs.

## 5. Accessibility checklist (required for every component)

- [ ] Color contrast of text against its background meets WCAG AA (4.5:1 for
      body text, 3:1 for large text). Discord's own muted text (`#949ba4` on
      `#313338`) is borderline — don't go darker than that for body copy.
- [ ] All interactive elements are reachable via `Tab` and have a visible
      `:focus-visible` style (reuse `.newt-btn:focus-visible` pattern: 2px
      `--newt-text-link` outline, 2px offset).
- [ ] Icon-only controls have `aria-label` or visually-hidden text.
- [ ] Status/presence indicators expose state via `role="status"` or an
      `aria-label` (e.g. `aria-label="Online"`), not color alone.
- [ ] Animations respect `prefers-reduced-motion: reduce`.
- [ ] Modals trap focus and close on `Escape`; toasts are `role="status"` /
      `aria-live="polite"` and never trap focus.

## 6. Motion rules

newt/ui ships with **no CSS animations or transitions** — all states (hover,
active, online/offline, loading) are communicated through static color, shape,
and border changes only. This is a deliberate constraint, not an oversight.

- Do not add `transition`, `animation`, or `@keyframes` to any component.
- Hover/active/focus states must be distinguishable purely by their resting
  appearance — e.g. a filled background, a border, or a shape change (the idle
  crescent and DND bar on `.newt-status__dot` are good examples: state is
  encoded in the shape, not motion).
- "Live" indicators (typing, in-progress, streaming) should use a static
  marker (icon, dot, label text) rather than a pulse or shimmer effect.
- If a future component seems to need motion to communicate state, prefer an
  additional visual cue (icon, badge, label) instead.

## 7. Current component inventory

| Component             | Root class                                                                     | Notes                                                                |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Button                | `.newt-btn`                                                                    | primary/secondary/success/danger/link/icon variants                  |
| Badge                 | `.newt-badge`                                                                  | brand/success/warning/danger, optional `--dot`                       |
| Status indicator      | `.newt-status` / `.newt-status__dot`                                           | online/idle/dnd/offline/streaming, state encoded in shape not motion |
| Avatar                | `.newt-avatar`                                                                 | sm/default/lg sizes                                                  |
| Embed                 | `.newt-embed`                                                                  | Discord message embed card                                           |
| Card                  | `.newt-card`                                                                   | generic panel                                                        |
| Form fields           | `.newt-field`, `.newt-input`, `.newt-textarea`, `.newt-select`, `.newt-switch` | settings-modal styling                                               |
| Slash command tag     | `.newt-command`                                                                | inline `/command` token                                              |
| Tabs                  | `.newt-tabs` / `.newt-tab`                                                     | pill tab group                                                       |
| Tooltip               | `.newt-tooltip`                                                                | hover bubble                                                         |
| Modal                 | `.newt-modal-overlay` / `.newt-modal`                                          | dialog, requires focus trap in JS layer                              |
| Toast                 | `.newt-toast`                                                                  | success/error variants                                               |
| Code block            | `.newt-code`                                                                   | syntax token classes `.tok-*`                                        |
| Reaction pill         | `.newt-reaction`                                                               | clickable, `--active` state, `aria-pressed`                          |
| Reply preview         | `.newt-reply`                                                                  | "replying to" bar above a message                                    |
| Typing indicator      | `.newt-typing`                                                                 | static three-dot marker, paired with `aria-label`                    |
| Progress bar          | `.newt-progress` / `.newt-progress__fill`                                      | success/danger fill modifiers                                        |
| Member list row       | `.newt-member`                                                                 | presence dot + role tag                                              |
| Role tag              | `.newt-role-tag`                                                               | colored dot + label                                                  |
| Divider               | `.newt-divider`                                                                | labeled section divider (date separators, group headers)             |
| Mention chip          | `.newt-mention`                                                                | user/channel/role variants                                           |
| Spoiler               | `.newt-spoiler`                                                                | click-to-reveal text block                                           |
| Voice channel row     | `.newt-voice-channel`                                                          | nested member rows with mic/headset icons                            |
| Attachment card       | `.newt-attachment`                                                             | file icon + name + size + download                                   |
| Timeline              | `.newt-timeline`                                                               | vertical event log, dot variants match status colors                 |
| Permission row        | `.newt-permission`                                                             | deny/inherit/allow three-state group                                 |
| Token field           | `.newt-token-field`                                                            | masked input wrapper (pairs with `.newt-input`)                      |
| Dropdown menu         | `.newt-dropdown`                                                               | icon + label + description menu items                                |
| Skeleton loader       | `.newt-skeleton`                                                               | flat placeholder block, text/avatar/title variants                   |
| Empty state           | `.newt-empty-state`                                                            | icon + title + description pattern                                   |
| Context menu          | `.newt-context-menu`                                                           | right-click style action menu, supports `--danger` items             |
| Server banner         | `.newt-server-banner`                                                          | icon + name + live member counts + join button                       |
| Keyboard shortcut tag | `.newt-kbd`                                                                    | key-cap style tag for shortcuts                                      |
| Cooldown bar          | `.newt-cooldown`                                                               | rate-limit/cooldown progress variant, idle→ready color shift         |
| Pagination            | `.newt-pagination` / `.newt-load-more`                                         | page-number controls and "load more" divider                         |
| Stage banner          | `.newt-stage-banner`                                                           | thin announcement bar, optional `--dismissible`                      |
| Scrollbar utility     | `.newt-scrollbar`                                                              | apply to any scroll container for Discord-style scrollbars           |
| Channel topic bar     | `.newt-channel-topic`                                                          | channel name + topic description header                              |
| Notification badge    | `.newt-notif-badge`                                                            | count bubble or unread dot, positioned on parent                     |
| User profile popout   | `.newt-profile`                                                                | floating card with banner, avatar, bio, role tags                    |
| Message group         | `.newt-message-group`                                                          | full composed message — avatar, header, content, reactions           |
| Select menu           | `.newt-select-menu`                                                            | Discord-style option picker with search and selected-state           |
| Bot command card      | `.newt-command-card`                                                           | command name, description, typed options list                        |

## 8. Worked example: adding a new component

Walkthrough for adding a **"Channel Topic Bar"** component (the thin header
showing a channel's name and topic description, e.g. for a bot's dashboard
that mirrors a Discord channel view).

**Step 1 — Confirm it doesn't already exist.** Check `index.html` section IDs
and `packages/newt-ui/registry/html/components/` for `.newt-channel-topic*`. Not found → proceed.

**Step 2 — Pick the root class.** `.newt-channel-topic`. Sub-elements:
`.newt-channel-topic__icon`, `.newt-channel-topic__name`,
`.newt-channel-topic__divider`, `.newt-channel-topic__desc`. No state
modifiers needed for a v1.

**Step 3 — Write styles using only tokens, with no motion (per §6):**

```css
.newt-channel-topic {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--newt-border);
  font-size: 14px;
}
.newt-channel-topic__icon {
  color: var(--newt-text-muted);
}
.newt-channel-topic__name {
  font-weight: 700;
  color: var(--newt-text-primary);
}
.newt-channel-topic__divider {
  width: 1px;
  height: 18px;
  background: var(--newt-border);
}
.newt-channel-topic__desc {
  color: var(--newt-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Step 4 — Markup with accessibility:**

```html
<div class="newt-channel-topic">
  <span class="newt-channel-topic__icon" aria-hidden="true">#</span>
  <span class="newt-channel-topic__name">deploys</span>
  <span class="newt-channel-topic__divider"></span>
  <span class="newt-channel-topic__desc"
    >Automated deploy notifications from newt-trace</span
  >
</div>
```

**Step 5 — Add a docs preview.** In `index.html`, add a new
`<section class="component-section" id="channel-topic">` following the
existing pattern (numbered `.component-section__head` with title/class/
description, plus a `.component-section__body` containing a `.preview` with a
`.preview__copy` button and `.preview__content` wrapper around the markup
above), and add a matching `<a class="sidenav__link" href="#channel-topic">`
entry in the sidebar under the appropriate category group.

**Step 6 — Update the inventory table in §7** with the new component, and bump
the component count shown in the page header manifest and sidebar footer.

**Step 7 — Verify against the checklist in §5** before committing.

## 9. Framework wrappers

When porting a component to React/Vue/etc.:

- Keep the same class names — don't translate to CSS-in-JS or Tailwind unless
  explicitly asked. The point of newt/ui is that the CSS file is portable.
- Props should map to modifier classes (e.g. `variant="danger"` →
  `newt-btn--danger`), not introduce new visual logic.
- Default exports should render sensible content with no required props, per
  general artifact conventions — but document required props clearly in a
  comment block at the top of the file.

## 10. What not to do

- Don't introduce a second color system "for this one component."
- Don't use Discord's actual logo, wordmark, Clyde mascot, or any copyrighted
  Discord assets — newt/ui is _inspired by_ Discord's visual language (colors,
  spacing, component shapes), not a redistribution of its brand assets.
- Don't describe newt/ui or its components as "official," "Discord," or
  implying partnership/endorsement — use "Discord-inspired" or
  "Discord-styled" in all docs, READMEs, and marketing copy.
- Don't ship example/placeholder content (avatars, server names, usernames)
  that impersonates real Discord servers, bots, or users.
- Don't add a dependency to ship a component that can be done in plain
  CSS/JS — keep the "copy-paste, zero install" promise shadcn-style libraries
  are valued for.
- Don't skip the docs preview — an undocumented component doesn't exist as far
  as newt/ui's users (or other agents) are concerned.
