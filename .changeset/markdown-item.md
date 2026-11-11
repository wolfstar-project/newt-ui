---
"newtui": minor
---

New `markdown` item: renders a message written in chat markdown with the library's own parts.

```tsx
<Markdown
  content="**Deploy** done — ping <@1001> in <#2002> ||tomorrow|| at <t:1767225600:t>"
  resolveMention={(kind, id) => names.get(`${kind}:${id}`)}
/>
```

It reads bold, italic, underline, strike, spoilers, inline and fenced code, `#`–`###` headings, `-#` subtext, lists, `>` and `>>>` quotes, links, and the `<@id>`, `<@&id>`, `<#id>`, `</command:id>`, `<:emoji:id>` and `<t:…>` tokens, and renders them as `Mention`, `InlineCode`, `CodeBlock`, `Spoiler`, `CustomEmoji` and `Timestamp`. The source is parsed into a tree, never injected as HTML, and only `http(s)` addresses become links. A masked link (`[text](url)`) shows its address in a dialog before it opens. Mention names and server emoji images come from the `resolveMention` and `resolveEmoji` callbacks; every label can be translated through `labels`. The parser is exported as `markdown-syntax` for code that wants the tree without rendering it.
