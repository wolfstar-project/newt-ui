<script setup lang="ts">
import { RoleTag, RoleTagDot } from "~~/registry/bases/newt/ui/role-tag"

/* A member's roles as a real list, so the count is announced with them. */
const roles = [
  { name: "Admin", color: "#5865f2" },
  { name: "Moderator", color: "#23a55a" },
  { name: "Event host", color: "#f0b232" },
  { name: "Artist", color: "#eb459e" },
  { name: "Early member", color: "#949ba4" },
]
</script>

<template>
  <div class="flex w-full max-w-[260px] flex-col gap-2 text-start">
    <span
      id="role-tag-list-heading"
      class="text-xs font-bold uppercase text-newt-text-muted"
    >
      Roles
    </span>
    <ul
      aria-labelledby="role-tag-list-heading"
      class="m-0 flex list-none flex-wrap gap-1 p-0"
    >
      <li v-for="role in roles" :key="role.name" class="flex">
        <RoleTag :color="role.color">
          <RoleTagDot />
          {{ role.name }}
        </RoleTag>
      </li>
    </ul>
  </div>
</template>
