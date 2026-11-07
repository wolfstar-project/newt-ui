/* Load with defer, after the picker markup. Safe to load again for new roots. */
;(() => {
  const KINDS = ["emoji", "sticker", "gif"]
  const TONES = [
    ["Default skin tone", "👋"],
    ["Light skin tone", "👋🏻"],
    ["Medium-light skin tone", "👋🏼"],
    ["Medium skin tone", "👋🏽"],
    ["Medium-dark skin tone", "👋🏾"],
    ["Dark skin tone", "👋🏿"],
  ]
  const RECENT_LIMIT = 18
  const SVG = "http://www.w3.org/2000/svg"

  function el(tag, className, attributes = {}) {
    const element = document.createElement(tag)
    if (className) element.className = className
    for (const [name, value] of Object.entries(attributes))
      if (value !== undefined) element.setAttribute(name, value)
    return element
  }
  function valueOf(item, tone) {
    return (tone === 0 ? undefined : item.skins?.[tone - 1]) ?? item.value
  }
  function shortcode(item) {
    if (item.kind !== "emoji") return item.label
    const name = item.label
      .toLowerCase()
      .replaceAll(/[^\p{L}\p{N}]+/gu, "_")
      .replaceAll(/^_+|_+$/gu, "")
    return `:${name}:`
  }
  function matches(item, query) {
    const text = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase()
    return query
      .toLowerCase()
      .split(/[\s_:]+/u)
      .filter(Boolean)
      .every((word) => text.includes(word))
  }
  function sectionsFor(data, recent, kind, query) {
    const ofKind = data.items.filter((item) => item.kind === kind)
    if (query.trim()) {
      const found = ofKind.filter((item) => matches(item, query))
      return found.length
        ? [{ key: "results", label: "Search results", items: found }]
        : []
    }
    const byId = new Map(ofKind.map((item) => [item.id, item]))
    const sections = []
    const used = recent.map((id) => byId.get(id)).filter(Boolean)
    if (used.length)
      sections.push({
        key: "recent",
        label: "Recently used",
        glyph: "🕘",
        items: used,
        collapsible: true,
      })
    for (const category of data.categories) {
      if (category.kind !== kind) continue
      const list = ofKind.filter((item) => item.category === category.id)
      if (list.length)
        sections.push({
          key: `category-${category.id}`,
          label: category.label,
          glyph: category.glyph,
          iconSrc: category.iconSrc,
          items: list,
          collapsible: true,
        })
    }
    return sections
  }
  function neighbour(cells, index, key, rtl) {
    if (key === (rtl ? "ArrowLeft" : "ArrowRight")) return cells[index + 1]
    if (key === (rtl ? "ArrowRight" : "ArrowLeft")) return cells[index - 1]
    if (key === "Home") return cells[0]
    if (key === "End") return cells.at(-1)
    if (key !== "ArrowDown" && key !== "ArrowUp") return undefined
    const from = cells[index]?.getBoundingClientRect()
    if (!from) return undefined
    const step = key === "ArrowDown" ? 1 : -1
    let rowTop = null
    let best
    for (let at = index + step; at >= 0 && at < cells.length; at += step) {
      const rect = cells[at].getBoundingClientRect()
      if (Math.abs(rect.top - from.top) < 4) continue
      rowTop ??= rect.top
      if (Math.abs(rect.top - rowTop) >= 4) break
      const distance = Math.abs(rect.left - from.left)
      if (!best || distance < best.distance)
        best = { cell: cells[at], distance }
    }
    return best?.cell
  }
  function art(item, value) {
    if (item.src) {
      const image = el("img", "newt-expressions-picker__image", {
        src: item.src,
        alt: "",
        loading: "lazy",
      })
      return image
    }
    const text = el(
      "span",
      item.kind === "emoji"
        ? "newt-expressions-picker__glyph"
        : "newt-expressions-picker__media-label",
      { "aria-hidden": "true" }
    )
    text.textContent = item.kind === "emoji" ? value : item.label
    return text
  }
  function chevron() {
    const svg = document.createElementNS(SVG, "svg")
    svg.setAttribute("class", "newt-expressions-picker__chevron")
    svg.setAttribute("viewBox", "0 0 16 16")
    svg.setAttribute("aria-hidden", "true")
    const path = document.createElementNS(SVG, "path")
    path.setAttribute("d", "m4 6 4 4 4-4")
    path.setAttribute("stroke-linecap", "round")
    path.setAttribute("stroke-linejoin", "round")
    svg.append(path)
    return svg
  }

  document
    .querySelectorAll("[data-newt-expressions-picker]")
    .forEach((root) => {
      if (root.dataset.newtInitialized) return
      const q = (name) => root.querySelector(`[data-newt-${name}]`)
      const trigger = q("trigger")
      const dialog = q("dialog")
      const search = q("search")
      const clear = q("clear")
      const searchIcon = q("search-icon")
      const close = q("close")
      const toneRoot = q("tone")
      const toneButton = q("tone-button")
      const toneList = q("tones")
      const panel = q("panel")
      const rail = q("rail")
      const scroll = q("scroll")
      const footer = q("footer")
      const source = q("expressions-data")
      if (
        ![
          trigger,
          dialog,
          search,
          clear,
          close,
          toneRoot,
          toneButton,
          toneList,
          panel,
          rail,
          scroll,
          footer,
          source,
        ].every(Boolean)
      )
        return
      root.dataset.newtInitialized = "true"

      const data = JSON.parse(source.textContent)
      data.items ??= []
      data.categories ??= []
      let recent = [...(data.recent ?? [])]
      const id = `newt-expressions-${crypto.randomUUID()}`
      dialog.id = id
      panel.id = `${id}-panel`
      trigger.setAttribute("aria-controls", id)
      const tabs = [...root.querySelectorAll('[role="tab"]')]

      let kind = "emoji"
      let tone = 0
      let collapsed = []
      let scrolledTo = null
      let activeKey = null
      let hovered = null

      const where = (item) =>
        data.categories.find((category) => category.id === item.category)
          ?.label ?? ""
      const current = () => root.dataset.newtCurrent || null
      const isCurrent = (item) => {
        const value = current()
        return (
          value !== null &&
          (item.value === value || item.skins?.includes(value) === true)
        )
      }

      function renderFooter() {
        const value = current()
        const shown =
          hovered ??
          (value
            ? data.items
                .filter((item) => item.kind === kind && isCurrent(item))
                .map((item) => ({ item, where: where(item) }))[0]
            : undefined)
        footer.replaceChildren()
        if (!shown) {
          const hint = el("span", "newt-expressions-picker__hint")
          hint.textContent = "Hover or focus an expression to preview it."
          footer.append(hint)
          return
        }
        const preview = el("span", "newt-expressions-picker__preview", {
          "aria-hidden": "true",
        })
        if (shown.item.src || shown.item.kind === "emoji")
          preview.append(art(shown.item, valueOf(shown.item, tone)))
        const name = el("span", "newt-expressions-picker__shortcode")
        name.textContent = shortcode(shown.item)
        const from = el("span", "newt-expressions-picker__where")
        from.textContent = shown.where
        footer.append(preview, name, from)
      }

      function render() {
        const query = search.value
        const searching = query.trim().length > 0
        const sections = sectionsFor(data, recent, kind, query)
        const keys = sections
          .filter((section) => !collapsed.includes(section.key))
          .flatMap((section) =>
            section.items
              .filter((item) => !item.disabled)
              .map((item) => `${section.key}|${item.id}`)
          )
        const tabKey =
          activeKey && keys.includes(activeKey) ? activeKey : keys[0]
        const activeSection = scrolledTo ?? sections[0]?.key

        tabs.forEach((tab) => {
          const selected = tab.dataset.newtKind === kind
          tab.setAttribute("aria-selected", String(selected))
          tab.tabIndex = selected ? 0 : -1
          if (selected) panel.setAttribute("aria-labelledby", tab.id)
        })
        clear.hidden = !searching
        if (searchIcon) searchIcon.toggleAttribute("hidden", searching)
        toneRoot.hidden = kind !== "emoji"
        toneButton.setAttribute("aria-label", `Skin tone: ${TONES[tone][0]}`)
        toneButton.querySelector("span").textContent = TONES[tone][1]

        rail.replaceChildren()
        rail.hidden = searching || sections.length < 2
        for (const section of sections) {
          const button = el("button", "newt-expressions-picker__control", {
            type: "button",
            "aria-label": section.label,
            title: section.label,
            "aria-current": activeSection === section.key ? "true" : undefined,
          })
          if (section.iconSrc)
            button.append(
              el("img", "newt-expressions-picker__rail-icon", {
                src: section.iconSrc,
                alt: "",
              })
            )
          else {
            const glyph = el("span", "", { "aria-hidden": "true" })
            glyph.textContent = section.glyph ?? section.label.slice(0, 1)
            button.append(glyph)
          }
          button.addEventListener("click", () => {
            collapsed = collapsed.filter((key) => key !== section.key)
            scrolledTo = section.key
            render()
            const target = scroll.querySelector(
              `[data-section="${section.key}"]`
            )
            if (target) scroll.scrollTop = target.offsetTop
          })
          rail.append(button)
        }

        scroll.replaceChildren()
        for (const section of sections) {
          const open = !collapsed.includes(section.key)
          const block = el("section", "", {
            "data-section": section.key,
            "aria-labelledby": `${id}-${section.key}-title`,
          })
          const title = el("h3", "newt-expressions-picker__title", {
            id: `${id}-${section.key}-title`,
          })
          const label = el("span", "newt-expressions-picker__title-label")
          label.textContent = section.label
          if (section.collapsible) {
            const toggle = el(
              "button",
              "newt-expressions-picker__title-button",
              {
                type: "button",
                "aria-expanded": String(open),
                "aria-controls": `${id}-${section.key}`,
              }
            )
            toggle.append(label, chevron())
            toggle.addEventListener("click", () => {
              collapsed = open
                ? [...collapsed, section.key]
                : collapsed.filter((key) => key !== section.key)
              render()
            })
            title.append(toggle)
          } else {
            const text = el("span", "newt-expressions-picker__title-text")
            text.append(label)
            title.append(text)
          }
          block.append(title)
          if (open) {
            const grid = el(
              "div",
              kind === "emoji"
                ? "newt-expressions-picker__grid"
                : "newt-expressions-picker__grid newt-expressions-picker__grid--media",
              { id: `${id}-${section.key}` }
            )
            for (const item of section.items) {
              const key = `${section.key}|${item.id}`
              const cell = el("button", "newt-expressions-picker__cell", {
                type: "button",
                "data-cell": "",
                "data-newt-id": item.id,
                tabindex: key === tabKey ? "0" : "-1",
                "aria-label": item.disabled
                  ? `${item.label}, unavailable`
                  : item.label,
                "aria-pressed": String(isCurrent(item)),
              })
              cell.disabled = trigger.disabled || item.disabled === true
              cell.append(art(item, valueOf(item, tone)))
              const show = () => {
                hovered = { item, where: where(item) }
                renderFooter()
              }
              cell.addEventListener("mouseenter", show)
              cell.addEventListener("focus", () => {
                activeKey = key
                scroll
                  .querySelectorAll('[data-cell][tabindex="0"]')
                  .forEach((other) => (other.tabIndex = -1))
                cell.tabIndex = 0
                show()
              })
              cell.addEventListener("click", () => select(item))
              grid.append(cell)
            }
            block.append(grid)
          }
          scroll.append(block)
        }
        if (sections.length === 0) {
          const empty = el("div", "newt-expressions-picker__empty", {
            role: "status",
          })
          const heading = el("p", "newt-expressions-picker__empty-title")
          heading.textContent = searching
            ? "No expressions match your search."
            : "Nothing here yet."
          const help = el("p")
          help.textContent = searching
            ? "Try another word or another tab."
            : "Try another tab."
          empty.append(heading, help)
          scroll.append(empty)
        } else if (searching) {
          const count = sections.reduce(
            (total, section) => total + section.items.length,
            0
          )
          const status = el("p", "newt-expressions-picker__sr-only", {
            role: "status",
          })
          status.textContent = count === 1 ? "1 result" : `${count} results`
          scroll.append(status)
        }
        renderFooter()
      }

      function renderTones() {
        toneList.replaceChildren()
        TONES.forEach(([label, sample], index) => {
          const option = el("button", "newt-expressions-picker__control", {
            type: "button",
            "aria-label": label,
            title: label,
            "aria-pressed": String(tone === index),
          })
          const glyph = el("span", "newt-expressions-picker__glyph", {
            "aria-hidden": "true",
          })
          glyph.textContent = sample
          option.append(glyph)
          option.addEventListener("click", () => {
            tone = index
            hideTones()
            toneButton.focus()
            render()
          })
          toneList.append(option)
        })
      }
      function hideTones() {
        toneList.hidden = true
        toneButton.setAttribute("aria-expanded", "false")
      }
      toneButton.addEventListener("click", () => {
        if (!toneList.hidden) return hideTones()
        renderTones()
        toneList.hidden = false
        toneButton.setAttribute("aria-expanded", "true")
        toneList.querySelector('[aria-pressed="true"]')?.focus()
      })
      document.addEventListener("pointerdown", (event) => {
        if (!toneList.hidden && !toneRoot.contains(event.target)) hideTones()
      })

      function select(item) {
        if (trigger.disabled || item.disabled) return
        const value = valueOf(item, tone)
        recent = [
          item.id,
          ...recent.filter((entry) => entry !== item.id),
        ].slice(0, RECENT_LIMIT)
        root.dataset.newtCurrent = value
        dialog.close()
        root.dispatchEvent(
          new CustomEvent("newt:expression-select", {
            bubbles: true,
            detail: { item, value, recent: [...recent] },
          })
        )
      }
      function changeKind(next) {
        kind = next
        scrolledTo = null
        hovered = null
        hideTones()
        scroll.scrollTop = 0
        render()
      }

      tabs.forEach((tab, index) => {
        tab.id = `${id}-${tab.dataset.newtKind}`
        tab.setAttribute("aria-controls", panel.id)
        tab.addEventListener("click", () => changeKind(tab.dataset.newtKind))
        tab.addEventListener("keydown", (event) => {
          const rtl = getComputedStyle(tab).direction === "rtl"
          const count = KINDS.length
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
          if (next < 0) return
          event.preventDefault()
          changeKind(tabs[next].dataset.newtKind)
          tabs[next].focus()
        })
      })

      search.addEventListener("input", () => {
        hovered = null
        render()
      })
      search.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown") return
        event.preventDefault()
        scroll.querySelector('[data-cell][tabindex="0"]')?.focus()
      })
      clear.addEventListener("click", () => {
        search.value = ""
        render()
        search.focus()
      })
      scroll.addEventListener(
        "scroll",
        () => {
          let found = null
          for (const section of scroll.querySelectorAll("[data-section]")) {
            if (section.offsetTop > scroll.scrollTop + 8) break
            found = section.dataset.section
          }
          if (found && found !== scrolledTo) {
            scrolledTo = found
            rail.querySelectorAll("button").forEach((button, index) => {
              const section = scroll.querySelectorAll("[data-section]")[index]
              if (section?.dataset.section === found)
                button.setAttribute("aria-current", "true")
              else button.removeAttribute("aria-current")
            })
          }
        },
        { passive: true }
      )
      scroll.addEventListener("mouseleave", () => {
        hovered = null
        renderFooter()
      })
      scroll.addEventListener("keydown", (event) => {
        const target = event.target
        if (!(target instanceof HTMLElement) || !target.matches("[data-cell]"))
          return
        const cells = [...scroll.querySelectorAll("[data-cell]:not(:disabled)")]
        const rtl = getComputedStyle(target).direction === "rtl"
        const next = neighbour(cells, cells.indexOf(target), event.key, rtl)
        if (!next) return
        event.preventDefault()
        next.focus()
        next.scrollIntoView?.({ block: "nearest" })
      })

      trigger.addEventListener("click", () => {
        if (trigger.disabled) return
        search.value = ""
        hovered = null
        hideTones()
        render()
        dialog.showModal()
        trigger.setAttribute("aria-expanded", "true")
        search.focus()
      })
      close.addEventListener("click", () => dialog.close())
      dialog.addEventListener("close", () => {
        hideTones()
        trigger.setAttribute("aria-expanded", "false")
        trigger.focus()
      })
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !toneList.hidden) {
          event.preventDefault()
          hideTones()
          toneButton.focus()
          return
        }
        if (event.key !== "Tab") return
        const controls = [
          ...dialog.querySelectorAll(
            "button:not(:disabled), input:not(:disabled)"
          ),
        ].filter(
          (element) =>
            element.tabIndex >= 0 && element.getClientRects().length > 0
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
      })
      render()
    })
})()
