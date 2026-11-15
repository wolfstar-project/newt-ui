"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  scrollbarAutoHideClassName,
  scrollbarClassName,
} from "@/registry/bases/newt/ui/scrollbar-classes"

/*
 * A focusable region shows its focus inside its own box, where an ancestor
 * with `overflow: hidden` cannot clip it.
 */
const focusRingClassName =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link"

/** How long an auto-hiding thumb stays after the last scroll, in ms. */
const HIDE_DELAY = 800

/**
 * Wires the behaviour CSS cannot express and returns its teardown. The
 * viewport scrolls natively, so the keyboard, the wheel and touch need nothing
 * from here. `root` is the element that carries `data-scrolling`.
 */
function attachScrollbar(
  root: HTMLElement,
  viewport: HTMLElement,
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
    root.setAttribute("data-scrolling", "")
    clearTimeout(hideTimer)
    if (drag) return
    hideTimer = setTimeout(
      () => root.removeAttribute("data-scrolling"),
      HIDE_DELAY
    )
  }

  viewport.addEventListener("scroll", showWhileScrolling, {
    passive: true,
    signal,
  })

  if (overlay) {
    const { track, thumb } = overlay

    const draw = () => {
      const overflow = viewport.scrollHeight - viewport.clientHeight
      track.hidden = overflow < 1
      if (track.hidden) return
      const length = track.clientHeight
      thumb.style.height = `${(viewport.clientHeight / viewport.scrollHeight) * length}px`
      // The classes cap the height, so the travel is read back from the box.
      const travel = Math.max(0, length - thumb.offsetHeight)
      thumb.style.transform = `translateY(${(viewport.scrollTop / overflow) * travel}px)`
    }

    viewport.addEventListener("scroll", draw, { passive: true, signal })

    /*
     * The content has no wrapper to measure, so each child is watched:
     * content that grows or shrinks changes the size of one of them.
     */
    const resize = new ResizeObserver(draw)
    const watch = () => {
      resize.disconnect()
      for (const element of [viewport, track, ...viewport.children]) {
        resize.observe(element)
      }
    }
    /*
     * A new child needs watching. A changed text node resizes nothing that is
     * watched when it sits straight in the viewport, so it redraws.
     */
    const mutation = new MutationObserver((records) => {
      if (
        records.some((r) => r.type === "childList" && r.target === viewport)
      ) {
        watch()
      } else {
        draw()
      }
    })
    mutation.observe(viewport, {
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
    thumb.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== 0) return
        event.preventDefault()
        const travel = track.clientHeight - thumb.offsetHeight
        if (travel <= 0) return
        thumb.setPointerCapture(event.pointerId)
        drag = {
          y: event.clientY,
          scrollTop: viewport.scrollTop,
          ratio: (viewport.scrollHeight - viewport.clientHeight) / travel,
        }
        showWhileScrolling()
      },
      { signal }
    )
    thumb.addEventListener(
      "pointermove",
      (event) => {
        if (!drag) return
        viewport.scrollTop =
          drag.scrollTop + (event.clientY - drag.y) * drag.ratio
      },
      { signal }
    )
    thumb.addEventListener(
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
    root.removeAttribute("data-scrolling")
  }
}

export interface ScrollAreaProps extends React.ComponentProps<"div"> {
  /**
   * `native` styles the browser's scrollbar, which keeps a lane beside the
   * content. `overlay` draws a thumb over the content instead, so the box
   * keeps its full width. It scrolls on the block axis only, and renders an
   * outer box around the viewport: `className`, `style` and `dir` land on the
   * box, every other attribute and the ref on the viewport, which is the
   * element that scrolls.
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
   * Classes for the element that scrolls. With `overlay`, padding that should
   * scroll with the content belongs here.
   */
  viewportClassName?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      variant = "native",
      autoHide = false,
      focusable = false,
      viewportLabel = "Scrollable region",
      viewportClassName,
      style,
      dir,
      ...props
    },
    ref
  ) => {
    const overlay = variant === "overlay"
    const root = React.useRef<HTMLDivElement | null>(null)
    const viewport = React.useRef<HTMLDivElement | null>(null)
    const track = React.useRef<HTMLDivElement | null>(null)
    const thumb = React.useRef<HTMLDivElement | null>(null)
    React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => viewport.current
    )

    React.useEffect(() => {
      if (!viewport.current || (!overlay && !autoHide)) return
      return attachScrollbar(
        root.current ?? viewport.current,
        viewport.current,
        autoHide,
        track.current && thumb.current
          ? { track: track.current, thumb: thumb.current }
          : undefined
      )
    }, [overlay, autoHide])

    if (!overlay) {
      return (
        <div
          ref={viewport}
          tabIndex={focusable ? 0 : undefined}
          role={focusable ? "group" : undefined}
          aria-label={focusable ? viewportLabel : undefined}
          dir={dir}
          style={style}
          className={cn(
            "overflow-auto",
            scrollbarClassName,
            autoHide && scrollbarAutoHideClassName,
            focusRingClassName,
            viewportClassName,
            className
          )}
          {...props}
        />
      )
    }

    return (
      <div
        ref={root}
        dir={dir}
        style={style}
        className={cn(
          "relative flex flex-col",
          autoHide &&
            "[&:not(:hover):not(:has(:focus-visible)):not([data-scrolling])>[data-scrollbar-track]]:invisible",
          className
        )}
      >
        <div
          ref={viewport}
          tabIndex={focusable ? 0 : undefined}
          role={focusable ? "group" : undefined}
          aria-label={focusable ? viewportLabel : undefined}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            focusRingClassName,
            viewportClassName
          )}
          {...props}
        />
        {/*
         * Only the thumb takes the pointer, so the content under the track
         * stays clickable. Hidden until the content overflows.
         */}
        <div
          ref={track}
          data-scrollbar-track=""
          aria-hidden="true"
          hidden
          className="pointer-events-none absolute bottom-[var(--newt-scrollbar-inset-end,4px)] end-1 top-[var(--newt-scrollbar-inset-start,4px)]"
        >
          <div
            ref={thumb}
            className="pointer-events-auto max-h-[var(--newt-scrollbar-thumb-max-height,none)] min-h-[min(24px,100%)] w-[var(--newt-scrollbar-thumb-width,8px)] touch-none rounded-full bg-[var(--newt-scrollbar-thumb,var(--newt-bg-active))] hover:bg-[var(--newt-scrollbar-thumb-hover,var(--newt-text-muted))] active:bg-[var(--newt-scrollbar-thumb-hover,var(--newt-text-muted))]"
          />
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
