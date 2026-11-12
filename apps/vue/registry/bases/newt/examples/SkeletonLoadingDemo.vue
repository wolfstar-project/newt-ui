<script setup lang="ts">
import { ref } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Skeleton } from "~~/registry/bases/newt/ui/skeleton"

/*
 * A skeleton is hidden from screen readers, so the region says it is busy
 * with `aria-busy` while the placeholder stands in for the message.
 */
const loading = ref(true)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col items-start gap-4">
    <div :aria-busy="loading" class="flex w-full gap-3">
      <template v-if="loading">
        <Skeleton variant="avatar" />
        <div class="flex flex-1 flex-col gap-1.5">
          <Skeleton variant="title" />
          <Skeleton variant="text" class="w-[80%]" />
        </div>
      </template>
      <template v-else>
        <Avatar aria-hidden="true">M</Avatar>
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-sm font-semibold text-newt-text-primary">
            Mira Okafor
          </span>
          <span class="text-sm text-newt-text-secondary">
            The reading list for next month is pinned.
          </span>
        </div>
      </template>
    </div>
    <Button size="sm" variant="secondary" @click="loading = !loading">
      {{ loading ? "Show the message" : "Show the placeholder" }}
    </Button>
  </div>
</template>
