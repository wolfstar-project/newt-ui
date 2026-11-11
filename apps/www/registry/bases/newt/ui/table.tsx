import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A real `<table>`, so rows, columns and headers are announced as what they
 * are. The wrapper is what scrolls sideways on a narrow screen, which keeps
 * the table itself from pushing the page wide. `className` lands on the
 * table; the wrapper takes `wrapperClassName`.
 */
export interface TableProps extends React.ComponentProps<"table"> {
  wrapperClassName?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-md border border-newt-border bg-newt-bg-surface",
        wrapperClassName
      )}
    >
      <table
        ref={ref}
        className={cn(
          "w-full border-collapse text-sm leading-5 text-newt-text-secondary",
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>((props, ref) => <thead ref={ref} {...props} />)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&>tr:hover]:bg-newt-bg-hover [&>tr:not(:first-child)>td]:border-t [&>tr:not(:first-child)>td]:border-newt-border",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

export interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Marks the row as chosen, for a table whose rows can be picked. */
  selected?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected}
      className={cn(
        "aria-selected:bg-newt-bg-active aria-selected:text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

/** Which way a column is sorted. `none` means sortable, not sorted by. */
export type TableSort = "ascending" | "descending" | "none"

export interface TableHeadProps extends Omit<
  React.ComponentProps<"th">,
  "align"
> {
  /** `end` aligns the column to the inline end, for numbers. */
  align?: "start" | "end"
  /** Makes the heading a button and states the column's sort order. */
  sort?: TableSort
  /** Called when the sortable heading is activated. */
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      align = "start",
      sort,
      onSort,
      scope = "col",
      children,
      ...props
    },
    ref
  ) => (
    <th
      ref={ref}
      scope={scope}
      aria-sort={sort}
      className={cn(
        "whitespace-nowrap border-b border-newt-border bg-newt-bg-elevated px-4 py-2.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted",
        align === "end" ? "text-end" : "text-start",
        className
      )}
      {...props}
    >
      {sort === undefined ? (
        children
      ) : (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "-mx-1.5 -my-1 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 uppercase tracking-[inherit] hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link",
            sort !== "none" && "text-newt-text-primary"
          )}
        >
          {children}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={cn(
              "h-3 w-3",
              sort === "none" && "opacity-0",
              sort === "descending" && "rotate-180"
            )}
          >
            <path
              fill="currentColor"
              d="M8 3.5a1 1 0 0 1 .7.3l3.5 3.5a1 1 0 0 1-1.4 1.4L8 5.9 5.2 8.7a1 1 0 0 1-1.4-1.4l3.5-3.5a1 1 0 0 1 .7-.3Z"
            />
          </svg>
        </button>
      )}
    </th>
  )
)
TableHead.displayName = "TableHead"

export interface TableCellProps extends Omit<
  React.ComponentProps<"td">,
  "align"
> {
  /** `end` aligns the cell to the inline end and sets tabular figures. */
  align?: "start" | "end"
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = "start", ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "whitespace-nowrap px-4 py-2.5",
        align === "end" ? "text-end tabular-nums" : "text-start",
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption">
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "caption-bottom border-t border-newt-border px-4 py-2.5 text-start text-xs text-newt-text-muted",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
