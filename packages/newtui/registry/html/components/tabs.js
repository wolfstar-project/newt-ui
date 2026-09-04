document.querySelectorAll(".newt-tabs").forEach((tabs) => {
  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".newt-tab")
    if (!tab) return
    tabs.querySelectorAll(".newt-tab").forEach((t) => {
      t.classList.remove("newt-tab--active")
      t.setAttribute("aria-selected", "false")
    })
    tab.classList.add("newt-tab--active")
    tab.setAttribute("aria-selected", "true")
  })
})
