"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  BotCommandCard,
  BotCommandCardDescription,
  BotCommandCardHeader,
  BotCommandCardName,
  BotCommandCardOption,
  BotCommandCardOptions,
} from "@/registry/default/ui/bot-command-card"
import {
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionGroup,
  SlashCommandSuggestions,
  SlashCommandSuggestionsHeader,
  SlashCommandSuggestionsList,
} from "@/registry/default/ui/slash-command-suggestions"

export interface CommandPanelOption {
  name: string
  type?: string
  required?: boolean
  description?: string
}

export interface CommandPanelCommand {
  id: string
  name: string
  description: string
  appLabel?: string
  options?: readonly CommandPanelOption[]
}

export interface CommandPanelProps extends Omit<
  React.ComponentProps<"section">,
  "children"
> {
  commands: readonly CommandPanelCommand[]
  selectedId?: string
  defaultSelectedId?: string
  onSelectedIdChange?: (id: string) => void
  listLabel?: string
  emptyLabel?: string
}

export function CommandPanel({
  commands,
  selectedId: controlledSelectedId,
  defaultSelectedId,
  onSelectedIdChange,
  listLabel = "Available commands",
  emptyLabel = "No commands available.",
  className,
  ...props
}: CommandPanelProps) {
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = React.useState(
    defaultSelectedId ?? commands[0]?.id
  )
  const instanceId = React.useId().replaceAll(":", "")
  const selectedId = controlledSelectedId ?? uncontrolledSelectedId
  const selectedIndex = Math.max(
    0,
    commands.findIndex((command) => command.id === selectedId)
  )
  const selectedCommand = commands[selectedIndex]

  function select(id: string) {
    if (controlledSelectedId === undefined) setUncontrolledSelectedId(id)
    onSelectedIdChange?.(id)
  }

  function moveSelection(key: "first" | "last" | "next" | "previous") {
    if (commands.length === 0) return
    const nextIndex =
      key === "first"
        ? 0
        : key === "last"
          ? commands.length - 1
          : key === "next"
            ? (selectedIndex + 1) % commands.length
            : (selectedIndex - 1 + commands.length) % commands.length
    const command = commands[nextIndex]
    if (command) select(command.id)
  }

  return (
    <section
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]",
        className
      )}
      {...props}
    >
      <SlashCommandSuggestions className="max-w-none">
        <SlashCommandSuggestionsList
          aria-label={listLabel}
          aria-activedescendant={
            selectedCommand
              ? `${instanceId}-command-${selectedCommand.id}`
              : undefined
          }
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              moveSelection("next")
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              moveSelection("previous")
            } else if (event.key === "Home") {
              event.preventDefault()
              moveSelection("first")
            } else if (event.key === "End") {
              event.preventDefault()
              moveSelection("last")
            }
          }}
        >
          <SlashCommandSuggestionsHeader>
            Commands
          </SlashCommandSuggestionsHeader>
          <SlashCommandSuggestionGroup aria-label={listLabel}>
            {commands.map((command) => (
              <SlashCommandSuggestion
                key={command.id}
                id={`${instanceId}-command-${command.id}`}
                active={command.id === selectedCommand?.id}
                name={command.name}
                description={command.description}
                appLabel={command.appLabel}
                icon={
                  <SlashCommandAppIcon>
                    {command.name.slice(0, 1).toUpperCase()}
                  </SlashCommandAppIcon>
                }
                onClick={() => select(command.id)}
                onMouseEnter={() => select(command.id)}
              />
            ))}
          </SlashCommandSuggestionGroup>
          {commands.length === 0 ? (
            <p className="px-2 py-4 text-sm text-newt-text-muted">
              {emptyLabel}
            </p>
          ) : null}
        </SlashCommandSuggestionsList>
      </SlashCommandSuggestions>

      {selectedCommand ? (
        <BotCommandCard className="max-w-none" aria-live="polite">
          <BotCommandCardHeader>
            <BotCommandCardName>{selectedCommand.name}</BotCommandCardName>
            {selectedCommand.appLabel ? (
              <span className="text-xs text-newt-text-muted">
                {selectedCommand.appLabel}
              </span>
            ) : null}
          </BotCommandCardHeader>
          <BotCommandCardDescription>
            {selectedCommand.description}
          </BotCommandCardDescription>
          {selectedCommand.options?.length ? (
            <BotCommandCardOptions>
              {selectedCommand.options.map((option) => (
                <BotCommandCardOption key={option.name} {...option} />
              ))}
            </BotCommandCardOptions>
          ) : null}
        </BotCommandCard>
      ) : (
        <div
          className="rounded-md border border-newt-border bg-newt-bg-elevated p-4 text-sm text-newt-text-muted"
          aria-live="polite"
        >
          {emptyLabel}
        </div>
      )}
    </section>
  )
}
