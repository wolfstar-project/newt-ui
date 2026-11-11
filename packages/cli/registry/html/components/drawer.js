/*
 * The dialog element does the hard parts. This adds the three things it does
 * not: a control that opens a drawer by id (`data-newt-drawer-open`), controls
 * inside it that close it, and closing on a press of the backdrop, which is
 * the dialog's own box outside its content.
 */
document.querySelectorAll("[data-newt-drawer-open]").forEach((opener) => {
  opener.addEventListener("click", () => {
    const drawer = document.getElementById(opener.dataset.newtDrawerOpen)
    if (drawer instanceof HTMLDialogElement && !drawer.open) drawer.showModal()
  })
})

document.querySelectorAll("[data-newt-drawer]").forEach((drawer) => {
  drawer.addEventListener("click", (event) => {
    if (
      event.target === drawer ||
      event.target.closest("[data-newt-drawer-close]")
    ) {
      drawer.close()
    }
  })
})
