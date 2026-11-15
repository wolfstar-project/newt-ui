---
"newtui": minor
---

Every name and text a component writes itself now comes from a prop. English stays the default, so nothing changes until you pass a translation. Add the changed items again to get the new props. The new [Translating labels](https://newtui.dev/docs/translating-labels) page lists every prop and its English default.

- `MessageComposer` takes `labels`: `group`, `placeholder`, `add` and `send`. `group` and `placeholder` are functions of the channel name. `defaultMessageComposerLabels` holds the English text.
- `SlashCommand` takes `formatLabel`, which builds the chip's name from the command path and the options. `defaultSlashCommandLabel` is the English default.
- `AppLauncherItem` takes `promotedLabel` for the `Promoted` badge.
- `MemberListAppTag` and `MessageGroupBotTag` take `label` and `verifiedLabel`. An `aria-label` on `MessageGroupBotTag` still wins.
- `SectionThumbnail` and `MediaGalleryItem` take `spoilerLabel`.
- `EmbedTimestamp` takes `locale`, `timeZone` and `formatter`. `formatter` wins over the other two. `locale` defaults to `en-US`, as before. Pass a fixed locale, so the server and the browser write the same text.
- `ThreadPreviewCount` takes `formatCount`. `PinInput` takes `formatCellLabel` for the name of each box.
- `PermissionStates` takes `labels` with `deny`, `inherit` and `allow`.
- `EntitySelect` takes `emptyLabel`. `FileUpload` takes `prompt` and `browseLabel`.
- `ExpressionsPicker` takes `labels` for every name and text it writes. `defaultExpressionsPickerLabels` holds the English text.
- In the HTML flavour, `tag-input.js` reads `data-newt-remove-label` from the field, with `{tag}` for the chip's text. `token-field.js` reads `data-newt-reveal-label`, `data-newt-hide-label` and `data-newt-copied-label`. `expressions-picker.js` reads a `labels` object from its JSON data.

One thing changes for existing code. In Vue, `expressionKinds` is now a list of kinds, and the entries of `skinTones` no longer carry a `label`. Read the names from `defaultExpressionsPickerLabels` instead.
