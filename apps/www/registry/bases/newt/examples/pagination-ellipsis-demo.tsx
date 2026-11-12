"use client"

import * as React from "react"

import {
  Pagination,
  PaginationButton,
  PaginationEllipsis,
} from "@/registry/bases/newt/ui/pagination"

const TOTAL = 12

/**
 * The first page, the last, the current one and its neighbours. An item
 * without a page is a gap.
 */
function pageItems(current: number): { key: string; page: number | null }[] {
  const start = Math.max(2, current - 1)
  const end = Math.min(TOTAL - 1, current + 1)
  const pages = [
    1,
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    TOTAL,
  ].map((page) => ({ key: String(page), page }))
  return [
    ...pages.slice(0, 1),
    ...(start > 2 ? [{ key: "before", page: null }] : []),
    ...pages.slice(1, -1),
    ...(end < TOTAL - 1 ? [{ key: "after", page: null }] : []),
    ...pages.slice(-1),
  ]
}

/*
 * Twelve pages do not fit in a row. `PaginationEllipsis` stands in for the
 * ones left out on either side of the current page.
 */
export default function PaginationEllipsisDemo() {
  const [page, setPage] = React.useState(6)

  return (
    <Pagination>
      <PaginationButton
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        &lsaquo;
      </PaginationButton>
      {pageItems(page).map(({ key, page: target }) =>
        target === null ? (
          <PaginationEllipsis key={key} />
        ) : (
          <PaginationButton
            key={key}
            active={page === target}
            onClick={() => setPage(target)}
          >
            {target}
          </PaginationButton>
        )
      )}
      <PaginationButton
        aria-label="Next page"
        disabled={page === TOTAL}
        onClick={() => setPage(page + 1)}
      >
        &rsaquo;
      </PaginationButton>
    </Pagination>
  )
}
