<script setup lang="ts">
import { ref } from "vue"
import {
  Pagination,
  PaginationButton,
} from "~~/registry/bases/newt/ui/pagination"

/*
 * When nobody needs to jump to a page, two labelled buttons and a position
 * are enough. Both buttons disable themselves at their end of the range.
 */
const total = 8
const page = ref(1)
</script>

<template>
  <Pagination class="gap-3">
    <PaginationButton class="px-3" :disabled="page === 1" @click="page -= 1">
      Previous
    </PaginationButton>
    <span aria-live="polite" class="text-[13px] text-newt-text-muted">
      Page {{ page }} of {{ total }}
    </span>
    <PaginationButton
      class="px-3"
      :disabled="page === total"
      @click="page += 1"
    >
      Next
    </PaginationButton>
  </Pagination>
</template>
