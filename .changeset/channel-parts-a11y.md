---
"newtui": minor
---

`channel-header`, `channel-info` and `channel-welcome` gain a decorative form for their actions, a narrow header layout and real dialog behaviour. Add the items again to get the changes.

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
