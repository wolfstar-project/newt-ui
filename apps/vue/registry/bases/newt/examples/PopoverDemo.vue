<script setup lang="ts">
import { ref } from "vue"
import { Button, buttonVariants } from "~~/registry/bases/newt/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~~/registry/bases/newt/ui/popover"

const open = ref(false)
const muted = ref(false)

function toggleMute() {
  muted.value = !muted.value
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger :class="buttonVariants({ variant: 'secondary' })">
      Notification settings
    </PopoverTrigger>
    <PopoverContent aria-label="Notification settings">
      <p class="m-0 font-semibold text-newt-text-primary">
        {{ muted ? "This channel is muted" : "Mute this channel" }}
      </p>
      <p class="m-0">You will not be notified unless you are mentioned.</p>
      <Button
        size="sm"
        :variant="muted ? 'secondary' : 'primary'"
        @click="toggleMute"
      >
        {{ muted ? "Unmute" : "Mute for 1 hour" }}
      </Button>
    </PopoverContent>
  </Popover>
</template>
