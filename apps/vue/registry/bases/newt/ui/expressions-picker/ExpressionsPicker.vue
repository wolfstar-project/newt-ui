<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from "vue"

import { cn } from "@/lib/utils"

import {
  buildExpressionSections,
  expressionKinds,
  expressionShortcode,
  expressionsFocusRing,
  expressionsPickerVariants,
  expressionValue,
  neighbourCell,
  skinTones,
  type ExpressionCategory,
  type ExpressionItem,
  type ExpressionKind,
  type SkinTone,
} from "."
import ExpressionArt from "./ExpressionArt.vue"

const props = withDefaults(
  defineProps<{
    items?: readonly ExpressionItem[]
    categories?: readonly ExpressionCategory[]
    /** Item IDs used last, most recent first. The application stores and updates them. */
    recent?: readonly string[]
    /** The value chosen now, marked as pressed in the grid. */
    current?: string | null
    label?: string
    disabled?: boolean
  }>(),
  {
    items: () => [],
    categories: () => [],
    recent: () => [],
    current: null,
    label: "Choose an expression",
    disabled: false,
  }
)
/** Receives the item and its value in the chosen skin tone. */
const emit = defineEmits<{ select: [item: ExpressionItem, value: string] }>()

const id = useId()
const dialog = useTemplateRef<HTMLDialogElement>("dialog")
const trigger = useTemplateRef<HTMLButtonElement>("trigger")
const search = useTemplateRef<HTMLInputElement>("search")
const scroller = useTemplateRef<HTMLDivElement>("scroller")
const toneButton = useTemplateRef<HTMLButtonElement>("toneButton")
const toneRoot = useTemplateRef<HTMLDivElement>("toneRoot")
const open = shallowRef(false)
const kind = shallowRef<ExpressionKind>("emoji")
const query = shallowRef("")
const tone = shallowRef<SkinTone>(0)
const showTones = shallowRef(false)
const collapsed = shallowRef<string[]>([])
const scrolledTo = shallowRef<string | null>(null)
const activeKey = shallowRef<string | null>(null)
const hovered = shallowRef<{ item: ExpressionItem; where: string } | null>(null)

const triggerClass = `min-h-[var(--newt-expressions-target-size)] cursor-pointer rounded-sm border border-newt-border bg-newt-bg-elevated px-[var(--newt-space-3)] py-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary enabled:hover:bg-newt-bg-hover enabled:active:bg-newt-bg-active disabled:cursor-not-allowed disabled:text-newt-text-muted ${expressionsFocusRing}`

const searching = computed(() => query.value.trim().length > 0)
const sections = computed(() =>
  buildExpressionSections(
    props.items,
    props.categories,
    props.recent,
    kind.value,
    query.value
  )
)
const isOpen = (key: string) => !collapsed.value.includes(key)
const activeSection = computed(() => scrolledTo.value ?? sections.value[0]?.key)
const tabKey = computed(() => {
  const keys = sections.value
    .filter((section) => isOpen(section.key))
    .flatMap((section) =>
      section.items
        .filter((item) => !item.disabled)
        .map((item) => `${section.key}|${item.id}`)
    )
  return activeKey.value && keys.includes(activeKey.value)
    ? activeKey.value
    : keys[0]
})
const resultCount = computed(() =>
  sections.value.reduce((count, section) => count + section.items.length, 0)
)
const toneSample = computed(() => skinTones[tone.value])

function where(item: ExpressionItem) {
  return (
    props.categories.find((category) => category.id === item.category)?.label ??
    ""
  )
}
function isCurrent(item: ExpressionItem) {
  return (
    props.current != null &&
    (item.value === props.current ||
      item.skins?.includes(props.current) === true)
  )
}
const currentItem = computed(() => {
  const item = props.items.find(
    (entry) => entry.kind === kind.value && isCurrent(entry)
  )
  return item ? { item, where: where(item) } : null
})
const preview = computed(() => hovered.value ?? currentItem.value)

