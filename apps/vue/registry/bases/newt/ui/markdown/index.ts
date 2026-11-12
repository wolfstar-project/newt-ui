import type { InjectionKey } from "vue"

import type { MarkdownMentionKind } from "./markdown-syntax"

export { default as Markdown } from "./Markdown.vue"
export {
  isEmojiOnly,
  parseInline,
  parseMarkdown,
  type MarkdownBlock,
  type MarkdownInline,
  type MarkdownMentionKind,
} from "./markdown-syntax"

/** What a mention id resolves to: the name to show, and a role's colour. */
export interface MarkdownMentionTarget {
  name: string
  /** Role colour, any CSS colour. */
  color?: string
  /** User avatar URL. */
  avatar?: string
}

/** The words the renderer writes itself. Pass a translation for any of them. */
export interface MarkdownLabels {
  /** Shown for a mention the resolver does not know. */
  unknownUser: string
  unknownRole: string
  unknownChannel: string
  /** Title of the warning before a masked link opens. */
  linkWarningTitle: string
  /** Text above the address in that warning. */
  linkWarningBody: string
  linkWarningCancel: string
  linkWarningConfirm: string
  /** Accessible name of a hidden spoiler, read in place of its content. */
  spoiler: string
}

export const defaultMarkdownLabels: MarkdownLabels = {
  unknownUser: "unknown-user",
  unknownRole: "unknown-role",
  unknownChannel: "unknown-channel",
  linkWarningTitle: "Leaving this page",
  linkWarningBody: "This link's text does not show where it goes. It opens:",
  linkWarningCancel: "Go back",
  linkWarningConfirm: "Visit site",
  spoiler: "Spoiler, click to reveal",
}

export type MarkdownResolveMention = (
  kind: MarkdownMentionKind,
  id: string
) => MarkdownMentionTarget | undefined

export type MarkdownResolveEmoji = (emoji: {
  id: string
  name: string
  animated: boolean
}) => string | undefined

/** Everything the recursive parts need from the `Markdown` that holds them. */
export interface MarkdownContext {
  resolveMention?: MarkdownResolveMention
  resolveEmoji?: MarkdownResolveEmoji
  mentionsInteractive: boolean
  onMentionClick: (mention: { kind: MarkdownMentionKind; id: string }) => void
  headingOffset: number
  locale?: string
  labels: MarkdownLabels
  jumbo: boolean
  /** Called for a masked link click; returns whether it took the click. */
  interceptLink: (url: string, masked: boolean) => boolean
}

export const MARKDOWN_CONTEXT_KEY: InjectionKey<() => MarkdownContext> =
  Symbol("newt-markdown")

/** The name a mention shows: resolved, written as a name, or unknown. */
export function mentionTarget(
  context: MarkdownContext,
  kind: MarkdownMentionKind,
  id: string
): MarkdownMentionTarget {
  const resolved = context.resolveMention?.(kind, id)
  if (resolved) return resolved
  if (!/^\d+$/.test(id)) return { name: id }
  const unknown = {
    user: context.labels.unknownUser,
    role: context.labels.unknownRole,
    channel: context.labels.unknownChannel,
  }
  return { name: unknown[kind] }
}

export const MENTION_PREFIX = { user: "@", role: "@", channel: "#" } as const

/* The languages `CodeBlock` colours; anything else renders as plain text. */
export const HIGHLIGHTED_LANGUAGES: ReadonlySet<string> = new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "bash",
  "sh",
])

export const HEADING_SIZES = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-base",
} as const
