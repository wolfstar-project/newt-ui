import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

import {
  isEmojiOnly,
  parseInline,
  parseMarkdown,
} from "../../../www/registry/bases/newt/ui/markdown-syntax"

const root = resolve(import.meta.dirname, "../../../..")

describe("markdown-syntax copies", () => {
  it("ships the same parser in the React and the Vue registry", () => {
    const react = readFileSync(
      resolve(root, "apps/www/registry/bases/newt/ui/markdown-syntax.ts"),
      "utf8"
    )
    const vue = readFileSync(
      resolve(
        root,
        "apps/vue/registry/bases/newt/ui/markdown/markdown-syntax.ts"
      ),
      "utf8"
    )
    expect(vue).toBe(react)
  })
})

describe("parseInline", () => {
  it("reads bold, italic, underline, strike and spoiler, nested", () => {
    expect(
      parseInline("**bold *and italic*** __under__ ~~gone~~ ||hidden||")
    ).toEqual([
      {
        type: "strong",
        children: [
          { type: "text", content: "bold " },
          { type: "em", children: [{ type: "text", content: "and italic" }] },
        ],
      },
      { type: "text", content: " " },
      { type: "underline", children: [{ type: "text", content: "under" }] },
      { type: "text", content: " " },
      { type: "strike", children: [{ type: "text", content: "gone" }] },
      { type: "text", content: " " },
      { type: "spoiler", children: [{ type: "text", content: "hidden" }] },
    ])
  })

  it("leaves snake_case and lone markers as text", () => {
    expect(parseInline("snake_case_name and 2 * 3 * 4")).toEqual([
      { type: "text", content: "snake_case_name and 2 * 3 * 4" },
    ])
  })

  it("keeps code spans literal", () => {
    expect(parseInline("`**not bold**` and ``a ` tick``")).toEqual([
      { type: "code", content: "**not bold**" },
      { type: "text", content: " and " },
      { type: "code", content: "a ` tick" },
    ])
  })

  it("reads mentions, roles, channels, commands, everyone and timestamps", () => {
    expect(
      parseInline(
        "<@123> <@!45> <@&9> <#77> </ban user:88> @here <t:1700000000:R> <t:1700000000>"
      )
    ).toEqual([
      { type: "mention", kind: "user", id: "123" },
      { type: "text", content: " " },
      { type: "mention", kind: "user", id: "45" },
      { type: "text", content: " " },
      { type: "mention", kind: "role", id: "9" },
      { type: "text", content: " " },
      { type: "mention", kind: "channel", id: "77" },
      { type: "text", content: " " },
      { type: "command", name: "ban user", id: "88" },
      { type: "text", content: " " },
      { type: "everyone", name: "here" },
      { type: "text", content: " " },
      { type: "timestamp", value: 1700000000, format: "relative" },
      { type: "text", content: " " },
      { type: "timestamp", value: 1700000000, format: "shortDateTime" },
    ])
  })

  it("reads custom emoji, static and animated", () => {
    expect(parseInline("<:wolf:1> <a:howl:2>")).toEqual([
      { type: "emoji", name: "wolf", id: "1", animated: false },
      { type: "text", content: " " },
      { type: "emoji", name: "howl", id: "2", animated: true },
    ])
  })

  it("reads masked links, angle links and bare URLs without the trailing period", () => {
    expect(
      parseInline(
        "[the **docs**](https://example.com/a) <https://example.com/b> see https://example.com/c."
      )
    ).toEqual([
      {
        type: "link",
        url: "https://example.com/a",
        masked: true,
        children: [
          { type: "text", content: "the " },
          { type: "strong", children: [{ type: "text", content: "docs" }] },
        ],
      },
      { type: "text", content: " " },
      {
        type: "link",
        url: "https://example.com/b",
        masked: false,
        children: [{ type: "text", content: "https://example.com/b" }],
      },
      { type: "text", content: " see " },
      {
        type: "link",
        url: "https://example.com/c",
        masked: false,
        children: [{ type: "text", content: "https://example.com/c" }],
      },
      { type: "text", content: "." },
    ])
  })

  it("never turns a non-http scheme into a link", () => {
    expect(parseInline("[x](javascript:alert(1))")).toEqual([
      { type: "text", content: "[x](javascript:alert(1))" },
    ])
  })

  it("parses an unclosed marker before nested runs in linear time", () => {
    const adversarial = [
      "*a" + "**a**a".repeat(400),
      "_a" + "__a__a".repeat(400),
    ]
    for (const source of adversarial) {
      const started = performance.now()
      parseInline(source)
      expect(performance.now() - started).toBeLessThan(250)
    }
  })

  it("keeps a bold run inside italic text", () => {
    expect(parseInline("*a **b** c*")).toEqual([
      {
        type: "em",
        children: [
          { type: "text", content: "a " },
          { type: "strong", children: [{ type: "text", content: "b" }] },
          { type: "text", content: " c" },
        ],
      },
    ])
  })

  it("leaves a timestamp outside the range of a date as text", () => {
    expect(parseInline("<t:9999999999999:R>")).toEqual([
      { type: "text", content: "<t:9999999999999:R>" },
    ])
    expect(parseInline("<t:8640000000000>")).toEqual([
      { type: "timestamp", value: 8640000000000, format: "shortDateTime" },
    ])
  })

  it("honours backslash escapes and turns newlines into breaks", () => {
    expect(parseInline("\\*not italic\\*\nnext")).toEqual([
      { type: "text", content: "*not italic*" },
      { type: "br" },
      { type: "text", content: "next" },
    ])
  })
})

