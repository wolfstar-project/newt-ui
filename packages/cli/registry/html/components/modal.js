document.querySelectorAll("[data-newt-modal]").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("[data-newt-modal-close]")) {
      overlay.remove()
    }
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.remove()
  })
})
