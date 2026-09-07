<script setup lang="ts">
import {
  ChannelInfo,
  ChannelInfoAction,
  ChannelInfoActions,
  ChannelInfoEmpty,
  ChannelInfoEmptyBody,
  ChannelInfoEmptyIcon,
  ChannelInfoEmptyTitle,
  ChannelInfoIcon,
  ChannelInfoIdentity,
  ChannelInfoName,
  ChannelInfoPanel,
  ChannelInfoToolbar,
  ChannelInfoType,
} from "@/lib/registry/default/ui/channel-info"
import { Tabs, TabsContent, TabsTrigger } from "@/lib/registry/default/ui/tabs"
</script>

<template>
  <ChannelInfo
    aria-label="Channel information for #general"
    class="h-[420px] rounded-md"
  >
    <ChannelInfoToolbar>
      <ChannelInfoAction aria-label="Back to channel">
        <svg viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
          <path
            d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z"
          />
        </svg>
      </ChannelInfoAction>
      <ChannelInfoActions>
        <ChannelInfoAction aria-label="Search">
          <svg
            viewBox="0 0 20 20"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13 13l4 4" />
          </svg>
        </ChannelInfoAction>
        <ChannelInfoAction aria-label="Notification settings">
          <svg viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
            <path
              d="M10 2a5 5 0 0 0-5 5v3.5L3.5 13v1h13v-1L15 10.5V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 10 18Z"
            />
          </svg>
        </ChannelInfoAction>
      </ChannelInfoActions>
    </ChannelInfoToolbar>

    <ChannelInfoIdentity>
      <ChannelInfoIcon />
      <div class="min-w-0">
        <ChannelInfoName>general</ChannelInfoName>
        <ChannelInfoType>Text Channel</ChannelInfoType>
      </div>
    </ChannelInfoIdentity>

    <!--
      `contents` lets the tab strip and the panel sit directly in the panel
      column, so the panel is not nested inside the tablist.
    -->
    <Tabs default-value="threads" role="presentation" class="contents">
      <div
        role="tablist"
        aria-label="Channel information sections"
        class="mx-2 flex gap-1 rounded-md bg-newt-bg-base p-1"
      >
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="pins">Pins</TabsTrigger>
        <TabsTrigger value="threads">Threads</TabsTrigger>
      </div>

      <ChannelInfoPanel>
        <TabsContent value="members">
          <ChannelInfoEmpty>
            <ChannelInfoEmptyTitle>No members to show.</ChannelInfoEmptyTitle>
          </ChannelInfoEmpty>
        </TabsContent>
        <TabsContent value="pins">
          <ChannelInfoEmpty>
            <ChannelInfoEmptyTitle>
              No pinned messages yet.
            </ChannelInfoEmptyTitle>
          </ChannelInfoEmpty>
        </TabsContent>
        <TabsContent value="threads">
          <ChannelInfoEmpty>
            <ChannelInfoEmptyIcon>
              <svg viewBox="0 0 24 24" class="h-8 w-8" fill="currentColor">
                <path d="M4 4h16v10H8l-4 4V4Z" />
              </svg>
            </ChannelInfoEmptyIcon>
            <ChannelInfoEmptyTitle>
              There are no threads.
            </ChannelInfoEmptyTitle>
            <ChannelInfoEmptyBody>
              Stay focused on a conversation with a thread &mdash; a temporary
              text channel.
            </ChannelInfoEmptyBody>
          </ChannelInfoEmpty>
        </TabsContent>
      </ChannelInfoPanel>
    </Tabs>
  </ChannelInfo>
</template>
