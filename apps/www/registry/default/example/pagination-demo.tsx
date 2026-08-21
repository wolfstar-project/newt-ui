"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  LoadMore,
  Pagination,
  PaginationButton,
} from "@/registry/default/ui/pagination"

const PAGES = [1, 2, 3]

export default function PaginationDemo() {
  const [page, setPage] = React.useState(1)

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Pagination>
        <PaginationButton
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &lsaquo;
        </PaginationButton>
        {PAGES.map((n) => (
          <PaginationButton
            key={n}
            active={page === n}
            onClick={() => setPage(n)}
          >
            {n}
          </PaginationButton>
        ))}
        <PaginationButton
          aria-label="Next page"
          disabled={page === PAGES.length}
          onClick={() => setPage((p) => Math.min(PAGES.length, p + 1))}
        >
          &rsaquo;
        </PaginationButton>
      </Pagination>

      <LoadMore>
        <Button variant="secondary" size="sm">
          Load more
        </Button>
      </LoadMore>
    </div>
  )
}
