<script setup lang="ts">
import { ref } from "vue"

import { Button } from "@/lib/registry/default/ui/button"
import {
  LoadMore,
  Pagination,
  PaginationButton,
} from "@/lib/registry/default/ui/pagination"

const pages = [1, 2, 3]
const page = ref(1)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Pagination>
      <PaginationButton
        aria-label="Previous page"
        :disabled="page === 1"
        @click="page = Math.max(1, page - 1)"
      >
        &lsaquo;
      </PaginationButton>
      <PaginationButton
        v-for="n in pages"
        :key="n"
        :active="page === n"
        @click="page = n"
      >
        {{ n }}
      </PaginationButton>
      <PaginationButton
        aria-label="Next page"
        :disabled="page === pages.length"
        @click="page = Math.min(pages.length, page + 1)"
      >
        &rsaquo;
      </PaginationButton>
    </Pagination>

    <LoadMore>
      <Button variant="secondary" size="sm">Load more</Button>
    </LoadMore>
  </div>
</template>
