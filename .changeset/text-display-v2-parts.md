---
"newtui": minor
---

A new `text-display` item, and message parts that follow what a Components V2 message sends. Add the changed items again to get the changes.

- `text-display` is a block of message text. It keeps the line breaks of its string (`white-space: pre-line`). `size` takes `heading-1`, `heading-2`, `heading-3` and `subtext`, the `#`, `##`, `###` and `-#` sizes of the `Markdown` component. `as` picks the element, so `as="h3"` makes a heading size a real heading. The HTML flavour is `newt-text-display` with `--heading-1`, `--heading-2`, `--heading-3` and `--subtext`.
- `Divider` takes `spacing="small"` (4px) and `spacing="large"` (8px), the two steps of a V2 separator. `sm`, `md` and `lg` still work. The HTML flavour adds `newt-divider--small` and `newt-divider--large`.
- `Button` takes content before and after the label: the `leading` and `trailing` props in React, the `#leading` and `#trailing` slots in Vue, and `newt-btn__leading` and `newt-btn__trailing` in the HTML flavour. Each sits in its own box, so an icon component or a unicode emoji gets the gap. The `emoji` image URL prop still works.
- `Button` takes `size="message"`, 32px high, for a button in a message. The HTML flavour adds `newt-btn--message`.
- `Reaction` draws its emoji from its children in React and from its default slot in Vue, for an icon or an image component. The slot wins over `emoji` and `emojiSrc`. Set `emojiAlt` to name it. `formatLabel` still builds the accessible name. The HTML flavour adds `newt-reaction__emoji`.
- `InviteName` takes `as`, as `Button` does. Pass `NuxtLink`, `RouterLink` or another link component to keep client navigation.
- `EmbedAuthorIcon`, `EmbedFooterIcon`, `InviteIcon`, `MediaGalleryItem` and `SectionThumbnail` take `as`, so you can pass an image component such as `NuxtImg`. The spoiler of `MediaGalleryItem` and `SectionThumbnail` still works with it.

Three things change for existing code.

- An `Embed` with no `color` draws its bar in `--newt-border`, the same neutral default as `V2Container`. It used `--newt-brand` before. Pass `color="var(--newt-brand)"` to keep the old bar. An explicit `color` works as before.
- `SectionThumbnail` is 85px square. It was 86px.
- A `Button` with no label renders no label box, so an emoji-only button has no extra gap after the emoji.
