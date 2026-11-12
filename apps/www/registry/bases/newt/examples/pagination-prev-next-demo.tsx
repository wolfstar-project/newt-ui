"use client"

import * as React from "react"

import {
  Pagination,
  PaginationButton,
} from "@/registry/bases/newt/ui/pagination"

const TOTAL = 8

/*
 * When nobody needs to jump to a page, two labelled buttons and a position
 * are enough. Both buttons disable themselves at their end of the range.
 */
export default function PaginationPrevNextDemo() {
  const [page, setPage] = React.useState(1)

  return (
    <Pagination className="gap-3">
      <PaginationButton
        className="px-3"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </PaginationButton>
      <span aria-live="polite" className="text-[13px] text-newt-text-muted">
        Page {page} of {TOTAL}
      </span>
      <PaginationButton
        className="px-3"
        disabled={page === TOTAL}
        onClick={() => setPage(page + 1)}
      >
        Next
      </PaginationButton>
    </Pagination>
  )
}
