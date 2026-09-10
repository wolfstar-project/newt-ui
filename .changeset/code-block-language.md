---
"newtui": minor
---

`CodeBlock` colours its own source. Give it a `language` and the code, and the four colours it has — comment, string, keyword, call — are applied by a scanner that ships inside the component:

```tsx
<CodeBlock language="ts">{`// example
const greet = (name: string) => \`hello ${name}\`

greet("world")`}</CodeBlock>
```

Before this, every coloured run had to be placed by hand as a `CodeToken`, with the spaces and newlines between them written as JSX expressions to survive the whitespace rules. That is still available — `CodeToken` is exported, and children are rendered untouched when no `language` is given — but it is now the exception rather than the only way in.

`language` accepts `ts`, `tsx`, `js`, `jsx`, `json`, `bash` and `sh`. The scanner is four answers, not a parse tree: six lines of code in a chat message should not drag a highlighter and a grammar in behind them. What it reads badly stays plain rather than wrong, and anything needing real grammar — a diff, a language not on that list, semantic colours — produces its own runs and passes them as `tokens`, an array of `{ text, kind? }`. `tokenizeCode` is exported for callers that want the runs without the markup.

In Vue the source goes through the `code` prop, since a template collapses the newlines out of slot text.

The plain HTML flavour is unchanged: it has no scanner to run, and its spans are the highlighting.
