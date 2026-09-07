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

export interface SlashCommandProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** Command name rendered after the leading slash. */
  name: string
  /** Subcommand segment, e.g. `/ban member`. */
  subcommand?: string
  /** Subcommand group segment, e.g. `/settings roles add`. */
  subcommandGroup?: string
  options?: readonly SlashCommandOption[]
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

const SlashCommand = React.forwardRef<HTMLSpanElement, SlashCommandProps>(
  (
    { className, name, subcommand, subcommandGroup, options = [], ...props },
    ref
  ) => {
    const path = commandPath({ name, subcommand, subcommandGroup })
    return (
      <span
        ref={ref}
        role="group"
        aria-label={describe(path, options)}
        className={cn(
          "inline-flex flex-wrap items-center gap-1 rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] py-[2px] pl-[6px] pr-2 font-mono text-[13px] text-newt-mention-text",
          className
        )}
        {...props}
      >
        <span className="opacity-80" aria-hidden="true">
          /
        </span>
        <span className="font-semibold">{name}</span>
        {subcommandGroup ? (
          <span className="font-semibold">{subcommandGroup}</span>
        ) : null}
        {subcommand ? (
          <span className="font-semibold">{subcommand}</span>
        ) : null}
        {options.map((option) => (
          <span
            key={option.name}
            className={cn(
              "inline-flex items-center gap-1",
              /* The option the caret currently sits in. */
              option.focused &&
                "rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_35%,transparent)] px-0.5"
            )}
          >
            <span className="text-newt-text-muted after:content-[':']">
              {option.name}
            </span>
            {option.value ? (
              <span className="font-medium text-newt-text-primary">
                {option.value}
              </span>
            ) : (
              /* No value yet — the option's description stands in. */
              <span className="italic text-newt-text-muted">
                {option.description ?? option.name}
              </span>
            )}
          </span>
        ))}
      </span>
    )
  }
)
SlashCommand.displayName = "SlashCommand"

export { SlashCommand }
