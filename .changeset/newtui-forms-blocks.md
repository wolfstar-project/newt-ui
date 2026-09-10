---
"newtui": minor
---

Give `form-fields` a validation state, and add three composed blocks.

`Field` takes `invalid`, and the controls inside read it from the wrapper — so a form library that only knows "this field failed" says it in one place rather than per control. `FieldHelp` takes `variant="error"`, which colours the message and gives it `role="alert"`, because a validation message that appears after a failed submit is useless to a reader who is not looking at that part of the page. The same state exists in the plain HTML build as `.newt-field[data-invalid]` and `.newt-field__help--error`.

Three new `registry:block` items, installed like any other component and composed entirely from ones that already exist:

- `chat-window` — a whole channel view: header, scrolling message list and composer.
- `server-sidebar` — the column beside it: the server banner, the voice channel and the grouped member list.
- `command-panel` — a keyboard-selectable command list paired with the selected command's option card.

The registry generator and public indexes now understand blocks, which live under `block/` and declare their own file lists rather than being named after a single file. Multi-file Vue blocks install into their own component directory.
