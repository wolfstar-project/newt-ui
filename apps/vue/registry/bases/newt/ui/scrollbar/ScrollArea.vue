<script setup lang="ts">
import {
  useTemplateRef,
  watchEffect,
  type HTMLAttributes,
  type StyleValue,
} from "vue"

import { cn } from "@/lib/utils"

import { scrollbarAutoHideClassName, scrollbarClassName } from "."

/*
 * `class`, `style` and `dir` land on the outer box. Every other attribute
 * lands on the viewport, which is the element that scrolls. The two are one
 * element unless `variant` is `overlay`.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    style?: StyleValue
    dir?: HTMLAttributes["dir"]
    /**
     * `native` styles the browser's scrollbar, which keeps a lane beside the
     * content. `overlay` draws a thumb over the content instead, so the box
     * keeps its full width. It scrolls on the block axis only, and renders an
     * outer box around the viewport.
     */
    variant?: "native" | "overlay"
    /**
     * Hide the thumb until the pointer is over the area, keyboard focus is
     * inside it, or it scrolls.
     */
    autoHide?: boolean
    /**
     * Put the viewport in the tab order so it can be scrolled from the keyboard
     * (WCAG 2.1.1). Off by default: a focusable region only helps when the area
     * actually scrolls and holds no other focusable content.
     */
    focusable?: boolean
    /** Accessible name of the focusable viewport. */
    viewportLabel?: string
    /**
     * Classes for the element that scrolls. With `overlay`, padding that
     * should scroll with the content belongs here.
     */
    viewportClass?: HTMLAttributes["class"]
  }>(),
  { variant: "native", viewportLabel: "Scrollable region" }
)

/*
 * A focusable region shows its focus inside its own box, where an ancestor
 * with `overflow: hidden` cannot clip it.
 */
const focusRingClassName =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link"

/** How long an auto-hiding thumb stays after the last scroll, in ms. */
const HIDE_DELAY = 800

const root = useTemplateRef<HTMLDivElement>("root")
const viewport = useTemplateRef<HTMLDivElement>("viewport")
const track = useTemplateRef<HTMLDivElement>("track")
const thumb = useTemplateRef<HTMLDivElement>("thumb")

/** The element that scrolls, to read or set its scroll position. */
defineExpose({ viewport })

/**
 * Wires the behaviour CSS cannot express and returns its teardown. The
 * viewport scrolls natively, so the keyboard, the wheel and touch need nothing
 * from here. `box` is the element that carries `data-scrolling`.
 */
function attachScrollbar(
  box: HTMLElement,
  scroller: HTMLElement,
  autoHide: boolean,
  overlay?: { track: HTMLElement; thumb: HTMLElement }
): () => void {
  const abort = new AbortController()
  const { signal } = abort
  let drag: { y: number; scrollTop: number; ratio: number } | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  /*
   * Hover and focus are the stylesheet's. This covers a scroll that neither
   * explains, such as a new message or a touch.
   */
  function showWhileScrolling() {
    if (!autoHide) return
    box.setAttribute("data-scrolling", "")
    clearTimeout(hideTimer)
    if (drag) return
    hideTimer = setTimeout(
      () => box.removeAttribute("data-scrolling"),
      HIDE_DELAY
    )
  }

  scroller.addEventListener("scroll", showWhileScrolling, {
    passive: true,
    signal,
  })

  if (overlay) {
    const { track: rail, thumb: handle } = overlay

    const draw = () => {
      const overflow = scroller.scrollHeight - scroller.clientHeight
      rail.hidden = overflow < 1
      if (rail.hidden) return
      const length = rail.clientHeight
      handle.style.height = `${(scroller.clientHeight / scroller.scrollHeight) * length}px`
      // The classes cap the height, so the travel is read back from the box.
      const travel = Math.max(0, length - handle.offsetHeight)
      handle.style.transform = `translateY(${(scroller.scrollTop / overflow) * travel}px)`
    }

    scroller.addEventListener("scroll", draw, { passive: true, signal })

    /*
     * The content has no wrapper to measure, so each child is watched:
     * content that grows or shrinks changes the size of one of them.
     */
    const resize = new ResizeObserver(draw)
    const watch = () => {
      resize.disconnect()
      for (const element of [scroller, rail, ...scroller.children]) {
        resize.observe(element)
      }
    }
    /*
     * A new child needs watching. A changed text node resizes nothing that is
     * watched when it sits straight in the viewport, so it redraws.
     */
    const mutation = new MutationObserver((records) => {
      if (
        records.some((r) => r.type === "childList" && r.target === scroller)
      ) {
        watch()
      } else {
        draw()
      }
    })
    mutation.observe(scroller, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    watch()
    signal.addEventListener("abort", () => {
      resize.disconnect()
      mutation.disconnect()
    })

    /*
     * Each pixel the thumb moves is worth as much scroll as the content is
     * longer than the thumb's travel, which is how a native bar drags.
     */
    handle.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== 0) return
        event.preventDefault()
        const travel = rail.clientHeight - handle.offsetHeight
        if (travel <= 0) return
        handle.setPointerCapture(event.pointerId)
        drag = {
          y: event.clientY,
          scrollTop: scroller.scrollTop,
          ratio: (scroller.scrollHeight - scroller.clientHeight) / travel,
        }
        showWhileScrolling()
      },
      { signal }
    )
    handle.addEventListener(
      "pointermove",
      (event) => {
        if (!drag) return
        scroller.scrollTop =
          drag.scrollTop + (event.clientY - drag.y) * drag.ratio
      },
      { signal }
    )
    handle.addEventListener(
      "lostpointercapture",
      () => {
        drag = undefined
        showWhileScrolling()
      },
      { signal }
    )
  }

  return () => {
    abort.abort()
    clearTimeout(hideTimer)
    box.removeAttribute("data-scrolling")
  }
}

