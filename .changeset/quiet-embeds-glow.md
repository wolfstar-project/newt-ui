---
"newtui": patch
---

The embed sits on a translucent surface with a hairline outline and a straight accent bar, so it stands out on any background instead of matching `--newt-bg-elevated`. Two new tokens with light and dark values carry it: `--newt-embed-bg` and `--newt-embed-border`. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the two variables by hand.
