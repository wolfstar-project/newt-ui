<script setup lang="ts">
import { ref } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "~~/registry/bases/newt/ui/status-indicator"
import {
  UserPanel,
  UserPanelActions,
  UserPanelButton,
  UserPanelInfo,
} from "~~/registry/bases/newt/ui/user-panel"

const muted = ref(true)
const deafened = ref(false)
</script>

<template>
  <UserPanel class="w-60">
    <StatusIndicator>
      <Avatar size="sm">A</Avatar>
      <StatusDot status="online" />
    </StatusIndicator>
    <UserPanelInfo name="ada" :status="muted ? 'Muted' : 'Online'" />
    <UserPanelActions>
      <UserPanelButton v-model:pressed="muted" icon="microphone" label="Mute" />
      <UserPanelButton
        v-model:pressed="deafened"
        icon="headphones"
        label="Deafen"
      />
      <UserPanelButton icon="settings" label="User settings" />
    </UserPanelActions>
  </UserPanel>
</template>