watchEffect(
  (onCleanup) => {
    const scroller = viewport.value
    if (!scroller || (props.variant !== "overlay" && !props.autoHide)) return
    onCleanup(
      attachScrollbar(
        root.value ?? scroller,
        scroller,
        props.autoHide,
        track.value && thumb.value
          ? { track: track.value, thumb: thumb.value }
          : undefined
      )
    )
  },
  { flush: "post" }
)
</script>

<template>
  <div
    v-if="props.variant === 'overlay'"
    ref="root"
    :dir="props.dir"
    :style="props.style"
    :class="
      cn(
        'relative flex flex-col',
        props.autoHide &&
          '[&:not(:hover):not(:has(:focus-visible)):not([data-scrolling])>[data-scrollbar-track]]:invisible',
        props.class
      )
    "
  >
    <div
      ref="viewport"
      :tabindex="props.focusable ? 0 : undefined"
      :role="props.focusable ? 'group' : undefined"
      :aria-label="props.focusable ? props.viewportLabel : undefined"
      v-bind="$attrs"
      :class="
        cn(
          'min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          focusRingClassName,
          props.viewportClass
        )
      "
    >
      <slot />
    </div>
    <!--
      Only the thumb takes the pointer, so the content under the track stays
      clickable. Hidden until the content overflows.
    -->
    <div
      ref="track"
      data-scrollbar-track
      aria-hidden="true"
      hidden
      class="pointer-events-none absolute bottom-[var(--newt-scrollbar-inset-end,4px)] end-1 top-[var(--newt-scrollbar-inset-start,4px)]"
    >
      <div
        ref="thumb"
        class="pointer-events-auto max-h-[var(--newt-scrollbar-thumb-max-height,none)] min-h-[min(24px,100%)] w-[var(--newt-scrollbar-thumb-width,8px)] touch-none rounded-full bg-[var(--newt-scrollbar-thumb,var(--newt-bg-active))] hover:bg-[var(--newt-scrollbar-thumb-hover,var(--newt-text-muted))] active:bg-[var(--newt-scrollbar-thumb-hover,var(--newt-text-muted))]"
      />
    </div>
  </div>
  <div
    v-else
    ref="viewport"
    :tabindex="props.focusable ? 0 : undefined"
    :role="props.focusable ? 'group' : undefined"
    :aria-label="props.focusable ? props.viewportLabel : undefined"
    :dir="props.dir"
    :style="props.style"
    v-bind="$attrs"
    :class="
      cn(
        'overflow-auto',
        scrollbarClassName,
        props.autoHide && scrollbarAutoHideClassName,
        focusRingClassName,
        props.viewportClass,
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
