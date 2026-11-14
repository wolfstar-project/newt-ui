import { SlashCommand } from "@/registry/bases/newt/ui/slash-command"
import {
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionGroup,
  SlashCommandSuggestions,
  SlashCommandSuggestionsFooter,
  SlashCommandSuggestionsList,
  SlashCommandSuggestionsRail,
  SlashCommandSuggestionsRailItem,
} from "@/registry/bases/newt/ui/slash-command-suggestions"

const shieldPath = "M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z"

/* What an icon component in CSS mode renders: a `<span>` with a mask. */
const shieldMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='${shieldPath}'/%3E%3C/svg%3E") center / contain no-repeat`

const MaskIcon = () => (
  <span className="bg-current" style={{ mask: shieldMask }} />
)

/* A picker 360px wide, the width it has on a phone. */
export default function SlashCommandSuggestionsNarrowDemo() {
  return (
    <div className="w-full max-w-[360px]">
      <SlashCommandSuggestions>
        <SlashCommandSuggestionsRail aria-label="Filter commands by app">
          <SlashCommandSuggestionsRailItem active aria-label="Frequently used">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-4-5-4v2Z" />
              <path d="M11 7h2v5l4 2-1 1.7L11 13V7Z" />
            </svg>
          </SlashCommandSuggestionsRailItem>
          <SlashCommandSuggestionsRailItem aria-label="Moderation commands">
            <SlashCommandAppIcon size="rail">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d={shieldPath} />
              </svg>
            </SlashCommandAppIcon>
          </SlashCommandSuggestionsRailItem>
        </SlashCommandSuggestionsRail>

        <SlashCommandSuggestionsList aria-label="Slash commands">
          <SlashCommandSuggestionGroup aria-label="Moderation">
            <SlashCommandSuggestion
              active
              name="ban"
              description="Ban a member from the server and delete their recent messages."
              appLabel="Moderation"
              icon={
                <SlashCommandAppIcon>
                  <MaskIcon />
                </SlashCommandAppIcon>
              }
            />
            <SlashCommandSuggestion
              name="timeout"
              description="Mute a member for a set amount of time."
              appLabel="Moderation"
              icon={
                <SlashCommandAppIcon>
                  <MaskIcon />
                </SlashCommandAppIcon>
              }
            />
          </SlashCommandSuggestionGroup>
        </SlashCommandSuggestionsList>

        <SlashCommandSuggestionsFooter>
          <SlashCommand
            name="ban"
            options={[
              { name: "user", description: "the member to ban", focused: true },
            ]}
          />
        </SlashCommandSuggestionsFooter>
      </SlashCommandSuggestions>
    </div>
  )
}
