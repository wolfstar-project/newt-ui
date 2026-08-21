---
title: Pagination
description: Numbered page buttons with previous/next controls, plus a divider-style load-more row.
---

<ComponentPreview name="PaginationDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add pagination
```

## Usage

```vue
<script setup lang="ts">
import {
  LoadMore,
  Pagination,
  PaginationButton,
  PaginationEllipsis,
} from "@/components/ui/pagination"
</script>

<template>
  <Pagination>
    <PaginationButton aria-label="Previous page">&lsaquo;</PaginationButton>
    <PaginationButton active>1</PaginationButton>
    <PaginationButton>2</PaginationButton>
    <PaginationEllipsis />
    <PaginationButton>10</PaginationButton>
    <PaginationButton aria-label="Next page">&rsaquo;</PaginationButton>
  </Pagination>

  <LoadMore>
    <Button variant="secondary" size="sm">Load more</Button>
  </LoadMore>
</template>
```