describe("parseMarkdown", () => {
  it("splits headings, subtext, lists and paragraphs", () => {
    const blocks = parseMarkdown(
      "# Title\nfirst line\nsecond line\n-# small print\n- one\n- two\n3. three\n4. four"
    )
    expect(blocks.map((block) => block.type)).toEqual([
      "heading",
      "paragraph",
      "subtext",
      "list",
      "list",
    ])
    expect(blocks[1]).toEqual({
      type: "paragraph",
      children: [
        { type: "text", content: "first line" },
        { type: "br" },
        { type: "text", content: "second line" },
      ],
    })
    expect(blocks[4]).toMatchObject({ type: "list", ordered: true, start: 3 })
  })

  it("reads fenced code with and without a language", () => {
    expect(parseMarkdown("```ts\nconst a = 1\n```\n```plain```")).toEqual([
      { type: "codeBlock", language: "ts", content: "const a = 1" },
      { type: "codeBlock", language: undefined, content: "plain" },
    ])
  })

  it("does not parse markdown inside a code block", () => {
    expect(parseMarkdown("```\n# not a heading\n**x**\n```")).toEqual([
      {
        type: "codeBlock",
        language: undefined,
        content: "# not a heading\n**x**",
      },
    ])
  })

  it("groups > lines into one quote and lets >>> take the rest", () => {
    expect(parseMarkdown("> a\n> b\nafter")).toEqual([
      {
        type: "quote",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", content: "a" },
              { type: "br" },
              { type: "text", content: "b" },
            ],
          },
        ],
      },
      { type: "paragraph", children: [{ type: "text", content: "after" }] },
    ])
    const rest = parseMarkdown("before\n>>> all\n> of this")
    expect(rest).toHaveLength(2)
    expect(rest[1]).toMatchObject({ type: "quote" })
  })

  it("nests an indented list item under the one above it", () => {
    expect(
      parseMarkdown("- one\n  - one.a\n    1. deep\n  - one.b\n- two")
    ).toEqual([
      {
        type: "list",
        ordered: false,
        start: 1,
        items: [
          {
            children: [{ type: "text", content: "one" }],
            sublist: {
              type: "list",
              ordered: false,
              start: 1,
              items: [
                {
                  children: [{ type: "text", content: "one.a" }],
                  sublist: {
                    type: "list",
                    ordered: true,
                    start: 1,
                    items: [{ children: [{ type: "text", content: "deep" }] }],
                  },
                },
                { children: [{ type: "text", content: "one.b" }] },
              ],
            },
          },
          { children: [{ type: "text", content: "two" }] },
        ],
      },
    ])
  })

  it("keeps the blank lines around a list as empty lines", () => {
    expect(parseMarkdown("intro\n\n- item\n\nafter")).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "text", content: "intro" },
          { type: "br" },
          { type: "br" },
        ],
      },
      {
        type: "list",
        ordered: false,
        start: 1,
        items: [{ children: [{ type: "text", content: "item" }] }],
      },
      {
        type: "paragraph",
        children: [{ type: "br" }, { type: "text", content: "after" }],
      },
    ])
  })

  it("lets a heading take the blank lines after it, and trims the message", () => {
    expect(parseMarkdown("\n\n## Title\n\n\nbody\n\n")).toEqual([
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", content: "Title" }],
      },
      { type: "paragraph", children: [{ type: "text", content: "body" }] },
    ])
  })

  it("reads `_ _` as an empty line, not as text", () => {
    expect(parseMarkdown("top\n_ _\nbottom")).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "text", content: "top" },
          { type: "br" },
          { type: "em", children: [{ type: "text", content: " " }] },
          { type: "br" },
          { type: "text", content: "bottom" },
        ],
      },
    ])
  })

  it("keeps a spoiler of nothing but spaces as text", () => {
    expect(parseInline("|| ||")).toEqual([{ type: "text", content: "|| ||" }])
  })

  it("treats a heading marker without a space as text", () => {
    expect(parseMarkdown("#hashtag")).toEqual([
      { type: "paragraph", children: [{ type: "text", content: "#hashtag" }] },
    ])
  })
})

describe("isEmojiOnly", () => {
  it("is true for a message of emoji and false once there is a word", () => {
    expect(isEmojiOnly(parseMarkdown("<:wolf:1> 🐺"))).toBe(true)
    expect(isEmojiOnly(parseMarkdown("<:wolf:1> hi"))).toBe(false)
    expect(isEmojiOnly(parseMarkdown("100 🔥"))).toBe(false)
    expect(isEmojiOnly(parseMarkdown("1 😀"))).toBe(false)
    expect(isEmojiOnly(parseMarkdown("# 😀"))).toBe(false)
    expect(isEmojiOnly(parseMarkdown("👋🏽 🇮🇹 ❤️"))).toBe(true)
  })
})
