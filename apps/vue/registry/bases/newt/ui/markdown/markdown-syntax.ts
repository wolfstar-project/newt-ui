/*
 * The chat markdown a message is written in, parsed into a small tree the
 * `Markdown` component renders with the library's own parts: `Mention`,
 * `InlineCode`, `Timestamp`, `Spoiler`, `CodeBlock`, `CustomEmoji`.
 *
 * It is a parser for one dialect, not for CommonMark: single newlines are line
 * breaks, `__` underlines, `||` hides a spoiler, `-#` is subtext, and the
 * angle-bracket tokens (`<@id>`, `<#id>`, `<t:1700000000:R>`) are mentions,
 * channels and timestamps. Anything it does not recognise stays text, and no
 * HTML in the source is ever interpreted — the output is data, not markup.
 *
 * This file is framework-free and shipped byte-for-byte in both the React and
 * the Vue registry, so the two renderers read the same tree.
 */

/** The letters a `<t:…:X>` token takes, mapped to `Timestamp` formats. */
export const TIMESTAMP_FORMATS = {
  t: "shortTime",
  T: "longTime",
  d: "shortDate",
  D: "longDate",
  f: "shortDateTime",
  F: "longDateTime",
  R: "relative",
} as const

export type TimestampLetter = keyof typeof TIMESTAMP_FORMATS

export type MarkdownMentionKind = "user" | "role" | "channel"

export type MarkdownInline =
  | { type: "text"; content: string }
  | { type: "br" }
  | {
      type: "strong" | "em" | "underline" | "strike" | "spoiler"
      children: MarkdownInline[]
    }
  | { type: "code"; content: string }
  | {
      type: "link"
      url: string
      /** `[label](url)`: the visible text is not the address. */
      masked: boolean
      children: MarkdownInline[]
    }
  | { type: "mention"; kind: MarkdownMentionKind; id: string }
  | { type: "everyone"; name: "everyone" | "here" }
  | { type: "command"; name: string; id: string }
  | { type: "emoji"; name: string; id: string; animated: boolean }
  | {
      type: "timestamp"
      /** Seconds since the epoch, as the token writes it. */
      value: number
      format: (typeof TIMESTAMP_FORMATS)[TimestampLetter]
    }

export interface MarkdownListItem {
  children: MarkdownInline[]
}

export type MarkdownBlock =
  | { type: "paragraph"; children: MarkdownInline[] }
  | { type: "heading"; level: 1 | 2 | 3; children: MarkdownInline[] }
  | { type: "subtext"; children: MarkdownInline[] }
  | { type: "quote"; children: MarkdownBlock[] }
  | {
      type: "list"
      ordered: boolean
      /** The first number of an ordered list. */
      start: number
      items: MarkdownListItem[]
    }
  | { type: "codeBlock"; language?: string; content: string }

/* ------------------------------------------------------------------------ */
/* Inline                                                                    */
/* ------------------------------------------------------------------------ */

interface InlineContext {
  /** Inside a link label: no nested links, no bare URLs. */
  inLink: boolean
}

interface InlineRule {
  /** Sticky, so `exec` only matches at `lastIndex`. */
  pattern: RegExp
  /** Characters a match can start with; a cheap filter before the regex. */
  starts: string
  /** Reject a match by the character before it (`snake_case` is not italic). */
  after?: (previous: string | undefined) => boolean
  parse: (
    match: RegExpExecArray,
    context: InlineContext
  ) => MarkdownInline | null
}

const WORD = /[\p{L}\p{N}_]/u

function isNotWord(previous: string | undefined): boolean {
  return previous === undefined || !WORD.test(previous)
}

function group(match: RegExpExecArray, index: number): string {
  return match[index] ?? ""
}

function wrap(
  type: "strong" | "em" | "underline" | "strike" | "spoiler"
): InlineRule["parse"] {
  return (match, context) => {
    const inner = group(match, 1)
    if (inner.trim().length === 0) return null
    return { type, children: parseInline(inner, context) }
  }
}

/*
 * Order matters where two rules share a start: `**` before `*`, `__` before
 * `_`, the double-backtick code span before the single one, and a role
 * mention (`<@&`) before a user mention (`<@`).
 */
