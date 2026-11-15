---
"newtui": minor
---

`message-group`, `reply-preview` and `message-list` now draw a reply close to the message it answers. Add the three items again to get the changes.

- With `withReply`, the reply line sits 2px above the body of the message. It sat 20px above before. A `ReplyPreview` inside `MessageGroupReply` has no margin and no start padding.
- The spine of the preview starts above the centre of the avatar and stops 4px before the preview. `MessageGroup` publishes `--newt-message-group-avatar-size` (`40px`) and `--newt-message-group-gap` (`16px`), and the preview reads both. Set them on the row when the avatar has another size. Outside a group, the preview keeps its own elbow.
- `ReplyPreviewCommand` takes an icon: the `icon` prop in React, the `#icon` slot in Vue, and the class `newt-reply__command-icon` in the HTML flavour. The icon sits before the truncating label, so the gap of the chip applies. The chip sizes an `svg` to 12px.
- The new token `--newt-text-message` (`#dbdee1` dark, `#313338` light) is the colour of message text. `MessageGroup` sets it on the row, and `MessageGroupContent` has no colour of its own. A colour class on the row now changes the text colour of the message.
- `MessageList` pads every row inside it. A row inside a wrapper keeps its padding, also when the wrapper is `display: contents`.

Four things change for existing code. Message text is brighter on dark surfaces and darker on light surfaces. Text in a row that sets no colour takes the colour of the row. A margin or start padding class on a `ReplyPreview` inside a group no longer applies, so change the distance with a `gap-y-*` class on the row. If you drew your own spine, remove it. If you set a `gap-*` class on the row, set `--newt-message-group-gap` in its place so the spine follows.

`newtui init` leaves a stylesheet that already holds the tokens untouched. If you keep your token file by hand, add `--newt-text-message` to both themes. Without the token, the row falls back to `--newt-text-secondary`, so message text keeps the colour it had. The `text-newt-text-message` utility needs the token in your Tailwind theme: `--color-newt-text-message: var(--newt-text-message)` in `@theme` on Tailwind v4, or `"text-message": "var(--newt-text-message)"` in the `newt` colours on v3. The components do not use that utility, so they work without it.
