---
"newtui": minor
---

`message-composer` takes a field of your own, more slots and a narrow phone layout. Add the item again to get the changes.

- `renderInput` (React) and the `#input` slot (Vue) replace the built-in input. They receive `value`, `setValue`, `submit`, `disabled` and `inputProps`. Spread `inputProps` on your field to keep the label, the combobox attributes and the keyboard handling. Enter still submits, and the send button still follows the value.
- `leading` (`#leading` in Vue) renders controls after the add button, before the field.
- `showAdd` removes the add button when it is `false`. It defaults to `true`.
- `trailing` (`#trailing` in Vue) takes the place of the send button while the value is empty.
- `disabled` turns off the input, the add button and the send button.
- `layout="narrow"` is the phone layout: no frame, a pill field and round buttons. The HTML flavour adds `newt-composer--narrow` and `newt-composer__button--narrow`.
- `messageComposerButtonVariants` is exported. Give it to a button you add, so it matches the built-in icon buttons. The item now installs `class-variance-authority`.

One thing changes for existing code. The `actions` slot now renders inside the field, at its end. The bar looks the same. If your styles select the field by its position, remove them and use `renderInput` or `#input` instead.