const INLINE_RULES: readonly InlineRule[] = [
  {
    pattern: /\\([^\p{L}\p{N}\s])/uy,
    starts: "\\",
    parse: (match) => ({ type: "text", content: group(match, 1) }),
  },
  {
    pattern: /``(?: (?=\S))?([^]+?)(?: )?``/y,
    starts: "`",
    parse: (match) => ({ type: "code", content: group(match, 1) }),
  },
  {
    pattern: /`([^`]+)`/y,
    starts: "`",
    parse: (match) => ({ type: "code", content: group(match, 1) }),
  },
  {
    pattern: /<(a?):(\w{2,32}):(\d+)>/y,
    starts: "<",
    parse: (match) => ({
      type: "emoji",
      animated: group(match, 1) === "a",
      name: group(match, 2),
      id: group(match, 3),
    }),
  },
  {
    pattern: /<t:(-?\d{1,13})(?::([tTdDfFR]))?>/y,
    starts: "<",
    parse: (match) => {
      const letter = match[2] ?? "f"
      const format =
        Object.entries(TIMESTAMP_FORMATS).find(
          ([key]) => key === letter
        )?.[1] ?? TIMESTAMP_FORMATS.f
      return {
        type: "timestamp",
        value: Number(group(match, 1)),
        format,
      }
    },
  },
  {
    pattern: /<@&([^<>\s]+)>/y,
    starts: "<",
    parse: (match) => ({ type: "mention", kind: "role", id: group(match, 1) }),
  },
  {
    pattern: /<@!?([^<>\s&!][^<>\s]*)>/y,
    starts: "<",
    parse: (match) => ({ type: "mention", kind: "user", id: group(match, 1) }),
  },
  {
    pattern: /<#([^<>\s]+)>/y,
    starts: "<",
    parse: (match) => ({
      type: "mention",
      kind: "channel",
      id: group(match, 1),
    }),
  },
  {
    pattern: /<\/([\p{L}\p{N}_-]+(?: [\p{L}\p{N}_-]+){0,2}):(\d+)>/uy,
    starts: "<",
    parse: (match) => ({
      type: "command",
      name: group(match, 1),
      id: group(match, 2),
    }),
  },
  {
    pattern: /<(https?:\/\/[^\s<>]+)>/y,
    starts: "<",
    parse: (match, context) =>
      context.inLink
        ? null
        : {
            type: "link",
            url: group(match, 1),
            masked: false,
            children: [{ type: "text", content: group(match, 1) }],
          },
  },
  {
    pattern:
      /\[((?:\\.|[^[\]\\\n])+)\]\(\s*<?(https?:\/\/[^\s<>()]+(?:\([^\s<>()]*\)[^\s<>()]*)*)>?\s*\)/y,
    starts: "[",
    parse: (match, context) =>
      context.inLink
        ? null
        : {
            type: "link",
            url: group(match, 2),
            masked: true,
            children: parseInline(group(match, 1), { inLink: true }),
          },
  },
  {
    /* stops before trailing punctuation, which belongs to the sentence */
    pattern: /https?:\/\/[^\s<]*[^\s<.,:;"'!?)\]]/y,
    starts: "h",
    after: isNotWord,
    parse: (match, context) =>
      context.inLink
        ? null
        : {
            type: "link",
            url: match[0],
            masked: false,
            children: [{ type: "text", content: match[0] }],
          },
  },
  {
    pattern: /\|\|([^]+?)\|\|/y,
    starts: "|",
    parse: wrap("spoiler"),
  },
  {
    pattern: /\*\*([^]+?)\*\*(?!\*)/y,
    starts: "*",
    parse: wrap("strong"),
  },
  {
    pattern: /__([^]+?)__(?!_)/y,
    starts: "_",
    parse: wrap("underline"),
  },
  {
    pattern: /\*(?!\s)((?:\*\*[^]+?\*\*|[^*])+?)\*(?!\*)/y,
    starts: "*",
    parse: wrap("em"),
  },
  {
    pattern: /_((?:__[^]+?__|[^_])+?)_(?![\p{L}\p{N}_])/uy,
    starts: "_",
    after: isNotWord,
    parse: wrap("em"),
  },
  {
    pattern: /~~([^]+?)~~/y,
    starts: "~",
    parse: wrap("strike"),
  },
  {
    pattern: /@(everyone|here)(?![\p{L}\p{N}_])/uy,
    starts: "@",
    parse: (match) => ({
      type: "everyone",
      name: group(match, 1) === "here" ? "here" : "everyone",
    }),
  },
  {
    pattern: /\n/y,
    starts: "\n",
    parse: () => ({ type: "br" }),
  },
]

const RULE_STARTS = new Set(INLINE_RULES.map((rule) => rule.starts))

/** Parse the inline content of one block: formatting, links, mentions. */
export function parseInline(
  source: string,
  context: InlineContext = { inLink: false }
): MarkdownInline[] {
  const nodes: MarkdownInline[] = []
  let text = ""
  const flush = () => {
    if (text.length > 0) nodes.push({ type: "text", content: text })
    text = ""
  }

  let index = 0
  while (index < source.length) {
    const char = source[index] ?? ""
    let node: MarkdownInline | null = null
    let length = 0
    if (RULE_STARTS.has(char)) {
      for (const rule of INLINE_RULES) {
        if (rule.starts !== char) continue
        if (rule.after && !rule.after(source[index - 1])) continue
        rule.pattern.lastIndex = index
        const match = rule.pattern.exec(source)
        if (!match) continue
        node = rule.parse(match, context)
        if (node) {
          length = match[0].length
          break
        }
      }
    }
    if (node) {
      // An escape is text: let it join the run around it.
      if (node.type === "text") text += node.content
      else {
        flush()
        nodes.push(node)
      }
      index += length
    } else {
      text += char
      index += 1
    }
  }
  flush()
  return nodes
}

/* ------------------------------------------------------------------------ */
/* Blocks                                                                    */
/* ------------------------------------------------------------------------ */

