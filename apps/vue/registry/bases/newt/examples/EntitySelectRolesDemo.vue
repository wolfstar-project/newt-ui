<script setup lang="ts">
import { ref } from "vue"
import { EntitySelect } from "~~/registry/bases/newt/ui/entity-select"

/*
 * More than one may be chosen, so the choices leave the list and sit in the
 * control as chips — and each row grows a box instead of a tick.
 */
const roles = ref<readonly string[]>(["mod"])

const options = [
  { value: "mod", label: "Moderator", color: "#f0b232", count: 4 },
  { value: "dev", label: "Contributor", color: "#3ba55d", count: 12 },
  { value: "player", label: "Player", color: "#5865f2", count: 128 },
  { value: "muted", label: "Muted", color: "#949ba4", count: 0 },
]
</script>

<template>
  <EntitySelect
    v-model="roles"
    kind="role"
    :max="3"
    label="Which roles?"
    placeholder="Which roles?"
    :options="options"
  />
</template>
