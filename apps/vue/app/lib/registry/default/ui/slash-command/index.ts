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
