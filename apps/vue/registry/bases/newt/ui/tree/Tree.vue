<script setup lang="ts">
import { computed, ref, useId, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { TreeNode } from "."

/*
 * A nested list drawn flat: every row is a sibling, and `aria-level` says how
 * deep it sits. That is a tree to a screen reader all the same, and it makes
 * "the next row down" the next element, which is what the arrow keys need.
 * The tree is one tab stop; a branch toggles and a leaf is selected.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    items: readonly TreeNode[]
    /** Ids of the branches that start open. */
    defaultExpanded?: readonly string[]
    /** Accessible name of the tree. */
    label?: string
  }>(),
  { defaultExpanded: () => [] }
)

/** The selected leaf's id. */
const selected = defineModel<string>()

interface Row {
  readonly node: TreeNode
  readonly level: number
  readonly parent: string | undefined
  readonly position: number
  readonly size: number
}

const baseId = useId()
const expanded = ref<readonly string[]>(props.defaultExpanded)
const focused = ref<string | undefined>(undefined)

/* The rows a reader can see, in order: a closed branch hides what is under it. */
function visibleRows(
  nodes: readonly TreeNode[],
  level = 1,
  parent?: string
): Row[] {
  return nodes.flatMap((node, index) => [
    { node, level, parent, position: index + 1, size: nodes.length },
    ...(node.children !== undefined && expanded.value.includes(node.id)
      ? visibleRows(node.children, level + 1, node.id)
      : []),
  ])
}

const rows = computed(() => visibleRows(props.items))
const ids = computed(() => rows.value.map((row) => row.node.id))
/* The one tab stop: where focus last was, else the selection, else the top. */
const tabStop = computed(
  () =>
    [focused.value, selected.value].find(
      (id) => id !== undefined && ids.value.includes(id)
    ) ?? ids.value[0]
)

function focus(id: string | undefined) {
  if (id !== undefined) document.getElementById(`${baseId}-${id}`)?.focus()
}

function toggle(id: string, open: boolean) {
  expanded.value = open
    ? [...expanded.value, id]
    : expanded.value.filter((each) => each !== id)
}

function activate(node: TreeNode) {
  if (node.children !== undefined) {
    toggle(node.id, !expanded.value.includes(node.id))
    return
  }
  selected.value = node.id
}

function onKeydown(event: KeyboardEvent, row: Row) {
  if (!(event.currentTarget instanceof HTMLElement)) return
  const index = ids.value.indexOf(row.node.id)
  const forward =
    getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
  const horizontal =
    event.key === "ArrowRight"
      ? forward
      : event.key === "ArrowLeft"
        ? -forward
        : 0
  const branch = row.node.children !== undefined
  const open = expanded.value.includes(row.node.id)

  if (event.key === "ArrowDown") focus(ids.value[index + 1])
  else if (event.key === "ArrowUp") focus(ids.value[index - 1])
  else if (event.key === "Home") focus(ids.value[0])
  else if (event.key === "End") focus(ids.value.at(-1))
  else if (event.key === "Enter" || event.key === " ") activate(row.node)
  else if (horizontal === 1) {
    if (branch && !open) toggle(row.node.id, true)
    else if (branch) focus(ids.value[index + 1])
  } else if (horizontal === -1) {
    if (branch && open) toggle(row.node.id, false)
    else focus(row.parent)
  } else return
  event.preventDefault()
}
</script>

<template>
  <ul
    role="tree"
    :aria-label="props.label"
    :class="cn('m-0 flex w-full list-none flex-col gap-0.5 p-0', props.class)"
  >
    <li
      v-for="row in rows"
      :id="`${baseId}-${row.node.id}`"
      :key="row.node.id"
      role="treeitem"
      :aria-level="row.level"
      :aria-posinset="row.position"
      :aria-setsize="row.size"
      :aria-expanded="
        row.node.children !== undefined
          ? expanded.includes(row.node.id)
          : undefined
      "
      :aria-selected="
        row.node.children !== undefined ? undefined : row.node.id === selected
      "
      :tabindex="row.node.id === tabStop ? 0 : -1"
      :style="{ paddingInlineStart: `${8 + (row.level - 1) * 16}px` }"
      :class="
        cn(
          'group flex min-h-8 cursor-pointer select-none items-center gap-1.5 rounded-sm py-1 pe-2 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link',
          row.node.children !== undefined
            ? 'text-xs font-bold uppercase tracking-[0.02em]'
            : 'text-[15px] font-medium leading-5',
          row.node.children === undefined && row.node.id === selected
            ? 'bg-newt-bg-active text-newt-text-primary'
            : 'text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-secondary'
        )
      "
      @click="activate(row.node)"
      @focus="focused = row.node.id"
      @keydown="onKeydown($event, row)"
    >
      <svg
        v-if="row.node.children !== undefined"
        viewBox="0 0 16 16"
        aria-hidden="true"
        class="h-3 w-3 shrink-0 group-aria-expanded:rotate-90 rtl:-scale-x-100 rtl:group-aria-expanded:scale-x-100"
      >
        <path
          fill="currentColor"
          d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
        />
      </svg>
      <span v-else aria-hidden="true" class="w-5 shrink-0 text-center">
        {{ row.node.prefix }}
      </span>
      <span class="min-w-0 flex-1 truncate">{{ row.node.label }}</span>
      <span
        v-if="row.node.badge !== undefined"
        class="min-w-4 rounded-full bg-newt-danger px-[5px] text-center text-[11px] font-bold leading-4 text-newt-on-accent"
      >
        {{ row.node.badge }}
      </span>
    </li>
  </ul>
</template>
