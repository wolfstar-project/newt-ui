---
"newtui": minor
---

`member-list`, `status-indicator`, `avatar`, `tabs` and `reply-preview` gain new sizes, an interactive row and a defined list structure. Add the items again to get the changes.

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
