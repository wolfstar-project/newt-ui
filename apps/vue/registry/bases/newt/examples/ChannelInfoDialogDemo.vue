<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  ChannelInfo,
  ChannelInfoAction,
  ChannelInfoEmpty,
  ChannelInfoEmptyBody,
  ChannelInfoEmptyTitle,
  ChannelInfoIcon,
  ChannelInfoIdentity,
  ChannelInfoName,
  ChannelInfoPanel,
  ChannelInfoToolbar,
  ChannelInfoType,
} from "~~/registry/bases/newt/ui/channel-info"

const open = ref(false)
</script>

<template>
  <div
    class="relative flex h-[320px] w-full max-w-sm items-center justify-center overflow-hidden rounded-md bg-newt-bg-elevated"
  >
    <Button variant="secondary" @click="open = true">Channel details</Button>

    <ChannelInfo
      v-if="open"
      modal
      label="Channel information for #general"
      class="absolute inset-0"
      @close="open = false"
    >
      <ChannelInfoToolbar>
        <ChannelInfoAction aria-label="Back to channel" @click="open = false">
          <svg viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
            <path
              d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z"
            />
          </svg>
        </ChannelInfoAction>
      </ChannelInfoToolbar>

      <ChannelInfoIdentity>
        <ChannelInfoIcon />
        <div class="min-w-0">
          <ChannelInfoName>general</ChannelInfoName>
          <ChannelInfoType>Text Channel</ChannelInfoType>
        </div>
      </ChannelInfoIdentity>

      <ChannelInfoPanel>
        <ChannelInfoEmpty>
          <ChannelInfoEmptyTitle>No pinned messages yet.</ChannelInfoEmptyTitle>
          <ChannelInfoEmptyBody>
            Press Escape or the back arrow to return to the channel.
          </ChannelInfoEmptyBody>
        </ChannelInfoEmpty>
      </ChannelInfoPanel>
    </ChannelInfo>
  </div>
</template>