function toggleSection(key: string) {
  collapsed.value = isOpen(key)
    ? [...collapsed.value, key]
    : collapsed.value.filter((entry) => entry !== key)
}
async function goTo(key: string) {
  collapsed.value = collapsed.value.filter((entry) => entry !== key)
  scrolledTo.value = key
  await nextTick()
  const section = scroller.value?.querySelector<HTMLElement>(
    `[data-section="${key}"]`
  )
  if (section && scroller.value) scroller.value.scrollTop = section.offsetTop
}
function onScroll() {
  const element = scroller.value
  if (!element) return
  let found: string | null = null
  for (const section of element.querySelectorAll<HTMLElement>(
    "[data-section]"
  )) {
    if (section.offsetTop > element.scrollTop + 8) break
    found = section.dataset.section ?? null
  }
  if (found) scrolledTo.value = found
}

function show() {
  if (props.disabled) return
  query.value = ""
  hovered.value = null
  showTones.value = false
  dialog.value?.showModal()
  open.value = true
  search.value?.focus()
}
function close() {
  dialog.value?.close()
}
function closed() {
  open.value = false
  showTones.value = false
  trigger.value?.focus()
}
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  }
)

function changeKind(next: ExpressionKind) {
  kind.value = next
  scrolledTo.value = null
  hovered.value = null
  showTones.value = false
  if (scroller.value) scroller.value.scrollTop = 0
}
function tabKeyDown(event: KeyboardEvent, index: number) {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return
  const rtl = getComputedStyle(target).direction === "rtl"
  const count = expressionKinds.length
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? count - 1
        : event.key === (rtl ? "ArrowLeft" : "ArrowRight")
          ? (index + 1) % count
          : event.key === (rtl ? "ArrowRight" : "ArrowLeft")
            ? (index + count - 1) % count
            : -1
  const nextTab = expressionKinds[next]
  if (!nextTab) return
  event.preventDefault()
  changeKind(nextTab.kind)
  dialog.value
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    .item(next)
    ?.focus()
}
function gridKeyDown(event: KeyboardEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement) || !target.matches("[data-cell]")) return
  const cells = [
    ...(scroller.value?.querySelectorAll<HTMLElement>(
      "[data-cell]:not(:disabled)"
    ) ?? []),
  ]
  const rtl = getComputedStyle(target).direction === "rtl"
  const next = neighbourCell(cells, cells.indexOf(target), event.key, rtl)
  if (!next) return
  event.preventDefault()
  next.focus()
  next.scrollIntoView({ block: "nearest" })
}
function focusFirstCell() {
  scroller.value
    ?.querySelector<HTMLElement>('[data-cell][tabindex="0"]')
    ?.focus()
}
function onDialogKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && showTones.value) {
    event.preventDefault()
    showTones.value = false
    toneButton.value?.focus()
    return
  }
  if (event.key !== "Tab") return
  const controls = [
    ...(dialog.value?.querySelectorAll<HTMLElement>(
      "button:not(:disabled), input:not(:disabled)"
    ) ?? []),
  ].filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
  )
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

function pickTone(next: SkinTone) {
  tone.value = next
  showTones.value = false
  toneButton.value?.focus()
}
function outside(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof Node) || !toneRoot.value?.contains(target))
    showTones.value = false
}
watch(showTones, async (shown) => {
  document.removeEventListener("pointerdown", outside)
  if (!shown) return
  document.addEventListener("pointerdown", outside)
  await nextTick()
  toneRoot.value?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus()
})
onBeforeUnmount(() => document.removeEventListener("pointerdown", outside))

function select(item: ExpressionItem) {
  if (props.disabled || item.disabled) return
  close()
  emit("select", item, expressionValue(item, tone.value))
}
function focusCell(key: string, item: ExpressionItem) {
  activeKey.value = key
  hovered.value = { item, where: where(item) }
}
function clearQuery() {
  query.value = ""
  search.value?.focus()
}
</script>

