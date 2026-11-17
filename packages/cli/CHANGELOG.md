# newtui

## 2.9.2

### Patch Changes

- [#103](https://github.com/wolfstar-project/newt-ui/pull/103) [`baa4b49`](https://github.com/wolfstar-project/newt-ui/commit/baa4b4998c49e1815e1a6b217e294b56e8cff66f) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 2.9.1

### Patch Changes

- [#113](https://github.com/wolfstar-project/newt-ui/pull/113) [`36296fd`](https://github.com/wolfstar-project/newt-ui/commit/36296fdea68bac87208e76f7e7b80795447e6ef8) - `add` now rewrites `@/registry/bases/newt/...` imports in Vue items. The Vue registry publishes its imports in that form, so the shadcn-vue CLI can install newt/ui items too.

  If `add` writes a Vue item with an unresolved `@/registry/bases/newt/ui/...` import, your `newtui` is older than this release. Run `newtui@latest`.

## 2.9.0

### Minor Changes

- [#105](https://github.com/wolfstar-project/newt-ui/pull/105) [`3cbc482`](https://github.com/wolfstar-project/newt-ui/commit/3cbc482d122d8fe9cc9fdde3104945cc302c2d97) - `app-launcher` gains a bottom sheet, an operable handle, real dialog behaviour and the parts a full launcher needs. Add the item again to get the changes.

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

- [#100](https://github.com/wolfstar-project/newt-ui/pull/100) [`e825011`](https://github.com/wolfstar-project/newt-ui/commit/e825011b45ec3ab875029c3216435334c6a70df6) - `channel-header`, `channel-info` and `channel-welcome` gain a decorative form for their actions, a narrow header layout and real dialog behaviour. Add the items again to get the changes.

  - `ChannelHeaderAction`, `ChannelHeaderSearch`, `ChannelInfoAction` and `ChannelWelcomeAction` take `as` and `href`, as `Button` does. `as="span"` renders the decorative form for a read-only view. It is `aria-hidden`, has no pointer and no hover, and is out of the tab order. Its event handlers do not run. In the HTML flavour, put the action class on a `span` with `aria-hidden="true"`.
  - The same parts, `ChannelHeaderBack` and `ChannelHeaderTitle` take `disabled`. A disabled link loses its URL, leaves the tab order and carries `aria-disabled`, as `Button` does. A disabled control fades to half opacity and shows the not-allowed cursor.
  - `ChannelHeaderAction` reports `active` as `aria-pressed`. Leave `active` unset for an action that is not a toggle.
  - `ChannelHeaderName` now truncates. The topic shrinks first, and the name shrinks when the topic has no width left.
  - The narrow header has its own parts. `ChannelHeaderBack` leaves the channel and shows an unread count in `badge`. `ChannelHeaderTitle` makes the channel name a button. `ChannelHeaderSearch` takes `compact` for an icon-only control. The HTML flavour adds `newt-channel-header__back`, `__back-badge`, `__title`, `__title-chevron` and `__search--compact`.
  - `ChannelInfo` takes `label`, `modal` and `inline`, and calls `onClose` (`@close` in Vue).

  Five things change for existing code.

  - `ChannelHeader` renders a `div`. It rendered a `header`, which is a second banner landmark outside `main`, `article`, `aside`, `nav` or `section`. Pass `as="header"` to keep the element.
  - `ChannelHeader` has a minimum height of 48px in place of a fixed height, so a title with two lines fits.
  - `ChannelHeaderSearch` has no `aria-label`. Its text is its accessible name, so the name matches what a user sees.
  - `ChannelHeaderAction` with `active` set now carries `aria-pressed`. Remove an `aria-pressed` of your own, and keep the label the same in both states.
  - `ChannelInfo` is now a dialog built on Radix Dialog (React) and Reka UI Dialog (Vue), so the item installs `radix-ui` or `reka-ui`. It still renders in place, with no portal and no overlay. When it mounts, focus moves into it, and Tab then cycles through its controls. Escape calls `onClose`, and focus returns when you unmount the panel. Add `modal` when the panel covers the channel: the rest of the page is then hidden from assistive technology, focus cannot move to it, and a press on it calls `onClose`. If you render `ChannelInfo` as a side panel that is always on screen, add `inline`: it then has no dialog role and does not move focus. In the HTML flavour, the dialog behaviour needs the new `channel-info.js` and a `data-newt-channel-info` attribute.

- [#106](https://github.com/wolfstar-project/newt-ui/pull/106) [`a6123f8`](https://github.com/wolfstar-project/newt-ui/commit/a6123f84e6c6347d701b4854bfaa2f6b092622f0) - `member-list`, `status-indicator`, `avatar`, `tabs` and `reply-preview` gain new sizes, an interactive row and a defined list structure. Add the items again to get the changes.

  - `StatusDot` takes `label`, the state in words, such as "Online". A screen reader reads it, and it is not shown. In the HTML flavour, put a `newt-status__label` span inside the dot.
  - The ring of a status dot reads `--newt-status-ring`, then `--newt-bg-base`. If the avatar sits on another surface, set `--newt-status-ring` to that surface.
  - A new `--newt-streaming` token colours the streaming dot, with `bg-newt-streaming` on Tailwind v3 and v4. Run `init` again, or add the token to your stylesheet.
  - `Avatar` takes `size="xs"` (16px) and `size="md"` (32px). The HTML flavour adds `newt-avatar--xs` and `newt-avatar--md`.
  - `ReplyPreviewAvatar` no longer needs `src`. A `srcSet` (`srcset` in Vue) alone also draws the image. Without either, the avatar is a 16px circle that holds its children (the default slot in Vue), such as an icon. The HTML flavour adds `newt-reply__avatar--fallback`.
  - `MemberListItem` takes `interactive` for a row that opens a profile. The row then renders a button inside the list item, with a pointer, a hover and a focus ring. Listeners, attributes and the ref land on the button. In React, an interactive row takes the attributes of a button, such as `disabled`, `name` and `value`.
  - `MemberListItem` takes `decoration` (the `#decoration` slot in Vue), an underlay drawn behind the row. The hover is drawn over it.
  - `MemberListHeading` takes `as`, from `h2` to `h6`. The default stays `h3`.
  - `TabsList` is never wider than its container. If the triggers do not fit, it scrolls sideways, and the triggers keep their width.

  Four things change for existing code.

  - `StatusIndicator` no longer has `role="status"`. A member list made every row a live region with nothing to announce. Move an `aria-label` from `StatusIndicator` to `label` on `StatusDot`.
  - `MemberListItem` has no pointer and no hover by default, because a plain row does nothing. Add `interactive` to a row that opens something.
  - A heading is no longer a child of the list. Put a `MemberList` inside each `MemberListSection`, after its `MemberListHeading`. The section links the two, so each list is named by its heading. Give a `MemberList` with no section an `aria-label`. In the HTML flavour, `.newt-member-list` is now the list inside a section, with `aria-labelledby` pointing at the heading.
  - `MemberListSection` with `offline` now dims each `role="listitem"` element, so it dims interactive rows too.

- [#108](https://github.com/wolfstar-project/newt-ui/pull/108) [`cd8fedf`](https://github.com/wolfstar-project/newt-ui/commit/cd8fedf67c5b5bb90ddad88f427a64ad23deaba4) - `message-composer` takes a field of your own, more slots and a narrow phone layout. Add the item again to get the changes.

  - `renderInput` (React) and the `#input` slot (Vue) replace the built-in input. They receive `value`, `setValue`, `submit`, `disabled` and `inputProps`. Spread `inputProps` on your field to keep the label, the combobox attributes and the keyboard handling. Enter still submits, and the send button still follows the value.
  - `leading` (`#leading` in Vue) renders controls after the add button, before the field.
  - `showAdd` removes the add button when it is `false`. It defaults to `true`.
  - `trailing` (`#trailing` in Vue) takes the place of the send button while the value is empty.
  - `disabled` turns off the input, the add button and the send button.
  - `layout="narrow"` is the phone layout: no frame, a pill field and round buttons. The HTML flavour adds `newt-composer--narrow` and `newt-composer__button--narrow`.
  - `messageComposerButtonVariants` is exported. Give it to a button you add, so it matches the built-in icon buttons. The item now installs `class-variance-authority`.

  One thing changes for existing code. The `actions` slot now renders inside the field, at its end. The bar looks the same. If your styles select the field by its position, remove them and use `renderInput` or `#input` instead.

- [#102](https://github.com/wolfstar-project/newt-ui/pull/102) [`90b6349`](https://github.com/wolfstar-project/newt-ui/commit/90b6349d9d106463c82429363b77d0e9b761f89d) - `message-group`, `reply-preview` and `message-list` now draw a reply close to the message it answers. Add the three items again to get the changes.

  - With `withReply`, the reply line sits 2px above the body of the message. It sat 20px above before. A `ReplyPreview` inside `MessageGroupReply` has no margin and no start padding.
  - The spine of the preview starts above the centre of the avatar and stops 4px before the preview. `MessageGroup` publishes `--newt-message-group-avatar-size` (`40px`) and `--newt-message-group-gap` (`16px`), and the preview reads both. Set them on the row when the avatar has another size. Outside a group, the preview keeps its own elbow.
  - `ReplyPreviewCommand` takes an icon: the `icon` prop in React, the `#icon` slot in Vue, and the class `newt-reply__command-icon` in the HTML flavour. The icon sits before the truncating label, so the gap of the chip applies. The chip sizes an `svg` to 12px.
  - The new token `--newt-text-message` (`#dbdee1` dark, `[#313338](https://github.com/wolfstar-project/newt-ui/issues/313338)` light) is the colour of message text. `MessageGroup` sets it on the row, and `MessageGroupContent` has no colour of its own. A colour class on the row now changes the text colour of the message.
  - `MessageList` pads every row inside it. A row inside a wrapper keeps its padding, also when the wrapper is `display: contents`.

  Four things change for existing code. Message text is brighter on dark surfaces and darker on light surfaces. Text in a row that sets no colour takes the colour of the row. A margin or start padding class on a `ReplyPreview` inside a group no longer applies, so change the distance with a `gap-y-*` class on the row. If you drew your own spine, remove it. If you set a `gap-*` class on the row, set `--newt-message-group-gap` in its place so the spine follows.

  `newtui init` leaves a stylesheet that already holds the tokens untouched. If you keep your token file by hand, add `--newt-text-message` to both themes. Without the token, the row falls back to `--newt-text-secondary`, so message text keeps the colour it had. The `text-newt-text-message` utility needs the token in your Tailwind theme: `--color-newt-text-message: var(--newt-text-message)` in `@theme` on Tailwind v4, or `"text-message": "var(--newt-text-message)"` in the `newt` colours on v3. The components do not use that utility, so they work without it.

- [#95](https://github.com/wolfstar-project/newt-ui/pull/95) [`975a2de`](https://github.com/wolfstar-project/newt-ui/commit/975a2de6c813071d2c6924e9b51227343bdfa9b1) - `init` keeps the `index.ts` barrels out of Nuxt's component scan. Nuxt read each barrel as a second component and warned once per component folder (`NUXT_B3011: Two component files resolving to the same name`). In a Nuxt project, `init` now adds a `components` option to `nuxt.config` that ignores the barrels and keeps Nuxt's default directories. The pattern follows the `ui` alias in `components.json`. `init` edits only a config with one multi-line `defineNuxtConfig({` call, no `components` option and no top-level spread such as `...sharedConfig`. In every other case it prints the lines to add. If the project has no `nuxt.config` yet, it prints the file to create. If your project already ran `init`, add the option yourself: see the Nuxt installation guide.

- [#96](https://github.com/wolfstar-project/newt-ui/pull/96) [`f436ee8`](https://github.com/wolfstar-project/newt-ui/commit/f436ee88d9c230b3efa2011faea646360c5ffda7) - `scrollbar` gains an overlay thumb, auto-hide and a focus ring. `ScrollArea` takes `variant="overlay"`, which draws the thumb over the content so the box keeps its full width. `--newt-scrollbar-inset-start` and `--newt-scrollbar-inset-end` move the ends of the track, and `--newt-scrollbar-thumb-width` and `--newt-scrollbar-thumb-max-height` size the thumb. `autoHide` shows the thumb only on hover, on keyboard focus and while the area scrolls. `scrollbarAutoHideClassName` does the same for an element of your own. The thumb colour reads `--newt-scrollbar-thumb` and `--newt-scrollbar-thumb-hover`, and falls back to the colours it had.

  Three things change for existing code. A `focusable` viewport now draws its focus ring inside its box, where an `overflow: hidden` ancestor cannot clip it. The body of `app-launcher` and the list of `slash-command-suggestions` use the styled scrollbar, so both items now install `scrollbar`. In React, `ScrollArea` moves to a client component in `scroll-area.tsx`. The class strings move to `scrollbar-classes.ts`, so a Server Component can still use them. `scrollbar.tsx` exports both, so imports stay the same. The default variant is `native`, so the scrollbar itself looks as it did. In the HTML distribution, the overlay thumb needs the new `scrollbar.js` and a `data-newt-scrollbar` attribute. Add the item again to get the new files.

- [#97](https://github.com/wolfstar-project/newt-ui/pull/97) [`34775ab`](https://github.com/wolfstar-project/newt-ui/commit/34775ab05dd6063c7b25d2b4bb4f751e30aeeeaa) - `select-menu` can now draw a select as it appears under a message. Add the item again to get the changes.

  - `side` and `align` place the panel. `side="top"` opens it above the trigger, and it still flips when that side has no room. In the HTML flavour, set `data-side="top"` on the root and `data-align` on the panel.
  - `triggerClassName` and `contentClassName` (`triggerClass` and `contentClass` in Vue) merge classes onto the trigger and the panel. Both parts carry a `data-slot`: `select-menu-trigger` and `select-menu-content`.
  - An option takes `emoji`, a unicode character drawn where the icon would be. `icon` wins when an option has both.
  - `renderItem` (React) and the `#item` slot (Vue) draw the content of a row. `renderItemDescription` and `#item-description` draw only the description. A row drawn with `renderItem` or `#item` names its option with all of its text.
  - The trigger has `tabindex="-1"` while the list is open, so an axe audit no longer reports it under `aria-hidden-focus`. Focus still returns to it on close. The other focusable elements of the page can still be reported; the docs page says why.
  - In the HTML flavour, mark the label of a row with `newt-select-menu__option-label`. The script copies that text to the trigger. A row without the class still gives all of its text, as before. The script also copies the `newt-select-menu__option-emoji` of a row to the trigger.

- [#101](https://github.com/wolfstar-project/newt-ui/pull/101) [`8a37dc5`](https://github.com/wolfstar-project/newt-ui/commit/8a37dc5fa71c3502585d1dc24da135c9e6dd24db) - `slash-command` and `slash-command-suggestions` have real text separators and a layout that follows the picker. Add both items again to get the changes.

  - The text of a `SlashCommand` is now `/conf menu save key:prefix`. A real space stands between two parts and a real colon follows each option name. A copy, a search and `textContent` all give that text. The chip still draws each gap 4px wide.
  - `SlashCommand` takes `children` in React and a default slot in Vue. The content follows the last option inside the chip, after a space.
  - The text of a `SlashCommandSuggestion` is now `/warn`, with no non-breaking space. A margin on the slash draws the gap.
  - `SlashCommandAppIcon` sizes its first child whatever the element is. An icon component that renders a `<span>` now gets half the size of the circle, as an inline SVG does.
  - `SlashCommandSuggestionsFooter` is a new part: a bar under the rail and the list, for the command being typed.
  - The width cap of the picker reads `--newt-slash-suggestions-max-width`. The default is still 640px. Set it to `none` to make the picker as wide as the composer.
  - `SlashCommandSuggestionsRail` takes `orientation`: `"vertical"` or `"horizontal"`.
  - In a picker narrower than 480px, the rail becomes a row under the list, unless `orientation` fixes it. A suggestion puts the app name beside the command name and gives the description the full width, on up to two lines.

  Six things change for existing code.

  - The chip is inline content and no longer a flex container. A class that relied on `gap` or on a flex child no longer applies.
  - The colon is no longer generated by CSS. In the HTML flavour, write it in the markup: `<span class="newt-command__option-name">user:</span>`. Write one space between two parts and none after the slash.
  - In the HTML flavour, wrap the slash of a suggestion in `newt-slash-suggestions__option-slash` in place of `/&nbsp;`.
  - The picker is a grid and a size container (`container-type: inline-size`). Its width must not depend on its content, so keep `w-full` or give it a width. `flex-col` on the picker has no effect now: the footer and a horizontal rail take their own rows.
  - A picker narrower than 480px changes layout as described above. Pass `orientation="vertical"` to keep the rail beside the list.
  - `SlashCommandAppIcon` now sets the size of a first child that is not an `<img>`, and that size wins over a size class on the child. Put text straight inside the icon, with no wrapper element.

- [#107](https://github.com/wolfstar-project/newt-ui/pull/107) [`ce21589`](https://github.com/wolfstar-project/newt-ui/commit/ce21589d8c1ec0495cd8ba5918ab3c1264d6661c) - A new `text-display` item, and message parts that follow what a Components V2 message sends. Add the changed items again to get the changes.

  - `text-display` is a block of message text. It keeps the line breaks of its string (`white-space: pre-line`). `size` takes `heading-1`, `heading-2`, `heading-3` and `subtext`, the `#`, `##`, `###` and `-#` sizes of the `Markdown` component. `as` picks the element, so `as="h3"` makes a heading size a real heading. The HTML flavour is `newt-text-display` with `--heading-1`, `--heading-2`, `--heading-3` and `--subtext`.
  - `Divider` takes `spacing="small"` (4px) and `spacing="large"` (8px), the two steps of a V2 separator. `sm`, `md` and `lg` still work. The HTML flavour adds `newt-divider--small` and `newt-divider--large`.
  - `Button` takes content before and after the label: the `leading` and `trailing` props in React, the `#leading` and `#trailing` slots in Vue, and `newt-btn__leading` and `newt-btn__trailing` in the HTML flavour. Each sits in its own box, so an icon component or a unicode emoji gets the gap. The `emoji` image URL prop still works.
  - `Button` takes `size="message"`, 32px high, for a button in a message. The height is fixed, so a link button or an emoji image keeps the row aligned. The HTML flavour adds `newt-btn--message`.
  - `Reaction` draws its emoji from its children in React and from its default slot in Vue, for an icon or an image component. The slot wins over `emoji` and `emojiSrc`. Set `emojiAlt` to name it. `formatLabel` still builds the accessible name. The HTML flavour adds `newt-reaction__emoji`.
  - `InviteName` takes `as`, as `Button` does. Pass `NuxtLink`, `RouterLink` or another link component to keep client navigation. In React, the part takes the props of that component, such as `to`.
  - `EmbedAuthorIcon`, `EmbedFooterIcon`, `InviteIcon`, `MediaGalleryItem` and `SectionThumbnail` take `as`, so you can pass an image component such as `NuxtImg`. In React, each part takes the props of that component. The spoiler of `MediaGalleryItem` and `SectionThumbnail` still works with it.

  Three things change for existing code.

  - An `Embed` with no `color` draws its bar in `--newt-border`, the same neutral default as `V2Container`. It used `--newt-brand` before. Pass `color="var(--newt-brand)"` to keep the old bar. An explicit `color` works as before.
  - `SectionThumbnail` is 85px square. It was 86px.
  - A `Button` with no label renders no label box, so an emoji-only button has no extra gap after the emoji.

- [#109](https://github.com/wolfstar-project/newt-ui/pull/109) [`271f84e`](https://github.com/wolfstar-project/newt-ui/commit/271f84e9cc9e88e85ccd4944913f32d58bc95091) - `add` and `diff` now warn when a component uses a theme name your project does not declare. Before, a class such as `shadow-elevation-high` or `duration-fast` produced no CSS, and nothing said so. The CLI reads your stylesheet and the local files it imports, such as `@import "newt.css"`. It lists each missing name and prints the block to paste: `@theme` entries on Tailwind v4, `theme.extend` entries on v3, and the raw `--newt-*` variables on both.

  The new `newtui tokens` command appends that block for you. It adds only the missing names, so a second run writes nothing. Pass component names to limit it to what they use, and `--dry-run` to print the block without writing it. On Tailwind v3 it prints the `tailwind.config` entries instead of editing the file.

  The theme now maps `duration-fast` and `duration-base` on Tailwind v4 through `--transition-duration-fast` and `--transition-duration-base`. Earlier `init` runs did not write them, so these classes had no effect on v4. Run `npx newtui tokens` to add them. On Tailwind v3 the preset now reads `var(--newt-duration-fast)` and `var(--newt-duration-base)` instead of fixed values.

  Components now read their radii and their sans and mono stacks from the newt tokens, not from your Tailwind scale. `rounded-md` became `rounded-[var(--newt-radius-md)]`, and `font-sans` became `font-[family-name:var(--newt-font-sans)]`; the same holds for `sm`, `lg`, the sided radii and `font-mono`. Before, a host with its own scale restyled them: in an app with Nuxt UI `rounded-md` is 12px, not 8px. Tailwind v3 compiled the default 6px. Both forms compile on Tailwind v3 and v4, and a `rounded-*` or `font-*` class you pass still wins. A newt/create preset's radius and font now reach the components too. Run `npx newtui add <component> --overwrite` to update installed components. To keep your own scale inside newt/ui, set `--newt-radius-*` and `--newt-font-*` to it, as the theming guide shows.

- [#110](https://github.com/wolfstar-project/newt-ui/pull/110) [`d949a03`](https://github.com/wolfstar-project/newt-ui/commit/d949a0327af1d664ed3e83c3e211709018e442fe) - Every name and text a component writes itself now comes from a prop. English stays the default, so nothing changes until you pass a translation. Add the changed items again to get the new props. The new [Translating labels](https://newtui.dev/docs/translating-labels) page lists every prop and its English default.

  - `MessageComposer` takes `labels`: `group`, `placeholder`, `add` and `send`. `group` and `placeholder` are functions of the channel name. `defaultMessageComposerLabels` holds the English text.
  - `SlashCommand` takes `formatLabel`, which builds the chip's name from the command path and the options. `defaultSlashCommandLabel` is the English default.
  - `AppLauncherItem` takes `promotedLabel` for the `Promoted` badge.
  - `MemberListAppTag` and `MessageGroupBotTag` take `label` and `verifiedLabel`. An `aria-label` on `MessageGroupBotTag` still wins.
  - `SectionThumbnail` and `MediaGalleryItem` take `spoilerLabel`.
  - `EmbedTimestamp` takes `locale`, `timeZone` and `formatter`. `formatter` wins over the other two. `locale` defaults to `en-US`, as before. Pass a fixed locale and time zone, so the server and the browser write the same text.
  - `Timestamp` takes `timeZone`. It defaults to the zone of the runtime, as before.
  - `ThreadPreviewCount` takes `formatCount`. `PinInput` takes `formatCellLabel` for the name of each box.
  - `PermissionStates` takes `labels` with `deny`, `inherit` and `allow`.
  - `EntitySelect` takes `emptyLabel`. `FileUpload` takes `prompt` and `browseLabel`.
  - `ExpressionsPicker` takes `labels` for every name and text it writes. `defaultExpressionsPickerLabels` holds the English text. `unavailable` builds the name of an item you cannot choose from its label.
  - In the HTML flavour, `tag-input.js` reads `data-newt-remove-label` from the field, with `{tag}` for the chip's text. `token-field.js` reads `data-newt-reveal-label`, `data-newt-hide-label` and `data-newt-copied-label`. `expressions-picker.js` reads a `labels` object from its JSON data, with `{label}` in `unavailable` for the item's name.

  One thing changes for existing code. In Vue, `expressionKinds` is now a list of kinds, and the entries of `skinTones` no longer carry a `label`. Read the names from `defaultExpressionsPickerLabels` instead.

## 2.8.0

### Minor Changes

- [#66](https://github.com/wolfstar-project/newt-ui/pull/66) [`8144443`](https://github.com/wolfstar-project/newt-ui/commit/81444431b5c93ab081f02e6e5085d49f5623af5d) - Presets carry three more choices from newt/create: the base colour the surfaces are mixed from (`slate`, `neutral`, `stone`, `ink`), a heading font of its own, and the elevation shadows (`soft`, `flat`, `deep`). The radius scale gains `none` and `xl`, and the font stacks gain `serif` and `rounded`. `init --preset`, `apply --preset` and `preset css` write the matching `--newt-*` overrides, including both surface sets for a base colour: the light one in `:root` and the dark one under the project's dark selector, the way `init` lays the tokens out (`preset css` prints the other layout for an `html` preset, dark in `:root` and light under `.newt-light`, as `tokens.css` does; `init` and `apply` always write the installed one). Codes made before this release decode and encode exactly as they did.

### Patch Changes

- [#78](https://github.com/wolfstar-project/newt-ui/pull/78) [`b55af41`](https://github.com/wolfstar-project/newt-ui/commit/b55af41fe4be0175f8606928510f7b3494a848b2) - Read a `@newtui/<name>` dependency as an item of the registry it came from. The published registry now names its dependencies that way, so the shadcn CLI no longer looks for `chat` or `avatar` in its own default registry.

## 2.7.0

### Minor Changes

- [#63](https://github.com/wolfstar-project/newt-ui/pull/63) [`883e3e1`](https://github.com/wolfstar-project/newt-ui/commit/883e3e1459dc82c3f960c757aeeaaadb594e6611) - `add` and `view` accept `@registry/item` and install from third-party registries. A namespace resolves through `registries` in `components.json`, then through the community directory of the project's framework — shadcn/ui's for React, shadcn-vue's for Vue — so `newtui add @magicui/marquee` needs no configuration. On Tailwind v4 the first third-party install also maps shadcn's colour names onto the `--newt-*` tokens.

### Patch Changes

- [#65](https://github.com/wolfstar-project/newt-ui/pull/65) [`1370df5`](https://github.com/wolfstar-project/newt-ui/commit/1370df54439f2f824446a765da5ece943e07c174) - The embed sits on a translucent surface with a hairline outline and a straight accent bar, so it stands out on any background instead of matching `--newt-bg-elevated`. Two new tokens with light and dark values carry it: `--newt-embed-bg` and `--newt-embed-border`. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the two variables by hand.

## 2.6.0

### Minor Changes

- [#57](https://github.com/wolfstar-project/newt-ui/pull/57) [`3aa8e2d`](https://github.com/wolfstar-project/newt-ui/commit/3aa8e2df7ad523c34ab37b22040f98de13c8d497) - `Spoiler`, `Modal` and `CodeBlock` are now accessible, translatable and themed, so the `markdown` item can render user content without patches.

  - `Spoiler` hides all of its content while closed, including links, inline code, mentions and emoji images, and makes it `inert`, so a hidden link cannot be clicked or reached with Tab. A new `label` prop sets its accessible name, and `Markdown` passes it the new `spoiler` entry of `MarkdownLabels`. The plain HTML flavour now needs `spoiler.js`, which handles the reveal by click, Enter or Space; the markup no longer carries an inline `onclick`, so a spoiler copied without the script stays hidden.
  - `Modal` moves focus to its first control when it opens (or to the dialog itself when it has none), keeps Tab and Shift+Tab inside, and returns focus to the element that opened it when it closes. The HTML flavour's `modal.js` does the same and removes its Escape listener when the modal closes.
  - New tokens with light and dark values: `--newt-spoiler` and `--newt-spoiler-hover` for the hidden chip, and `--newt-code-bg`, `--newt-code-keyword`, `--newt-code-string`, `--newt-code-comment` and `--newt-code-function` for the code block. They replace fixed hex values, so both parts follow a light theme and token overrides. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the seven variables by hand; the values for both themes are on the colours page.

- [#56](https://github.com/wolfstar-project/newt-ui/pull/56) [`20b5d62`](https://github.com/wolfstar-project/newt-ui/commit/20b5d6262d171a96f5d6463a58a04facfd754334) - New `app-invite` component: the app directory card a link to an app unfurls into inside a message, with a cover banner, the app's icon and name, an optional description and a full-width call to action. Available for React, Vue and HTML/CSS (`newtui add app-invite`).

  The HTML `.newt-btn` no longer underlines when it is an `<a>`, matching the React and Vue buttons.

### Patch Changes

- [#58](https://github.com/wolfstar-project/newt-ui/pull/58) [`18b3d83`](https://github.com/wolfstar-project/newt-ui/commit/18b3d835e9469dd6cc19f1a270abee41f5bc1e32) - `markdown` lays out a message the way the client does. A list item indented under another one nests, with a circle bullet and then a square one. Blank lines stay empty lines, before and after a list as well as between paragraphs, and `_ _` is an empty line written on purpose. A heading takes the blank lines after it, and list spacing and indentation match the client.

- [#60](https://github.com/wolfstar-project/newt-ui/pull/60) [`07b11aa`](https://github.com/wolfstar-project/newt-ui/commit/07b11aa9633585a20a833b26d031b6a0b6033a7e) - Typeset now covers what a CommonMark and GFM renderer emits: task lists, footnotes, aligned table columns, `mark`, definition lists, `details` and `figure`, and a blockquote no longer keeps the browser's 40px indent. It no longer installs `spoiler` — chat markdown with mentions, timestamps and spoilers is the Markdown component's job.

## 2.5.0

### Minor Changes

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - Components a message feed needs can now be read-only, translated and themed.

  - `Mention` takes `as="span"` for a mention that opens nothing (not focusable, no hover), and `as="a"` or `href` for one that navigates.
  - `Reaction` takes `readonly` to show a count without a toggle, `emojiSrc` for a server emoji image with `emojiAlt` for its name, and `formatLabel` to translate its accessible name.
  - `MessageGroupBotTag` takes `aria-label` (React) / `ariaLabel` (Vue) to replace "Application".
  - `Button` renders a link with `href`, or any element or router link with `as`. A disabled link drops its `href` and sets `aria-disabled`.
  - `MessageGroup` takes `as`, so a post can be an `<article>` or an `<li>`.
  - Fixed colours are tokens now: `--newt-on-accent` (text and marks on brand fills), `--newt-overlay` (the modal scrim) and `--newt-bg-message-hover` (a message row on hover) replace `text-white`, `bg-white`, `bg-black/60` and `bg-black/[0.06]`, so these parts follow a light theme and token overrides.

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - `newtui init` no longer restyles the app it is added to, and its light theme now applies.

  - The stylesheet gets one complete light `:root`, and the dark values go under a selector you choose with `--dark-selector`: `class` (`.dark`, the default), `data-theme` (`[data-theme="dark"]`), `media` (the system preference) or any selector. The choice is saved as `tailwind.darkSelector` in `components.json`, and the printed Tailwind v3 preset sets `darkMode` to match. Before this, two `:root` blocks were written and the dark one won on every page.
  - The `@theme` block maps only `newt` names. It no longer redefines `--radius-sm/md/lg/full`, `--font-sans` or `--font-mono`, so an existing app keeps its own radii and fonts. Components now use Tailwind's own `rounded-*` and `font-*` scale; the raw `--newt-radius-*` and `--newt-font-*` variables are still written.
  - When `--css` names a new token file and another stylesheet already loads Tailwind, `init` leaves `@import "tailwindcss"` out and prints the line to import the token file from that entry.

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - New `markdown` item: renders a message written in chat markdown with the library's own parts.

  ```tsx
  <Markdown
    content="**Deploy** done — ping <@1001> in <[#2002](https://github.com/wolfstar-project/newt-ui/issues/2002)> ||tomorrow|| at <t:1767225600:t>"
    resolveMention={(kind, id) => names.get(`${kind}:${id}`)}
  />
  ```

  It reads bold, italic, underline, strike, spoilers, inline and fenced code, `#`–`###` headings, `-#` subtext, lists, `>` and `>>>` quotes, links, and the `<@id>`, `<@&id>`, `<#id>`, `</command:id>`, `<:emoji:id>` and `<t:…>` tokens, and renders them as `Mention`, `InlineCode`, `CodeBlock`, `Spoiler`, `CustomEmoji` and `Timestamp`. The source is parsed into a tree, never injected as HTML, and only `http(s)` addresses become links. A masked link (`[text](url)`) shows its address in a dialog before it opens. Mention names and server emoji images come from the `resolveMention` and `resolveEmoji` callbacks; every label can be translated through `labels`. The parser is exported as `markdown-syntax` for code that wants the tree without rendering it.

### Patch Changes

- [#29](https://github.com/wolfstar-project/newt-ui/pull/29) [`c509c7e`](https://github.com/wolfstar-project/newt-ui/commit/c509c7e6c5b2e8e2eff42947053e7e3096f62410) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 2.4.0

### Minor Changes

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add three components to the HTML and CSS distribution: `user-panel`, `side-nav` and `audit-log`. The React and Vue registries carry them under the same names, together with three new blocks built from them: `channel-sidebar`, `settings-layout` and `onboarding`.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add five components to the HTML and CSS distribution: `alert`, `avatar-group`, `table`, `tree` and `calendar`. The tree and the calendar ship a script for keyboard navigation, and the calendar reads and reports dates as `YYYY-MM-DD` strings. The React and Vue versions are in the registry under the same names.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add five form controls to the HTML and CSS distribution: `slider`, `pin-input`, `tag-input`, `number-input` and `color-picker`, each with its stylesheet, reference markup and a small script. The React and Vue versions are in the registry under the same names.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add six components to the HTML and CSS distribution: `accordion`, `breadcrumb`, `stepper`, `popover`, `drawer` and `command-palette`. The drawer and the command palette are built on the native `<dialog>` element and the accordion on `<details>`, so focus trapping, Escape and single-open behaviour come from the browser. The React and Vue versions are in the registry under the same names.

### Patch Changes

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - `add` now prints the right import line for a library item: it names the file under the `lib` alias instead of a path under `components/ui`, and prints nothing for an item that installs no files. This is what `newtui add nuxt-ui-theme`, the new Nuxt UI theme in the Vue registry, relies on.

## 2.3.0

### Minor Changes

- [#31](https://github.com/wolfstar-project/newt-ui/pull/31) [`d4e6318`](https://github.com/wolfstar-project/newt-ui/commit/d4e631899e83f9e251ded138da18cf4fd488ce31) - Add a Discord-inspired expressions picker for Unicode emoji and caller-supplied server emoji, stickers, and GIFs, with a category rail, collapsible sections, skin tones, a recently used section, a preview bar, grid keyboard navigation, and matching HTML, React, and Vue implementations.

## 2.2.1

### Patch Changes

- [#24](https://github.com/wolfstar-project/newt-ui/pull/24) [`dc0b233`](https://github.com/wolfstar-project/newt-ui/commit/dc0b233e13e524b76f5228e77322ad4b1032009e) - Update dependencies. `newtui` follows the narrower cancel type in `@clack/prompts` 1.8, and `@newtui/nuxt` annotates its default export so the declaration build no longer depends on an `@nuxt/schema` internal type.

## 2.2.0

### Minor Changes

- c7e6a09: `CodeBlock` colours its own source. Give it a `language` and the code, and the four colours it has — comment, string, keyword, call — are applied by a scanner that ships inside the component:

  ```tsx
  <CodeBlock language="ts">{`// example
  const greet = (name: string) => \`hello ${name}\`
  
  greet("world")`}</CodeBlock>
  ```

  Before this, every coloured run had to be placed by hand as a `CodeToken`, with the spaces and newlines between them written as JSX expressions to survive the whitespace rules. That is still available — `CodeToken` is exported, and children are rendered untouched when no `language` is given — but it is now the exception rather than the only way in.

  `language` accepts `ts`, `tsx`, `js`, `jsx`, `json`, `bash` and `sh`. The scanner is four answers, not a parse tree: six lines of code in a chat message should not drag a highlighter and a grammar in behind them. What it reads badly stays plain rather than wrong, and anything needing real grammar — a diff, a language not on that list, semantic colours — produces its own runs and passes them as `tokens`, an array of `{ text, kind? }`. `tokenizeCode` is exported for callers that want the runs without the markup.

  In Vue the source goes through the `code` prop, since a template collapses the newlines out of slot text.

  The plain HTML flavour is unchanged: it has no scanner to run, and its spans are the highlighting.

- c7e6a09: New `entity-select` item: the picker for the things a server already knows about — its members, its roles, its channels, or all of them at once.

  It is a separate control from the string select rather than a mode of it, because the rows are not strings. A member arrives with a face and sometimes an app tag, a role with a colour and a headcount, a channel with the glyph that says what kind of channel it is. `kind` says which of the four the list is drawn from; it only changes the wording shown when the server has nothing to offer.

  `max` above one turns the control into chips: the choices leave the list and sit in the trigger, each with a cross, and every row grows a box instead of a tick — the shape is what says whether picking this one un-picks the last. Backspace removes the chip nearest the caret. At the limit the list stays open and stops taking more rather than silently dropping the oldest choice.

  The list is capped at 25, which is what the platform accepts either way, and the panel shows its scrollbar rather than hiding it until the pointer moves: with a capped list the bar is what says there is more below the fold. The panel is portalled so an `overflow: hidden` ancestor cannot clip it, positioned from measured coordinates, and flipped above the control when the space below runs out.

  The whole control is one tab stop driven by `aria-activedescendant`, with the arrows, Home, End, Enter, Escape and Backspace all doing what they do everywhere else.

- c7e6a09: Give `form-fields` a validation state, and add three composed blocks.

  `Field` takes `invalid`, and the controls inside read it from the wrapper — so a form library that only knows "this field failed" says it in one place rather than per control. `FieldHelp` takes `variant="error"`, which colours the message and gives it `role="alert"`, because a validation message that appears after a failed submit is useless to a reader who is not looking at that part of the page. The same state exists in the plain HTML build as `.newt-field[data-invalid]` and `.newt-field__help--error`.

  Three new `registry:block` items, installed like any other component and composed entirely from ones that already exist:

  - `chat-window` — a whole channel view: header, scrolling message list and composer.
  - `server-sidebar` — the column beside it: the server banner, the voice channel and the grouped member list.
  - `command-panel` — a keyboard-selectable command list paired with the selected command's option card.

  The registry generator and public indexes now understand blocks, which live under `block/` and declare their own file lists rather than being named after a single file. Multi-file Vue blocks install into their own component directory.

- c7e6a09: Add an MCP server and three read-only commands, so an agent can discover the registry instead of guessing at it.

  `newtui mcp` runs a Model Context Protocol server over stdio, and `newtui mcp init --client claude|cursor|vscode|codex|opencode` writes the configuration each editor needs — merging into whatever is already in the file rather than replacing it. The server exposes eight tools, named to match shadcn's so an agent that knows one registry needs no new vocabulary: `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist`, and `get_design_tokens`, which returns the `--newt-*` palette. Two prompts, `install-component` and `build-with-newt`, walk the search-then-install path. Everything is read-only: installing stays a command somebody runs.

  Three new commands back it, and stand on their own:

  - `newtui info [--json]` prints what a project is — framework, bundler, Tailwind major, aliases, registry, and which components are installed.
  - `newtui search [query] [--json]` filters the registry by name, title or description.
  - `newtui view <components...> [--json]` prints an item's source without installing it.

  The package now ships a test suite (`vitest`), covering registry URL resolution, the MCP tool and prompt surface, and that `mcp init` preserves the servers a config already had.

- c7e6a09: Presets: a project's brand hue, radius scale, font stack, surface mode and direction can now be chosen once in newt/create and handed to the CLI as a code.

  A preset code is `nt1.<base64url>` over a versioned payload, and it is a set of overrides for tokens that already exist — never a second theme file. `newtui init --preset nt1.…` writes the block into the global stylesheet after the tokens it overrides, fenced by two comments so it can be found again; `newtui apply --preset nt1.…` does that step alone, for a project that ran `init` some time ago, replacing an existing block instead of stacking a second one that would silently win.

  `newtui init --template <next|vite-react|vite-vue|nuxt>` creates the project first, by running the creator that framework maintains, then continues with the usual `init` inside the result. The other targets the docs cover — Astro, TanStack Start, React Router, Laravel — are created with their own tool and `init` runs afterwards; a preset still records which one you were aiming at, it just does not imply a template.

  `newtui preset decode <code>` prints what a code carries, with `encode` and `css` for the other two directions. The codec is pinned by a golden fixture shared with the documentation site, so the builder and the CLI cannot drift apart.

- c7e6a09: Every component now uses CSS logical properties, so a right-to-left interface is a `dir` attribute rather than a second stylesheet.

  The conversion covers all three flavours — the HTML/CSS spec, the React registry and the Vue registry: `margin-left` becomes `margin-inline-start`, `left:` becomes `inset-inline-start`, `border-top-left-radius` becomes `border-start-start-radius`, and the Tailwind utilities follow the same mapping (`ml→ms`, `pr→pe`, `left-→start-`, `rounded-tl→rounded-ss`, `border-l→border-s`, `text-left→text-start`). A test asserts that no physical spelling comes back.

  The one thing CSS cannot express logically is the sign of a sideways transform, so `tokens.css` gains `--newt-dir`, which is `1` normally and `-1` under `[dir="rtl"]`. A component that moves something sideways multiplies by it — the switch thumb in `form-fields` is the worked example.

  New `direction` item: `DirectionProvider` sets `dir` on a subtree and exposes it through React context or Vue injection, for the components that have to decide which way is forward rather than which way is left. In the plain HTML build the attribute is the whole feature.

  New `newtui migrate rtl [--dry-run]` rewrites components installed before this change, in place, reporting every substitution per file. It is idempotent, and it flags `space-x-*` — which is not direction-safe on Tailwind v3 — rather than converting it silently.

- c7e6a09: New `typeset` item: the styles for rendered markdown, which is the one thing a component library cannot cover with components — what arrives is whatever the renderer emitted, with no classes you chose.

  Typeset styles that markup from the outside through three variables: `--typeset-size` is the base every other size is an `em` of, `--typeset-leading` is the line height, and `--typeset-flow` is the space between block children. One rule owns the rhythm — every block child carries the same trailing margin and none carries a leading one — so a paragraph's spacing never depends on what happens to sit above it. Everything else resolves to a `--newt-*` token, which is why a typeset block follows the palette, the light surfaces and a preset without knowing they exist.

  The elements it covers are the ones a chat markdown parser emits: headings, paragraphs, lists, quotes, tables, inline and fenced code, links, and the inline set — `strong`, `em`, `u`, `s`, and the `small` a subtext line becomes.

  Three presets cover the surfaces this library renders into: `typeset-docs` for long-form reading, `typeset-chat` for conversation, `typeset-article` for editorial text. `typeset-measure` caps the line length, `not-typeset` takes an island of interface back out of the rhythm, and a table scrolls sideways below the narrow breakpoint rather than widening the page.

  Every selector is wrapped in `:where()`, so a utility class or a component class overrides it without `!important`, and the whole stylesheet is written in logical properties, so `dir="rtl"` is the entire RTL story.

  `newtui add typeset` appends the stylesheet and writes a thin `Typeset` wrapper for React or Vue; the plain flavour is the two class names on their own.

### Patch Changes

- c7e6a09: Align the application registry and CLI source layouts with the current shadcn
  React and Vue repositories while preserving legacy registry import rewrites.
- 88af7f0: `init` and `add` now resolve a Nuxt project's write paths under `app/` when the project uses Nuxt 4's source root, instead of always guessing `src/` or the project root.

  Detection checks, in order: an explicit `srcDir` in the target's `nuxt.config`, what already exists on disk (`app/` wins over `src/`), then — for a brand-new project with neither directory yet — the installed (or opted-in, via `future.compatibilityVersion: 4`) Nuxt major. A plain Nuxt 3 project keeps resolving at the root, as before. `DEFAULT_TAILWIND_CSS` is now keyed by bundler (`nuxt`/`vite`) instead of framework, so a fresh Vite Vue project with no existing stylesheet no longer falls back to a Nuxt-shaped default path.

## 2.1.0

### Minor Changes

- 06f4a30: Rework the Discord-inspired components against the wolfstar.rocks originals, and add an opt-in light surface set.

  Tokens: new `--newt-bg-input-elevated`, `--newt-mention-text`, `--newt-mention-role` and `--newt-embed-max-width`; a `.newt-light` / `[data-newt-theme="light"]` block overrides the surfaces, text, status and shadow tokens for light backgrounds. The mention/badge/timeline/reaction/slash-command hex values that duplicated `#b3baff` and `#f3b95f` now read the tokens.

  Components:

  - `Mention` renders a real button with focus styles, gains an optional avatar, an `app` variant and a `color` prop for role mentions.
  - `Button` gains `emoji` and the link-out glyph (`launchIcon`, on by default for `variant="link"`).
  - `Embed` gains an accent `color`, an author row, a footer icon, a middle-dot separator and a `<time>` timestamp.
  - `MemberList` gains role sections with headings, an offline state, coloured names and the APP tag (with the verified check).
  - `ReplyPreview` gains an avatar, a "used" action and a slash-command chip; the spine is now driven by custom properties.
  - `MessageGroup` gains a reply grid layout, an ephemeral state with its notice, the verified bot tag, and renders the timestamp as `<time>`.
  - `Divider` gains `spacing` and `line`.
  - `ScrollArea` gains `focusable` and `viewportLabel`.
  - `SlashCommand` now takes the full invocation: subcommand path plus typed options, including the focused one.
  - `SelectMenu` is now a complete combobox: trigger, keyboard-driven listbox, portalled panel that flips when space runs out.

  New components: `InlineCode`, `ActionRow`, `MessageList`, `MessageComposer`, `Chat`, `Invite`, `ChannelHeader`, `ChannelWelcome`, `ChannelInfo`, `SlashCommandSuggestions`, `V2Container` and `AppLauncher`, plus a `ReactionGroup` part on `Reaction`.

## 2.0.0

### Major Changes

- 546bd96: Unify the two CLIs into a single unscoped `newtui` package, and add `framework` to registry items.

  `@newtui/react` and `@newtui/vue` were the same CLI twice, differing only in the paths they wrote and the registry they read. They are now one package, `newtui`, which decides between React and Vue from `framework` in `components.json`:

  ```bash
  npx newtui init          # detects React or Vue, or pass --framework react|vue
  npx newtui add button
  ```

  Both scoped packages still install and still work — each now ships a wrapper that prints a deprecation notice and forwards to `newtui`. They are removed in the next major.

  An existing `components.json` needs no changes. It is migrated on read:

  - the old Vue `framework: "nuxt" | "vite"` becomes `bundler`, and `framework` becomes `"vue"`
  - the old React `tsx` is read as `typescript`
  - a config with neither field is matched to a framework by the aliases it declares

  Registry items now carry `framework: "react" | "vue"`, stamped by each app's registry build and validated by `registryItemSchema`, so a single item JSON says which framework it targets. The two registries keep their existing urls (`/r` and `/vue/r`), so nothing consuming them has to change.
