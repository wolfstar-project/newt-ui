<script setup lang="ts">
import {
  ChannelHeader,
  ChannelHeaderAction,
  ChannelHeaderDivider,
  ChannelHeaderIcon,
  ChannelHeaderInfo,
  ChannelHeaderName,
  ChannelHeaderSearch,
  ChannelHeaderToolbar,
  ChannelHeaderTopic,
} from "~~/registry/bases/newt/ui/channel-header"
</script>

<template>
  <ChannelHeader class="w-full">
    <ChannelHeaderInfo>
      <ChannelHeaderIcon />
      <ChannelHeaderName>general</ChannelHeaderName>
      <ChannelHeaderDivider />
      <ChannelHeaderTopic>
        Say hello and tell us what you are building.
      </ChannelHeaderTopic>
    </ChannelHeaderInfo>

    <ChannelHeaderToolbar>
      <ChannelHeaderAction aria-label="Pinned messages">
        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor">
          <path d="M14 3v6l3 3v2h-4v6l-1 1-1-1v-6H7v-2l3-3V3h4Z" />
        </svg>
      </ChannelHeaderAction>
      <ChannelHeaderAction
        active
        aria-label="Hide member list"
        aria-pressed="true"
      >
        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor">
          <path
            d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 19a7 7 0 0 1 14 0v1H2v-1Zm15.5-6a5.5 5.5 0 0 1 4.5 5.4V20h-4v-1a8.9 8.9 0 0 0-1.6-5.1c.35-.06.72-.09 1.1-.09Z"
          />
        </svg>
      </ChannelHeaderAction>
      <ChannelHeaderSearch class="hidden sm:flex" />
    </ChannelHeaderToolbar>
  </ChannelHeader>
</template>
