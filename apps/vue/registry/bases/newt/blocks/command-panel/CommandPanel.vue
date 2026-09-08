<script setup lang="ts">
import { computed, shallowRef, useId } from "vue"
import type { HTMLAttributes } from "vue"
import {
  BotCommandCard,
  BotCommandCardDescription,
  BotCommandCardHeader,
  BotCommandCardName,
  BotCommandCardOption,
  BotCommandCardOptions,
} from "~~/registry/bases/newt/ui/bot-command-card"
import {
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionGroup,
  SlashCommandSuggestions,
  SlashCommandSuggestionsHeader,
  SlashCommandSuggestionsList,
} from "~~/registry/bases/newt/ui/slash-command-suggestions"

import { cn } from "@/lib/utils"

import type { CommandPanelCommand } from "./types"

const props = withDefaults(
  defineProps<{
    commands: readonly CommandPanelCommand[]
    selectedId?: string
    defaultSelectedId?: string
    listLabel?: string
    emptyLabel?: string
    class?: HTMLAttributes["class"]
  }>(),
  {
    listLabel: "Available commands",
    emptyLabel: "No commands available.",
  }
)

const emit = defineEmits<{ "update:selectedId": [id: string] }>()
const uncontrolledSelectedId = shallowRef(
  props.defaultSelectedId ?? props.commands[0]?.id
)
const instanceId = useId().replaceAll(":", "")
const currentSelectedId = computed(
  () => props.selectedId ?? uncontrolledSelectedId.value
)
const selectedIndex = computed(() =>
  Math.max(
    0,
    props.commands.findIndex(
      (command) => command.id === currentSelectedId.value
    )
  )
)
const selectedCommand = computed(() => props.commands[selectedIndex.value])

function select(id: string) {
  if (props.selectedId === undefined) uncontrolledSelectedId.value = id
  emit("update:selectedId", id)
}

function moveSelection(key: "first" | "last" | "next" | "previous") {
  if (props.commands.length === 0) return
  const nextIndex =
    key === "first"
      ? 0
      : key === "last"
        ? props.commands.length - 1
        : key === "next"
          ? (selectedIndex.value + 1) % props.commands.length
          : (selectedIndex.value - 1 + props.commands.length) %
            props.commands.length
  const command = props.commands[nextIndex]
  if (command) select(command.id)
}

function handleKeydown(event: KeyboardEvent) {
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
}
</script>

<template>
  <section
    :class="
      cn(
        'grid w-full grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]',
        props.class
      )
    "
  >
    <SlashCommandSuggestions class="max-w-none">
      <SlashCommandSuggestionsList
        :aria-label="props.listLabel"
        :aria-activedescendant="
          selectedCommand
            ? `${instanceId}-command-${selectedCommand.id}`
            : undefined
        "
        tabindex="0"
        @keydown="handleKeydown"
      >
        <SlashCommandSuggestionsHeader>Commands</SlashCommandSuggestionsHeader>
        <SlashCommandSuggestionGroup :aria-label="props.listLabel">
          <SlashCommandSuggestion
            v-for="command in props.commands"
            :id="`${instanceId}-command-${command.id}`"
            :key="command.id"
            :active="command.id === selectedCommand?.id"
            :name="command.name"
            :description="command.description"
            :app-label="command.appLabel"
            @click="select(command.id)"
            @mouseenter="select(command.id)"
          >
            <template #icon>
              <SlashCommandAppIcon>
                {{ command.name.slice(0, 1).toUpperCase() }}
              </SlashCommandAppIcon>
            </template>
          </SlashCommandSuggestion>
        </SlashCommandSuggestionGroup>
        <p
          v-if="props.commands.length === 0"
          class="px-2 py-4 text-sm text-newt-text-muted"
        >
          {{ props.emptyLabel }}
        </p>
      </SlashCommandSuggestionsList>
    </SlashCommandSuggestions>

    <BotCommandCard
      v-if="selectedCommand"
      class="max-w-none"
      aria-live="polite"
    >
      <BotCommandCardHeader>
        <BotCommandCardName>{{ selectedCommand.name }}</BotCommandCardName>
        <span
          v-if="selectedCommand.appLabel"
          class="text-xs text-newt-text-muted"
        >
          {{ selectedCommand.appLabel }}
        </span>
      </BotCommandCardHeader>
      <BotCommandCardDescription>
        {{ selectedCommand.description }}
      </BotCommandCardDescription>
      <BotCommandCardOptions v-if="selectedCommand.options?.length">
        <BotCommandCardOption
          v-for="option in selectedCommand.options"
          :key="option.name"
          v-bind="option"
        />
      </BotCommandCardOptions>
    </BotCommandCard>
    <div
      v-else
      class="rounded-md border border-newt-border bg-newt-bg-elevated p-4 text-sm text-newt-text-muted"
      aria-live="polite"
    >
      {{ props.emptyLabel }}
    </div>
  </section>
</template>
