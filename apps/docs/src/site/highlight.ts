import {
  createHighlighterCore,
  type HighlighterCore,
  type ThemedToken,
  type ThemeRegistrationRaw,
} from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

const LANGS = ["bash", "typescript", "tsx", "html"] as const
export type Lang = (typeof LANGS)[number]

const THEME_NAME = "newt"

/*
 * A TextMate theme built from the same hex constants every component reads,
 * so a highlighted import line and the button it imports carry the same
 * colours. Source of truth: packages/newtui/registry/html/tokens.css.
 */
const THEME: ThemeRegistrationRaw = {
  name: THEME_NAME,
  type: "dark",
  fg: "#f2f3f5",
  bg: "#2b2d31",
  settings: [
    { settings: { foreground: "#f2f3f5" } },
    { scope: "comment", settings: { foreground: "#949ba4" } },
    {
      scope: ["string", "string.quoted", "attribute.value"],
      settings: { foreground: "#23a55a" },
    },
    {
      scope: ["constant.numeric", "constant.language", "support.constant"],
      settings: { foreground: "#f0b232" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
      ],
      settings: { foreground: "#5865f2" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#00a8fc" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#5865f2" },
    },
    {
      scope: "entity.other.attribute-name",
      settings: { foreground: "#f0b232" },
    },
    {
      scope: ["variable", "variable.parameter", "variable.other"],
      settings: { foreground: "#f2f3f5" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      settings: { foreground: "#b5bac1" },
    },
  ],
}

let instance: Promise<HighlighterCore> | undefined

/* one highlighter for the whole site: creating it loads the wasm-free regex engine once */
function core(): Promise<HighlighterCore> {
  instance ??= createHighlighterCore({
    themes: [THEME],
    langs: [
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/html.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return instance
}

/** One colour per token, line by line — a caller renders its own `<pre>` around them. */
export async function tokenizeLines(
  code: string,
  lang: Lang
): Promise<readonly (readonly ThemedToken[])[]> {
  const highlighter = await core()
  return highlighter.codeToTokens(code, { lang, theme: THEME_NAME }).tokens
}
