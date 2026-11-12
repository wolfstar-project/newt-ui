<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Pagination,
  PaginationButton,
  PaginationEllipsis,
} from "~~/registry/bases/newt/ui/pagination"

/*
 * Twelve pages do not fit in a row. `PaginationEllipsis` stands in for the
 * ones left out on either side of the current page.
 */
const total = 12
const page = ref(6)

/**
 * The first page, the last, the current one and its neighbours. An item
 * without a page is a gap.
 */
const items = computed<{ key: string; page: number | null }[]>(() => {
  const start = Math.max(2, page.value - 1)
  const end = Math.min(total - 1, page.value + 1)
  const pages = [
    1,
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    total,
  ].map((n) => ({ key: String(n), page: n }))
  return [
    ...pages.slice(0, 1),
    ...(start > 2 ? [{ key: "before", page: null }] : []),
    ...pages.slice(1, -1),
    ...(end < total - 1 ? [{ key: "after", page: null }] : []),
    ...pages.slice(-1),
  ]
})
</script>

<template>
  <Pagination>
    <PaginationButton
      aria-label="Previous page"
      :disabled="page === 1"
      @click="page -= 1"
    >
      &lsaquo;
    </PaginationButton>
    <template v-for="item in items" :key="item.key">
      <PaginationEllipsis v-if="item.page === null" />
      <PaginationButton
        v-else
        :active="page === item.page"
        @click="page = item.page"
      >
        {{ item.page }}
      </PaginationButton>
    </template>
    <PaginationButton
      aria-label="Next page"
      :disabled="page === total"
      @click="page += 1"
    >
      &rsaquo;
    </PaginationButton>
  </Pagination>
</template>
