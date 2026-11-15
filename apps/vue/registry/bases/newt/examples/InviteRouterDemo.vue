<script setup lang="ts">
import { defineComponent, h } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Invite,
  InviteBody,
  InviteCount,
  InviteCounts,
  InviteEyebrow,
  InviteIcon,
  InviteInfo,
  InviteName,
} from "~~/registry/bases/newt/ui/invite"

/* Inline so the demo never reaches out to the network for a placeholder. */
const SERVER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%235865f2'/%3E%3C/svg%3E"

/*
 * Stand-ins for `RouterLink` and `NuxtImg`. Each takes a prop the plain
 * element does not have: `to` and `size`.
 */
const RouterLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h("a", { href: props.to }, slots.default?.())
  },
})

const ServerImage = defineComponent({
  props: { size: { type: Number, required: true } },
  setup(props) {
    return () => h("img", { width: props.size, height: props.size })
  },
})
</script>

<template>
  <Invite>
    <InviteEyebrow>You've been invited to join a server</InviteEyebrow>
    <InviteBody>
      <InviteIcon :as="ServerImage" :size="48" :src="SERVER_ICON" />
      <InviteInfo>
        <InviteName :as="RouterLink" to="#">Newt Builders</InviteName>
        <InviteCounts>
          <InviteCount online>256 Online</InviteCount>
          <InviteCount>2,048 Members</InviteCount>
        </InviteCounts>
      </InviteInfo>
      <Button variant="success">Join</Button>
    </InviteBody>
  </Invite>
</template>
