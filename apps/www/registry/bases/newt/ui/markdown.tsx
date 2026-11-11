"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/newt/ui/button"
import {
  CodeBlock,
  type CodeLanguage,
} from "@/registry/bases/newt/ui/code-block"
import { CustomEmoji } from "@/registry/bases/newt/ui/custom-emoji"
import { InlineCode } from "@/registry/bases/newt/ui/inline-code"
import {
  isEmojiOnly,
  parseMarkdown,
  type MarkdownBlock,
  type MarkdownInline,
  type MarkdownMentionKind,
} from "@/registry/bases/newt/ui/markdown-syntax"
import { Mention } from "@/registry/bases/newt/ui/mention"
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/registry/bases/newt/ui/modal"
import { Spoiler } from "@/registry/bases/newt/ui/spoiler"
import { Timestamp } from "@/registry/bases/newt/ui/timestamp"

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
}

export const defaultMarkdownLabels: MarkdownLabels = {
  unknownUser: "unknown-user",
  unknownRole: "unknown-role",
  unknownChannel: "unknown-channel",
  linkWarningTitle: "Leaving this page",
  linkWarningBody: "This link's text does not show where it goes. It opens:",
  linkWarningCancel: "Go back",
  linkWarningConfirm: "Visit site",
}

export interface MarkdownProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "content"
> {
  /** The message source, in chat markdown. */
  content: string
  /**
   * Name (and colour, avatar) for a mention id. Without it, or when it returns
   * nothing, a numeric id shows as `unknown-user` and a name shows as written,
   * so `<@username>` reads as `@username`.
   */
  resolveMention?: (
    kind: MarkdownMentionKind,
    id: string
  ) => MarkdownMentionTarget | undefined
  /**
   * Image URL for a server emoji. Without it, or when it returns nothing, the
   * emoji shows as its `:name:` text — newt/ui never fetches one by itself.
   */
  resolveEmoji?: (emoji: {
    id: string
    name: string
    animated: boolean
  }) => string | undefined
  /**
   * Makes mentions buttons and calls this when one is pressed. Without it
   * they are read-only text, out of the tab order.
   */
  onMentionClick?: (mention: { kind: MarkdownMentionKind; id: string }) => void
  /**
   * Added to a heading's level to pick its element: `#` with the default 2
   * is an `<h3>`, so a message never outranks the page around it.
   */
  headingOffset?: number
  /** Locale for timestamps. Defaults to the reader's. */
  locale?: string
  /**
   * Ask before opening a masked link (`[text](url)`), whose text hides its
   * address. On by default.
   */
  linkWarning?: boolean
  labels?: Partial<MarkdownLabels>
}

/* The languages `CodeBlock` colours; anything else renders as plain text. */
const HIGHLIGHTED = new Set<string>([
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "bash",
  "sh",
])

function isHighlighted(language: string | undefined): language is CodeLanguage {
  return language !== undefined && HIGHLIGHTED.has(language)
}

const MENTION_PREFIX = { user: "@", role: "@", channel: "#" } as const

interface RenderContext {
  props: MarkdownProps
  labels: MarkdownLabels
  jumbo: boolean
  openWarning: (url: string) => void
}

function mentionName(
  context: RenderContext,
  kind: MarkdownMentionKind,
  id: string
): MarkdownMentionTarget {
  const resolved = context.props.resolveMention?.(kind, id)
  if (resolved) return resolved
  if (!/^\d+$/.test(id)) return { name: id }
  const unknown = {
    user: context.labels.unknownUser,
    role: context.labels.unknownRole,
    channel: context.labels.unknownChannel,
  }
  return { name: unknown[kind] }
}

function renderInline(
  nodes: readonly MarkdownInline[],
  context: RenderContext
): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = index
    switch (node.type) {
      case "text":
        return <React.Fragment key={key}>{node.content}</React.Fragment>
      case "br":
        return <br key={key} />
      case "strong":
        return (
          <strong key={key} className="font-bold">
            {renderInline(node.children, context)}
          </strong>
        )
      case "em":
        return <em key={key}>{renderInline(node.children, context)}</em>
      case "underline":
        return (
          <span key={key} className="underline">
            {renderInline(node.children, context)}
          </span>
        )
      case "strike":
        return <s key={key}>{renderInline(node.children, context)}</s>
      case "spoiler":
        return (
          <Spoiler key={key}>{renderInline(node.children, context)}</Spoiler>
        )
      case "code":
        return <InlineCode key={key}>{node.content}</InlineCode>
      case "link":
        return (
          <a
            key={key}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            title={node.masked ? node.url : undefined}
            className="text-newt-text-link no-underline hover:underline"
            onClick={(event) => {
              if (!node.masked || context.props.linkWarning === false) return
              event.preventDefault()
              context.openWarning(node.url)
            }}
          >
            {renderInline(node.children, context)}
          </a>
        )
      case "mention": {
        const target = mentionName(context, node.kind, node.id)
        const onClick = context.props.onMentionClick
        return (
          <Mention
            key={key}
            as={onClick ? "button" : "span"}
            variant={node.kind}
            color={node.kind === "role" ? target.color : undefined}
            avatar={node.kind === "user" ? target.avatar : undefined}
            onClick={
              onClick
                ? () => onClick({ kind: node.kind, id: node.id })
                : undefined
            }
          >
            {MENTION_PREFIX[node.kind]}
            {target.name}
          </Mention>
        )
      }
      case "everyone":
        return (
          <Mention key={key} as="span" variant="user">
            @{node.name}
          </Mention>
        )
      case "command":
        return (
          <Mention key={key} as="span" variant="app">
            /{node.name}
          </Mention>
        )
      case "emoji": {
        const src = context.props.resolveEmoji?.(node)
        return src ? (
          <CustomEmoji
            key={key}
            name={node.name}
            src={src}
            size={context.jumbo ? "jumbo" : "inline"}
          />
        ) : (
          <React.Fragment key={key}>:{node.name}:</React.Fragment>
        )
      }
      case "timestamp":
        return (
          <Timestamp
            key={key}
            value={node.value}
            format={node.format}
            locale={context.props.locale}
          />
        )
    }
  })
}

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const