<template>
  <div class="inline-block">
    <button
      ref="trigger"
      type="button"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="id"
      :class="triggerClass"
      @click="show"
    >
      {{ label }}
    </button>
    <dialog
      :id="id"
      ref="dialog"
      :aria-label="label"
      class="m-auto box-border h-[min(var(--newt-expressions-height),calc(100dvh-2*var(--newt-space-3)))] w-[min(var(--newt-expressions-width),calc(100%-2*var(--newt-space-3)))] max-w-none overflow-hidden rounded-lg border border-newt-border bg-newt-bg-surface p-0 font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary shadow-elevation-high backdrop:bg-[color-mix(in_srgb,var(--newt-bg-base)_80%,transparent)] open:flex open:flex-col"
      @close="closed"
      @keydown="onDialogKeyDown"
      @click.self="close"
    >
      <div
        class="flex shrink-0 items-center gap-[var(--newt-space-2)] px-[var(--newt-space-3)] pt-[var(--newt-space-3)]"
      >
        <div
          role="tablist"
          aria-label="Expression type"
          class="flex items-center gap-[var(--newt-space-2)]"
        >
          <button
            v-for="(tab, index) in expressionKinds"
            :id="`${id}-${tab.kind}`"
            :key="tab.kind"
            role="tab"
            type="button"
            :aria-selected="kind === tab.kind"
            :aria-controls="`${id}-panel`"
            :tabindex="kind === tab.kind ? 0 : -1"
            :class="expressionsPickerVariants({ selected: kind === tab.kind })"
            @click="changeKind(tab.kind)"
            @keydown="tabKeyDown($event, index)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div
        class="flex shrink-0 items-center gap-[var(--newt-space-2)] border-b border-newt-border p-[var(--newt-space-3)]"
      >
        <div class="relative min-w-0 flex-1">
          <input
            ref="search"
            v-model="query"
            type="text"
            autocomplete="off"
            spellcheck="false"
            aria-label="Search expressions"
            placeholder="Search by name or keyword"
            :class="`box-border h-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] w-full rounded-md border-0 bg-newt-bg-input pe-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] ps-[calc(var(--newt-space-3)*3)] font-sans text-[length:var(--newt-font-size-sm)] text-newt-text-primary placeholder:text-newt-text-muted ${expressionsFocusRing}`"
            @input="hovered = null"
            @keydown.down.prevent="focusFirstCell"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            class="pointer-events-none absolute start-[var(--newt-space-3)] top-1/2 size-[calc(var(--newt-space-3)+var(--newt-space-1))] -translate-y-1/2 fill-none stroke-newt-text-secondary stroke-2"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="m11 11 4 4" stroke-linecap="round" />
          </svg>
          <button
            v-if="query"
            type="button"
            aria-label="Clear search"
            :class="
              cn(
                expressionsPickerVariants(),
                'absolute end-[var(--newt-space-1)] top-1/2 min-h-0 min-w-0 -translate-y-1/2 size-[calc(var(--newt-expressions-target-size)-var(--newt-space-3)-var(--newt-space-2))] p-0'
              )
            "
            @click="clearQuery"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div v-if="kind === 'emoji'" ref="toneRoot" class="relative shrink-0">
          <button
            ref="toneButton"
            type="button"
            :aria-label="`Skin tone: ${toneSample?.label}`"
            :aria-expanded="showTones"
            :class="
              cn(
                expressionsPickerVariants({ selected: showTones }),
                'p-0 no-underline'
              )
            "
            @click="showTones = !showTones"
          >
            <span
              aria-hidden="true"
              class="text-[length:var(--newt-font-size-expression)] leading-none"
              >{{ toneSample?.sample }}</span
            >
          </button>
          <div
            v-if="showTones"
            role="group"
            aria-label="Skin tone"
            class="absolute -end-[var(--newt-space-1)] -top-[var(--newt-space-1)] z-20 flex flex-col gap-[var(--newt-space-1)] rounded-md border border-newt-border bg-newt-bg-floating p-[var(--newt-space-1)] shadow-elevation-high"
          >
            <button
              v-for="option in skinTones"
              :key="option.tone"
              type="button"
              :aria-label="option.label"
              :title="option.label"
              :aria-pressed="tone === option.tone"
              :class="
                cn(
                  expressionsPickerVariants(),
                  'p-0 aria-pressed:bg-newt-bg-active aria-pressed:shadow-[inset_0_0_0_2px_var(--newt-brand)]'
                )
              "
              @click="pickTone(option.tone)"
            >
              <span
                aria-hidden="true"
                class="text-[length:var(--newt-font-size-expression)] leading-none"
                >{{ option.sample }}</span
              >
            </button>
          </div>
        </div>
      </div>

      <div
        :id="`${id}-panel`"
        role="tabpanel"
        :aria-labelledby="`${id}-${kind}`"
        class="flex min-h-0 flex-1"
      >
        <nav
          v-if="!searching && sections.length > 1"
          aria-label="Categories"
          class="flex w-[calc(var(--newt-expressions-target-size)+var(--newt-space-2))] shrink-0 flex-col items-center gap-[var(--newt-space-1)] overflow-y-auto overflow-x-hidden border-e border-newt-border p-[var(--newt-space-2)] ![scrollbar-width:none]"
        >
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            :aria-label="section.label"
            :title="section.label"
            :aria-current="activeSection === section.key ? 'true' : undefined"
            :class="
              cn(
                expressionsPickerVariants(),
                'relative shrink-0 p-0',
                activeSection === section.key &&
                  `text-newt-text-primary before:absolute before:-start-[var(--newt-space-2)] before:top-1/2 before:h-[calc(var(--newt-space-3)+var(--newt-space-2))] before:w-[var(--newt-space-1)] before:-translate-y-1/2 before:rounded-e-full before:bg-newt-text-primary before:content-['']`
              )
            "
            @click="goTo(section.key)"
          >
            <img
              v-if="section.iconSrc"
              :src="section.iconSrc"
              alt=""
              class="size-[calc(var(--newt-expressions-target-size)-var(--newt-space-3)-var(--newt-space-1))] rounded-full"
            />
            <span
              v-else
              aria-hidden="true"
              class="text-[length:calc(var(--newt-font-size-expression)*0.625)] leading-none"
              >{{ section.glyph ?? section.label.slice(0, 1) }}</span
            >
          </button>
        </nav>

        <div
          ref="scroller"
          class="relative min-w-0 flex-1 overflow-y-auto px-[var(--newt-space-2)] pb-[var(--newt-space-2)]"
          @scroll.passive="onScroll"
          @keydown="gridKeyDown"
          @mouseleave="hovered = null"
        >
          <section
            v-for="section in sections"
            :key="section.key"
            :data-section="section.key"
            :aria-labelledby="`${id}-${section.key}-title`"
          >
            <h3
              :id="`${id}-${section.key}-title`"
              class="sticky top-0 z-10 m-0 bg-newt-bg-surface pb-[var(--newt-space-1)] pt-[var(--newt-space-2)] text-[length:var(--newt-font-size-sm)] font-semibold text-newt-text-secondary"
            >
              <button
                v-if="section.collapsible"
                type="button"
                :aria-expanded="isOpen(section.key)"
                :aria-controls="`${id}-${section.key}`"
                :class="`inline-flex max-w-full cursor-pointer items-center gap-[var(--newt-space-2)] rounded-sm border-0 bg-transparent px-[var(--newt-space-1)] font-[inherit] text-[inherit] hover:text-newt-text-primary ${expressionsFocusRing}`"
                @click="toggleSection(section.key)"
              >
                <img
                  v-if="section.iconSrc"
                  :src="section.iconSrc"
                  alt=""
                  class="size-[calc(var(--newt-space-3)+var(--newt-space-1))] shrink-0 rounded-full"
                />
                <span
                  v-else-if="section.glyph"
                  aria-hidden="true"
                  class="shrink-0 leading-none"
                  >{{ section.glyph }}</span
                >
                <span class="min-w-0 truncate">{{ section.label }}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  :class="
                    cn(
                      'size-[var(--newt-space-3)] shrink-0 fill-none stroke-current stroke-2',
                      !isOpen(section.key) &&
                        '[transform:rotate(calc(-90deg*var(--newt-dir)))]'
                    )
                  "
                >
                  <path
                    d="m4 6 4 4 4-4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <span v-else class="px-[var(--newt-space-1)]">{{
                section.label
              }}</span>
            </h3>
            <div
              v-if="isOpen(section.key)"
              :id="`${id}-${section.key}`"
              :class="
                cn(
                  'grid pt-[var(--newt-space-1)]',
                  kind === 'emoji'
                    ? 'grid-cols-[repeat(auto-fill,var(--newt-expressions-target-size))]'
                    : 'grid-cols-[repeat(auto-fill,minmax(var(--newt-expressions-preview-size),1fr))] gap-[var(--newt-space-1)]'
                )
              "
            >
              <button
                v-for="item in section.items"
                :key="`${section.key}|${item.id}`"
                type="button"
                data-cell
                :disabled="disabled || item.disabled"
                :tabindex="`${section.key}|${item.id}` === tabKey ? 0 : -1"
                :aria-label="
                  item.disabled ? `${item.label}, unavailable` : item.label
                "
                :aria-pressed="isCurrent(item)"
                :class="
                  cn(
                    'flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent p-0 enabled:hover:bg-newt-bg-hover aria-pressed:bg-newt-bg-active aria-pressed:shadow-[inset_0_0_0_2px_var(--newt-brand)] disabled:cursor-not-allowed disabled:border-dashed disabled:border-newt-border disabled:opacity-50',
                    kind === 'emoji'
                      ? 'size-[var(--newt-expressions-target-size)]'
                      : 'aspect-square w-full',
                    expressionsFocusRing
                  )
                "
                @click="select(item)"
                @focus="focusCell(`${section.key}|${item.id}`, item)"
                @mouseenter="hovered = { item, where: where(item) }"
              >
                <ExpressionArt
                  :item="item"
                  :value="expressionValue(item, tone)"
                  :large="kind !== 'emoji'"
                />
              </button>
            </div>
          </section>
          <div
            v-if="sections.length === 0"
            role="status"
            class="flex flex-col items-center px-[var(--newt-space-3)] py-[calc(var(--newt-space-3)*3)] text-center text-newt-text-secondary"
          >
            <p class="m-0 font-semibold text-newt-text-primary">
              {{
                searching
                  ? "No expressions match your search."
                  : "Nothing here yet."
              }}
            </p>
            <p class="m-0">
              {{
                searching
                  ? "Try another word or another tab."
                  : "Try another tab."
              }}
            </p>
          </div>
          <p v-else-if="searching" role="status" class="sr-only">
            {{ resultCount === 1 ? "1 result" : `${resultCount} results` }}
          </p>
        </div>
      </div>

      <div
        class="flex h-[calc(var(--newt-expressions-target-size)+var(--newt-space-3))] shrink-0 items-center gap-[var(--newt-space-3)] border-t border-newt-border bg-newt-bg-floating px-[var(--newt-space-3)]"
      >
        <template v-if="preview">
          <span
            aria-hidden="true"
            class="flex size-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] shrink-0 items-center justify-center overflow-hidden"
          >
            <img
              v-if="preview.item.src"
              :src="preview.item.src"
              alt=""
              class="size-full object-contain"
            />
            <span
              v-else-if="preview.item.kind === 'emoji'"
              class="text-[length:var(--newt-font-size-expression)] leading-none"
              >{{ expressionValue(preview.item, tone) }}</span
            >
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="truncate font-semibold">{{
              expressionShortcode(preview.item)
            }}</span>
            <span
              v-if="preview.where"
              class="truncate text-[length:var(--newt-font-size-xs)] text-newt-text-secondary"
              >from
              <strong class="font-semibold">{{ preview.where }}</strong></span
            >
          </span>
        </template>
        <span v-else class="text-newt-text-secondary"
          >Hover or focus an expression to preview it.</span
        >
      </div>
    </dialog>
  </div>
</template>
