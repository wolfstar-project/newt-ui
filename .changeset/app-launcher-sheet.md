---
"newtui": minor
---

`app-launcher` gains a bottom sheet, an operable handle, real dialog behaviour and the parts a full launcher needs. Add the item again to get the changes.

- `AppLauncher` takes `variant`: `popout` (the default) or `sheet`. The sheet fills the width and reads its height from `--newt-app-launcher-sheet-height`, which defaults to `90dvh`. The HTML flavour adds `newt-app-launcher--sheet`.
- `AppLauncherHandle` takes `label` and `expanded`. With a `label`, it renders a `button` with that name and reports `expanded` as `aria-expanded`. Without one, it stays a decorative grip. The HTML flavour adds `newt-app-launcher__handle-button`.
- `AppLauncher` takes `label`, `modal` and `inline`, and calls `onClose` (`@close` in Vue). `label` is optional, as it is on `ChannelInfo`, so code that names the launcher with `aria-label` keeps working. Pass `label` or `aria-label`: a dialog without a name fails an accessibility audit.
- The Vue `AppLauncherSearchInput` takes `v-model`. The React one takes `onValueChange` beside `value` and `onChange`.
- `AppLauncherItem` takes `trailing` (`#trailing` in Vue) for content after the text, and `variant="tile"` for an icon above the name. `AppLauncherList` takes `variant="grid"` to lay out tiles.
- `AppLauncherItemIcon` and `AppLauncherRecent` take `fit`: `cover` (the default) or `contain`, for a logo that must not be cropped.
- New parts: `AppLauncherPromoCard`, with `art` and `footer` (`#art` and `#footer` in Vue), and `AppLauncherHeaderTitle`, the centred title of a drill-in view. The HTML flavour adds `newt-app-launcher__promo`, `__header-title`, `__item-trailing`, `__item--tile`, `__list--grid` and the `--contain` modifiers.

Five things change for existing code.

- `AppLauncher` is now a dialog built on Radix Dialog (React) and Reka UI Dialog (Vue), so the item installs `radix-ui` or `reka-ui`, and `class-variance-authority`. The React file is now a client component. It still renders in place, with no portal and no overlay. When it mounts, focus moves into it, and Tab then cycles through its controls. Escape calls `onClose`, and focus returns when you unmount the launcher. Add `modal` when the launcher covers the page. If you render the launcher in the page, for example in a showcase, add `inline`: it then has no dialog role and does not move focus.
- `AppLauncherRecents` renders a `ul` with `role="list"`, and each `AppLauncherRecent` wraps its button in an `li`. A screen reader now announces the number of recent apps. Put only `AppLauncherRecent` parts inside `AppLauncherRecents`. A React ref on `AppLauncherRecents` is now an `HTMLUListElement`. In the HTML flavour, use a `ul` and wrap each recent in an `li`.
- The React `AppLauncherHandle` forwards its ref as an `HTMLElement`, because it renders a `div` or a `button`.
- `AppLauncherItem` renders a row `div` that holds its `button` and, beside it, the `trailing` content. A control in `trailing` is no longer nested in the button. `className` (`class` in Vue) now styles the row. The ref and the other props still go to the button. In the HTML flavour, `newt-app-launcher__item` is the row, and `newt-app-launcher__item-action` is its button.
- In the HTML flavour, the dialog behaviour needs the new `app-launcher.js` and a `data-newt-app-launcher` attribute. Leave the attribute and the dialog role out for a launcher that stays in the page.
