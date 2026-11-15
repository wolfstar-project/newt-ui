---
"newtui": minor
---

`select-menu` can now draw a select as it appears under a message. Add the item again to get the changes.

- `side` and `align` place the panel. `side="top"` opens it above the trigger, and it still flips when that side has no room. In the HTML flavour, set `data-side="top"` on the root and `data-align` on the panel.
- `triggerClassName` and `contentClassName` (`triggerClass` and `contentClass` in Vue) merge classes onto the trigger and the panel. Both parts carry a `data-slot`: `select-menu-trigger` and `select-menu-content`.
- An option takes `emoji`, a unicode character drawn where the icon would be. `icon` wins when an option has both.
- `renderItem` (React) and the `#item` slot (Vue) draw the content of a row. `renderItemDescription` and `#item-description` draw only the description. A row drawn with `renderItem` or `#item` names its option with all of its text.
- The trigger has `tabindex="-1"` while the list is open, so an axe audit no longer reports it under `aria-hidden-focus`. Focus still returns to it on close. The other focusable elements of the page can still be reported; the docs page says why.
- In the HTML flavour, mark the label of a row with `newt-select-menu__option-label`. The script copies that text to the trigger. A row without the class still gives all of its text, as before. The script also copies the `newt-select-menu__option-emoji` of a row to the trigger.