const HEADING_SIZES = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-base",
} as const

function renderBlocks(
  blocks: readonly MarkdownBlock[],
  context: RenderContext
): React.ReactNode[] {
  return blocks.map((block, index) => {
    const key = index
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={key}
            className={cn("m-0", context.jumbo && "text-5xl leading-tight")}
          >
            {renderInline(block.children, context)}
          </p>
        )
      case "heading": {
        const level = Math.min(
          6,
          block.level + (context.props.headingOffset ?? 2)
        )
        const Tag = HEADING_TAGS[level - 1] ?? "h6"
        return (
          <Tag
            key={key}
            className={cn(
              "mb-1 mt-2 font-bold leading-[1.375] text-newt-text-primary first:mt-0",
              HEADING_SIZES[block.level]
            )}
          >
            {renderInline(block.children, context)}
          </Tag>
        )
      }
      case "subtext":
        return (
          <p
            key={key}
            className="m-0 text-[13px] leading-[1.3] text-newt-text-muted"
          >
            {renderInline(block.children, context)}
          </p>
        )
      case "quote":
        return (
          <blockquote
            key={key}
            className="my-0.5 border-0 border-s-4 border-solid border-newt-border ps-3"
          >
            {renderBlocks(block.children, context)}
          </blockquote>
        )
      case "list": {
        const items = block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item.children, context)}</li>
        ))
        return block.ordered ? (
          <ol
            key={key}
            start={block.start === 1 ? undefined : block.start}
            className="my-1 list-decimal ps-6 marker:text-newt-text-muted"
          >
            {items}
          </ol>
        ) : (
          <ul
            key={key}
            className="my-1 list-disc ps-6 marker:text-newt-text-muted"
          >
            {items}
          </ul>
        )
      }
      case "codeBlock":
        return isHighlighted(block.language) ? (
          <CodeBlock
            key={key}
            className="my-1.5"
            language={block.language}
            code={block.content}
          />
        ) : (
          <CodeBlock key={key} className="my-1.5">
            {block.content}
          </CodeBlock>
        )
    }
  })
}

/**
 * Renders a message written in chat markdown with the library's own parts.
 * The source is parsed, never injected as HTML.
 */
const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  (props, ref) => {
    const {
      className,
      content,
      resolveMention: _resolveMention,
      resolveEmoji: _resolveEmoji,
      onMentionClick: _onMentionClick,
      headingOffset: _headingOffset,
      locale: _locale,
      linkWarning: _linkWarning,
      labels: labelOverrides,
      ...rest
    } = props
    const blocks = React.useMemo(() => parseMarkdown(content), [content])
    const labels = { ...defaultMarkdownLabels, ...labelOverrides }
    const [pendingUrl, setPendingUrl] = React.useState<string | null>(null)

    const context: RenderContext = {
      props,
      labels,
      jumbo: isEmojiOnly(blocks),
      openWarning: setPendingUrl,
    }

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-0 break-words [overflow-wrap:anywhere]",
          className
        )}
        {...rest}
      >
        {renderBlocks(blocks, context)}
        <Modal
          open={pendingUrl !== null}
          onOpenChange={(open) => {
            if (!open) setPendingUrl(null)
          }}
        >
          <ModalHeader>{labels.linkWarningTitle}</ModalHeader>
          <ModalBody>
            <p className="m-0">{labels.linkWarningBody}</p>
            <p className="mt-2 break-all rounded-sm bg-newt-bg-base p-2 font-mono text-[13px] text-newt-text-primary">
              {pendingUrl}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setPendingUrl(null)}>
              {labels.linkWarningCancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (pendingUrl) {
                  window.open(pendingUrl, "_blank", "noopener,noreferrer")
                }
                setPendingUrl(null)
              }}
            >
              {labels.linkWarningConfirm}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
)
Markdown.displayName = "Markdown"

export { Markdown }
