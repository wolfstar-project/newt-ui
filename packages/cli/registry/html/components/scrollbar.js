/*
 * Two behaviours for a `[data-newt-scrollbar]` element, both optional:
 *
 *  - `.newt-scrollbar--overlay` draws its own thumb. The viewport scrolls
 *    natively, so the keyboard, the wheel and touch need nothing from here;
 *    this only sizes the thumb, places it and lets the pointer drag it.
 *  - `.newt-scrollbar--auto-hide` shows the thumb while the region scrolls.
 *    The stylesheet handles hover and focus; `data-scrolling` covers a scroll
 *    that neither of them explains, such as a new message or a touch.
 */
document.querySelectorAll("[data-newt-scrollbar]").forEach((root) => {
  /* How long an auto-hiding thumb stays after the last scroll, in ms. */
  const HIDE_DELAY = 800

  const overlay = root.classList.contains("newt-scrollbar--overlay")
  const viewport = overlay
    ? root.querySelector(":scope > .newt-scrollbar__viewport")
    : root
  if (!viewport) return

  let drag
  let hideTimer

  function showWhileScrolling() {
    if (!root.classList.contains("newt-scrollbar--auto-hide")) return
    root.setAttribute("data-scrolling", "")
    clearTimeout(hideTimer)
    if (drag) return
    hideTimer = setTimeout(
      () => root.removeAttribute("data-scrolling"),
      HIDE_DELAY
    )
  }

  viewport.addEventListener("scroll", showWhileScrolling, { passive: true })

  const track = root.querySelector(":scope > .newt-scrollbar__track")
  const thumb = track?.querySelector(".newt-scrollbar__thumb")
  if (!overlay || !track || !thumb) return

  function draw() {
    const overflow = viewport.scrollHeight - viewport.clientHeight
    track.hidden = overflow < 1
    if (track.hidden) return
    const length = track.clientHeight
    thumb.style.height = `${(viewport.clientHeight / viewport.scrollHeight) * length}px`
    // The stylesheet caps the height, so the travel is read back from the box.
    const travel = length - thumb.offsetHeight
    thumb.style.transform = `translateY(${(viewport.scrollTop / overflow) * travel}px)`
  }

  viewport.addEventListener("scroll", draw, { passive: true })

  /*
   * The content has no wrapper to measure, so each child is watched: content
   * that grows or shrinks changes the size of one of them.
   */
  const resize = new ResizeObserver(draw)
  function watch() {
    resize.disconnect()
    for (const element of [viewport, track, ...viewport.children]) {
      resize.observe(element)
    }
  }
  new MutationObserver(watch).observe(viewport, { childList: true })
  watch()

  /*
   * Each pixel the thumb moves is worth as much scroll as the content is
   * longer than the thumb's travel, which is how a native bar drags.
   */
  thumb.addEventListener("pointerdown", (event) => {
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
  })
  thumb.addEventListener("pointermove", (event) => {
    if (!drag) return
    viewport.scrollTop = drag.scrollTop + (event.clientY - drag.y) * drag.ratio
  })
  thumb.addEventListener("lostpointercapture", () => {
    drag = undefined
    showWhileScrolling()
  })
})
