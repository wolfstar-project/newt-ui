<script setup lang="ts">
import { SlashCommand } from "~~/registry/bases/newt/ui/slash-command"
import {
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionGroup,
  SlashCommandSuggestionMatched,
  SlashCommandSuggestions,
  SlashCommandSuggestionsHeader,
  SlashCommandSuggestionsList,
  SlashCommandSuggestionsRail,
  SlashCommandSuggestionsRailItem,
} from "~~/registry/bases/newt/ui/slash-command-suggestions"

const shieldPath = "M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z"
</script>

<template>
  <SlashCommandSuggestions>
    <SlashCommandSuggestionsRail aria-label="Filter commands by app">
      <SlashCommandSuggestionsRailItem active aria-label="Frequently used">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
          <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-4-5-4v2Z" />
          <path d="M11 7h2v5l4 2-1 1.7L11 13V7Z" />
        </svg>
      </SlashCommandSuggestionsRailItem>
      <SlashCommandSuggestionsRailItem aria-label="Moderation commands">
        <SlashCommandAppIcon size="rail">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path :d="shieldPath" />
          </svg>
        </SlashCommandAppIcon>
      </SlashCommandSuggestionsRailItem>
    </SlashCommandSuggestionsRail>

    <SlashCommandSuggestionsList aria-label="Slash commands">
      <SlashCommandSuggestionsHeader>
        Frequently Used
      </SlashCommandSuggestionsHeader>

      <SlashCommandSuggestionGroup aria-label="Moderation">
        <SlashCommandSuggestion
          active
          name="ban"
          description="Ban a member from the server."
          app-label="Moderation"
        >
          <template #icon>
            <SlashCommandAppIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="shieldPath" />
              </svg>
            </SlashCommandAppIcon>
          </template>
        </SlashCommandSuggestion>
        <SlashCommandSuggestion
          name="timeout"
          description="Mute a member for a set amount of time."
          app-label="Moderation"
        >
          <template #icon>
            <SlashCommandAppIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="shieldPath" />
              </svg>
            </SlashCommandAppIcon>
          </template>
        </SlashCommandSuggestion>
        <SlashCommandSuggestion
          disabled
          name="verify"
          description="Only available to server administrators."
          app-label="Moderation"
        >
          <template #icon>
            <SlashCommandAppIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="shieldPath" />
              </svg>
            </SlashCommandAppIcon>
          </template>
        </SlashCommandSuggestion>
      </SlashCommandSuggestionGroup>

      <SlashCommandSuggestionMatched>
        <SlashCommand
          name="ban"
          :options="[{ name: 'user', value: '@username' }]"
        />
      </SlashCommandSuggestionMatched>
    </SlashCommandSuggestionsList>
  </SlashCommandSuggestions>
</template>
