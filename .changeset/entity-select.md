---
"newtui": minor
---

New `entity-select` item: the picker for the things a server already knows about — its members, its roles, its channels, or all of them at once.

It is a separate control from the string select rather than a mode of it, because the rows are not strings. A member arrives with a face and sometimes an app tag, a role with a colour and a headcount, a channel with the glyph that says what kind of channel it is. `kind` says which of the four the list is drawn from; it only changes the wording shown when the server has nothing to offer.

`max` above one turns the control into chips: the choices leave the list and sit in the trigger, each with a cross, and every row grows a box instead of a tick — the shape is what says whether picking this one un-picks the last. Backspace removes the chip nearest the caret. At the limit the list stays open and stops taking more rather than silently dropping the oldest choice.

The list is capped at 25, which is what the platform accepts either way, and the panel shows its scrollbar rather than hiding it until the pointer moves: with a capped list the bar is what says there is more below the fold. The panel is portalled so an `overflow: hidden` ancestor cannot clip it, positioned from measured coordinates, and flipped above the control when the space below runs out.

The whole control is one tab stop driven by `aria-activedescendant`, with the arrows, Home, End, Enter, Escape and Backspace all doing what they do everywhere else.
