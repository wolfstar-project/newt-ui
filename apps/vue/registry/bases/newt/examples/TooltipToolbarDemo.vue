<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~~/registry/bases/newt/ui/tooltip"

/*
 * An icon-only button has no text of its own, so `aria-label` names it and
 * the tooltip shows the same words to sighted users.
 */
const actions = [
  {
    label: "Mute",
    icon: "M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 11a6 6 0 0 0 12 0M12 17v4",
  },
  {
    label: "Deafen",
    icon: "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5Z",
  },
  {
    label: "Voice settings",
    icon: "M4 7h10M18 7h2M14 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0M4 17h2M10 17h10M6 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  },
]
</script>

<template>
  <div class="flex gap-1 rounded-md bg-newt-bg-base p-1">
    <Tooltip v-for="action in actions" :key="action.label">
      <TooltipTrigger as-child>
        <button
          type="button"
          :aria-label="action.label"
          class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="action.icon"
            />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent>{{ action.label }}</TooltipContent>
    </Tooltip>
  </div>
</template>
