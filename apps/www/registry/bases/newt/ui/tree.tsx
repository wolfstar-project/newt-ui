"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** One row. A node with `children` is a branch that opens and closes. */
export interface TreeNode {
  /** Unique across the whole tree. */
  id: string
  label: string
  /** A short sign before the label, such as `#`. */
  prefix?: string
  /** A count shown at the end of the row, such as unread messages. */
  badge?: number
  children?: readonly TreeNode[]
}

export interface TreeProps extends Omit<
  React.ComponentProps<"ul">,
  "children" | "defaultValue"
> {
  items: readonly TreeNode[]
  /** The selected leaf's id. Leave undefined to let the tree own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Ids of the branches that start open. */
  defaultExpanded?: readonly string[]
  /** Accessible name of the tree. */
  label?: string
}

interface Row {
  readonly node: TreeNode
  readonly level: number
  readonly parent: string | undefined
  readonly position: number
  readonly size: number
}

/* The rows a reader can see, in order: a closed branch hides what is under it. */
function visibleRows(
  nodes: readonly TreeNode[],
  expanded: readonly string[],
  level = 1,
  parent?: string
): Row[] {
  return nodes.flatMap((node, index) => [
    { node, level, parent, position: index + 1, size: nodes.length },
    ...(node.children !== undefined && expanded.includes(node.id)
      ? visibleRows(node.children, expanded, level + 1, node.id)
      : []),
  ])
}

/*
 * A nested list drawn flat: every row is a sibling, and `aria-level` says how
 * deep it sits. That is a tree to a screen reader all the same, and it makes
 * "the next row down" the next element, which is what the arrow keys need.
 * The tree is one tab stop; a branch toggles and a leaf is selected.
 */
const Tree = React.forwardRef<HTMLUListElement, TreeProps>(
  (
    {
      className,
      items,
      value,
      defaultValue,
      onValueChange,
      defaultExpanded = [],
      label,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId()
    const [internal, setInternal] = React.useState(defaultValue)
    const [expanded, setExpanded] =
      React.useState<readonly string[]>(defaultExpanded)
    const [focused, setFocused] = React.useState<string | undefined>(undefined)
    const selected = value ?? internal

    const rows = visibleRows(items, expanded)
    const ids = rows.map((row) => row.node.id)
    /* The one tab stop: where focus last was, else the selection, else the top. */
    const tabStop =
      [focused, selected].find((id) => id !== undefined && ids.includes(id)) ??
      ids[0]

    const focus = (id: string | undefined) => {
      if (id !== undefined) document.getElementById(`${baseId}-${id}`)?.focus()
    }

    const toggle = (id: string, open: boolean) => {
      setExpanded(
        open ? [...expanded, id] : expanded.filter((each) => each !== id)
      )
    }

    const activate = (node: TreeNode) => {
      if (node.children !== undefined) {
        toggle(node.id, !expanded.includes(node.id))
        return
      }
      if (value === undefined) setInternal(node.id)
      onValueChange?.(node.id)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, row: Row) => {
      const index = ids.indexOf(row.node.id)
      const forward =
        getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
      const horizontal =
        event.key === "ArrowRight"
          ? forward
          : event.key === "ArrowLeft"
            ? -forward
            : 0
      const branch = row.node.children !== undefined
      const open = expanded.includes(row.node.id)

      if (event.key === "ArrowDown") focus(ids[index + 1])
      else if (event.key === "ArrowUp") focus(ids[index - 1])
      else if (event.key === "Home") focus(ids[0])
      else if (event.key === "End") focus(ids.at(-1))
      else if (event.key === "Enter" || event.key === " ") activate(row.node)
      else if (horizontal === 1) {
        if (branch && !open) toggle(row.node.id, true)
        else if (branch) focus(ids[index + 1])
      } else if (horizontal === -1) {
        if (branch && open) toggle(row.node.id, false)
        else focus(row.parent)
      } else return
      event.preventDefault()
    }

    return (
      <ul
        ref={ref}
        role="tree"
        aria-label={label}
        className={cn(
          "m-0 flex w-full list-none flex-col gap-0.5 p-0",
          className
        )}
        {...props}
      >
        {rows.map((row) => {
          const { node } = row
          const branch = node.children !== undefined
          const isSelected = !branch && node.id === selected
          return (
            <li
              key={node.id}
              id={`${baseId}-${node.id}`}
              role="treeitem"
              aria-level={row.level}
              aria-posinset={row.position}
              aria-setsize={row.size}
              aria-expanded={branch ? expanded.includes(node.id) : undefined}
              aria-selected={branch ? undefined : isSelected}
              tabIndex={node.id === tabStop ? 0 : -1}
              onClick={() => activate(node)}
              onFocus={() => setFocused(node.id)}
              onKeyDown={(event) => onKeyDown(event, row)}
              style={{ paddingInlineStart: 8 + (row.level - 1) * 16 }}
              className={cn(
                "group flex min-h-8 cursor-pointer select-none items-center gap-1.5 rounded-sm py-1 pe-2 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link",
                branch
                  ? "text-xs font-bold uppercase tracking-[0.02em]"
                  : "text-[15px] font-medium leading-5",
                isSelected
                  ? "bg-newt-bg-active text-newt-text-primary"
                  : "text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-secondary"
              )}
            >
              {branch ? (
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 group-aria-expanded:rotate-90 rtl:-scale-x-100 rtl:group-aria-expanded:scale-x-100"
                >
                  <path
                    fill="currentColor"
                    d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
                  />
                </svg>
              ) : (
                <span aria-hidden="true" className="w-5 shrink-0 text-center">
                  {node.prefix}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">{node.label}</span>
              {node.badge === undefined ? null : (
                <span className="min-w-4 rounded-full bg-newt-danger px-[5px] text-center text-[11px] font-bold leading-4 text-white">
                  {node.badge}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }
)
Tree.displayName = "Tree"

export { Tree }
