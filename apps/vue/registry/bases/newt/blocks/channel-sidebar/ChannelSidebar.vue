<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "~~/registry/bases/newt/ui/status-indicator"
import { Tree, type TreeNode } from "~~/registry/bases/newt/ui/tree"
import {
  UserPanel,
  UserPanelActions,
  UserPanelButton,
  UserPanelInfo,
} from "~~/registry/bases/newt/ui/user-panel"

import { cn } from "@/lib/utils"

import type { SidebarUser } from "./types"

/*
 * The column a server is navigated from: its name, its channels as a tree and
 * the signed-in user's controls pinned to the foot. Muting and deafening are
 * kept here as local state because the block has no voice connection to tell;
 * lift them when yours does.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  serverName: string
  /** Categories and their channels, as the tree takes them. */
  channels: readonly TreeNode[]
  /** Ids of the categories that start open. */
  defaultExpanded?: readonly string[]
  user: SidebarUser
}>()

const emit = defineEmits<{
  /** Fired when the settings button in the user panel is pressed. */
  (e: "openSettings"): void
}>()

/** The id of the channel being shown. */
const channel = defineModel<string>("channel")

const muted = ref(false)
const deafened = ref(false)
</script>

<template>
  <aside
    :aria-label="`${props.serverName} channels`"
    :class="cn('flex h-full min-h-0 flex-col bg-newt-bg-surface', props.class)"
  >
    <header
      class="border-b border-newt-border px-4 py-3 text-[15px] font-semibold leading-5 text-newt-text-primary"
    >
      <span class="block truncate">{{ props.serverName }}</span>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto p-2">
      <Tree
        v-model="channel"
        label="Channels"
        :items="props.channels"
        :default-expanded="props.defaultExpanded"
      />
    </div>
    <div class="p-2">
      <UserPanel>
        <StatusIndicator>
          <Avatar size="sm">{{ props.user.initials }}</Avatar>
          <StatusDot :status="props.user.status" />
        </StatusIndicator>
        <UserPanelInfo
          :name="props.user.name"
          :status="props.user.statusText"
        />
        <UserPanelActions>
          <UserPanelButton
            v-model:pressed="muted"
            icon="microphone"
            label="Mute"
          />
          <UserPanelButton
            v-model:pressed="deafened"
            icon="headphones"
            label="Deafen"
          />
          <UserPanelButton
            icon="settings"
            label="User settings"
            @click="emit('openSettings')"
          />
        </UserPanelActions>
      </UserPanel>
    </div>
  </aside>
</template>