/*
 * A fence may open and close on one line or span many. The language is the
 * word right after the opening fence, and only when a newline follows it —
 * "```js```" is a block that says `js`.
 */
const FENCE = /^```(?:([\w+#.-]+)[^\S\n]*\n|[^\S\n]*\n)?([^]*?)```[^\S\n]*\n?/
const HEADING = /^(#{1,3}) +(\S.*)$/
const SUBTEXT = /^-# +(\S.*)$/
const QUOTE_LINE = /^> (.*)$|^>$/
const QUOTE_REST = /^>>> /
const LIST_ITEM = /^\s*(?:([-*])|(\d{1,9})\.) +(\S.*)$/

function headingLevel(marks: number | undefined): 1 | 2 | 3 {
  if (marks === 3) return 3
  if (marks === 2) return 2
  return 1
}

interface BlockContext {
  /** Quotes do not nest: a `>` inside a quote is text. */
  inQuote: boolean
}

/** Strip the blank lines around a paragraph and drop it if nothing is left. */
function paragraph(lines: string[]): MarkdownBlock | null {
  const body = lines.join("\n").replace(/^\n+|\n+$/g, "")
  if (body.trim().length === 0) return null
  return { type: "paragraph", children: parseInline(body) }
}

/** Parse a whole message into blocks. */
export function parseMarkdown(
  source: string,
  context: BlockContext = { inQuote: false }
): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  let pending: string[] = []
  const flush = () => {
    const block = paragraph(pending)
    if (block) blocks.push(block)
    pending = []
  }

  let rest = source.replace(/\r\n?/g, "\n")
  /** The current line, without its newline. */
  const peek = () => {
    const end = rest.indexOf("\n")
    return end === -1 ? rest : rest.slice(0, end)
  }
  /** Drop the current line, newline included. */
  const advance = () => {
    const end = rest.indexOf("\n")
    rest = end === -1 ? "" : rest.slice(end + 1)
  }

  while (rest.length > 0) {
    const fence = FENCE.exec(rest)
    if (fence) {
      flush()
      blocks.push({
        type: "codeBlock",
        language: fence[1]?.toLowerCase(),
        content: (fence[2] ?? "").replace(/\n$/, ""),
      })
      rest = rest.slice(fence[0].length)
      continue
    }

    const line = peek()

    if (!context.inQuote) {
      // `>>> ` quotes everything after it, to the end of the message.
      if (QUOTE_REST.test(rest)) {
        flush()
        blocks.push({
          type: "quote",
          children: parseMarkdown(rest.slice(4), { inQuote: true }),
        })
        rest = ""
        break
      }
      if (QUOTE_LINE.test(line)) {
        flush()
        const quoted: string[] = []
        while (rest.length > 0) {
          const match = QUOTE_LINE.exec(peek())
          if (!match) break
          quoted.push(match[1] ?? "")
          advance()
        }
        blocks.push({
          type: "quote",
          children: parseMarkdown(quoted.join("\n"), { inQuote: true }),
        })
        continue
      }
    }

    const heading = HEADING.exec(line)
    if (heading) {
      flush()
      blocks.push({
        type: "heading",
        level: headingLevel(heading[1]?.length),
        children: parseInline(heading[2] ?? ""),
      })
      advance()
      continue
    }

    const subtext = SUBTEXT.exec(line)
    if (subtext) {
      flush()
      blocks.push({ type: "subtext", children: parseInline(subtext[1] ?? "") })
      advance()
      continue
    }

    const item = LIST_ITEM.exec(line)
    if (item) {
      flush()
      const ordered = item[2] !== undefined
      const items: MarkdownListItem[] = []
      while (rest.length > 0) {
        const next = LIST_ITEM.exec(peek())
        if (!next || (next[2] !== undefined) !== ordered) break
        items.push({ children: parseInline(next[3] ?? "") })
        advance()
      }
      blocks.push({
        type: "list",
        ordered,
        start: ordered ? Number(item[2]) : 1,
        items,
      })
      continue
    }

    // A fence that opens mid-line still starts a block, as in the client.
    const inlineFence = line.indexOf("```")
    if (inlineFence > 0 && FENCE.test(rest.slice(inlineFence))) {
      pending.push(line.slice(0, inlineFence))
      flush()
      rest = rest.slice(inlineFence)
      continue
    }

    pending.push(line)
    advance()
  }
  flush()
  return blocks
}

/**
 * Whether a message is nothing but emoji — custom ones, or a few characters
 * of Unicode pictographs — which the client renders large.
 */
export function isEmojiOnly(blocks: readonly MarkdownBlock[]): boolean {
  if (blocks.length !== 1) return false
  const [block] = blocks
  if (block?.type !== "paragraph") return false
  let count = 0
  for (const node of block.children) {
    if (node.type === "emoji") count += 1
    else if (node.type === "text") {
      const stripped = node.content.replace(/\s+/g, "")
      if (stripped.length === 0) continue
      if (
        !/^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️)+$/u.test(
          stripped
        )
      ) {
        return false
      }
      count += [...stripped.matchAll(/\p{Extended_Pictographic}/gu)].length
    } else return false
  }
  return count > 0 && count <= 30
}
