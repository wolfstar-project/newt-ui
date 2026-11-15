export { default as SlashCommand } from "./SlashCommand.vue"

export interface SlashCommandOption {
  name: string
  /** The value the user has entered, if any. */
  value?: string
  /** Stands in for a missing value, the way the client previews the option. */
  description?: string
  /** The option the caret currently sits in. */
  focused?: boolean
}

/** What the accessible name of a command chip is built from. */
export interface SlashCommandLabelState {
  /** The command path without the slash: `ban member`. */
  path: string
  options: readonly SlashCommandOption[]
}

/** The English default. Pass `formatLabel` to translate it. */
export function defaultSlashCommandLabel({
  path,
  options,
}: SlashCommandLabelState): string {
  const spoken = options
    .map(
      (option) =>
        `${option.name}: ${option.value ?? option.description ?? option.name}`
    )
    .join(" ")
  return `Slash command /${path}${spoken ? ` ${spoken}` : ""}`
}
