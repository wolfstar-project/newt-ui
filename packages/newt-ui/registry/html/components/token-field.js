document.querySelectorAll("[data-newt-token-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.closest(".newt-token-field").querySelector("input")
    const revealed = input.type === "text"
    input.type = revealed ? "password" : "text"
    btn.textContent = revealed ? "Reveal" : "Hide"
  })
})
document.querySelectorAll("[data-newt-token-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const input = btn.closest(".newt-token-field").querySelector("input")
    await navigator.clipboard.writeText(input.value)
    const original = btn.textContent
    btn.textContent = "Copied!"
    setTimeout(() => (btn.textContent = original), 1500)
  })
})
