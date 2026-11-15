import * as React from "react"

import { cn } from "@/lib/utils"

export interface SlashCommandOption {
  name: string
  /** The value the user has entered, if any. */
  value?: string
  /** Stands in for a missing value, the way the client previews the option. */
  description?: string
  /** The option the caret currently sits in. */
  focused?: boolean
}

export interface SlashCommandProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Command name rendered after the leading slash. */
  name: string
  /** Subcommand segment, e.g. `/ban member`. */
  subcommand?: string
  /** Subcommand group segment, e.g. `/settings roles add`. */
  subcommandGroup?: string
  options?: readonly SlashCommandOption[]
  /** Content that follows the command inside the chip, after a space. */
  children?: React.ReactNode
}

/** `/name group sub` — the segments a caller can actually reach. */
function commandPath(
  props: Pick<SlashCommandProps, "name" | "subcommand" | "subcommandGroup">
) {
  return [props.name, props.subcommandGroup, props.subcommand]
    .filter(Boolean)
    .join(" ")
}

function describe(
  path: string,
  options: readonly SlashCommandOption[]
): string {
  const spoken = options
    .map(
      (option) =>
        `${option.name}: ${option.value ?? option.description ?? option.name}`
    )
    .join(" ")
  return `Slash command /${path}${spoken ? ` ${spoken}` : ""}`
}

/*
 * The separators are real text: a space between two parts and a colon after
 * an option name, so a copy, a search and a test read
 * `/ban member user:@username`. The chip is inline content, because a flex row
 * drops the space between two items. `word-spacing` draws each space 4px wide
 * (a space is 1ch in a monospace font), and every child resets it, so only the
 * spaces between the parts are narrowed. Each part is its own run of text, so a
 * right-to-left chip orders its parts from the right, as a flex row did.
 */
const SlashCommand = React.forwardRef<HTMLSpanElement, SlashCommandProps>(
  (
    {
      className,
      name,
      subcommand,
      subcommandGroup,
      options = [],
      children,
      ...props
    },
    ref
  ) => {
    const path = commandPath({ name, subcommand, subcommandGroup })
    const hasChildren =
      children !== undefined && children !== null && children !== false
    return (
      <span
        ref={ref}
        role="group"
        aria-label={describe(path, options)}
        className={cn(
          "inline-block rounded-[var(--newt-radius-sm)] bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] py-[2px] ps-[6px] pe-2 font-[family-name:var(--newt-font-mono)] text-[13px] text-newt-mention-text [word-spacing:calc(4px_-_1ch)] [&>*]:[word-spacing:normal] [&>*]:[unicode-bidi:isolate]",
          className
        )}
        {...props}
      >
        {/* No space follows the slash, so the text reads `/ban`. */}
        <span className="me-1 opacity-80" aria-hidden="true">
          /
        </span>
        <span className="font-semibold">{name}</span>
        {subcommandGroup ? (
          <>
            {" "}
            <span className="font-semibold">{subcommandGroup}</span>
          </>
        ) : null}
        {subcommand ? (
          <>
            {" "}
            <span className="font-semibold">{subcommand}</span>
          </>
        ) : null}
        {options.map((option) => (
          <React.Fragment key={option.name}>
            {" "}
            <span
              className={cn(
                "inline-block [&>*]:[unicode-bidi:isolate]",
                /* The option the caret currently sits in. */
                option.focused &&
                  "rounded-[var(--newt-radius-sm)] bg-[color-mix(in_srgb,var(--newt-brand)_35%,transparent)] px-0.5"
              )}
            >
              <span className="text-newt-text-muted">{`${option.name}:`}</span>
              {option.value ? (
                <span className="ms-1 font-medium text-newt-text-primary">
                  {option.value}
                </span>
              ) : (
                /* No value yet — the option's description stands in. */
                <span className="ms-1 italic text-newt-text-muted">
                  {option.description ?? option.name}
                </span>
              )}
            </span>
          </React.Fragment>
        ))}
        {hasChildren ? (
          <>
            {" "}
            <span>{children}</span>
          </>
        ) : null}
      </span>
    )
  }
)
SlashCommand.displayName = "SlashCommand"

export { SlashCommand }
