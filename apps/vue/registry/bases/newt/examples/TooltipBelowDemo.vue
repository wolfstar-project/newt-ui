<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~~/registry/bases/newt/ui/tooltip"

/*
 * The label sits above its trigger by default. Two utilities on the content
 * move it underneath, for a trigger that is already at the top of the window.
 */
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <Button variant="secondary" aria-describedby="tooltip-below">
        Pinned messages
      </Button>
    </TooltipTrigger>
    <TooltipContent id="tooltip-below" class="bottom-auto top-[calc(100%+8px)]">
      3 messages pinned in this channel
    </TooltipContent>
  </Tooltip>
</template>
