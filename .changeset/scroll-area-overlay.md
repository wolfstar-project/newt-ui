---
"newtui": minor
---

`scrollbar` gains an overlay thumb, auto-hide and a focus ring. `ScrollArea` takes `variant="overlay"`, which draws the thumb over the content so the box keeps its full width. `--newt-scrollbar-inset-start` and `--newt-scrollbar-inset-end` move the ends of the track, and `--newt-scrollbar-thumb-width` and `--newt-scrollbar-thumb-max-height` size the thumb. `autoHide` shows the thumb only on hover, on keyboard focus and while the area scrolls. `scrollbarAutoHideClassName` does the same for an element of your own. The thumb colour reads `--newt-scrollbar-thumb` and `--newt-scrollbar-thumb-hover`, and falls back to the colours it had.

Three things change for existing code. A `focusable` viewport now draws its focus ring inside its box, where an `overflow: hidden` ancestor cannot clip it. The body of `app-launcher` and the list of `slash-command-suggestions` use the styled scrollbar, so both items now install `scrollbar`. The React `scrollbar` file is now a client component. The default variant is `native`, so the scrollbar itself looks as it did. In the HTML distribution, the overlay thumb needs the new `scrollbar.js` and a `data-newt-scrollbar` attribute. Add the item again to get the new files.
