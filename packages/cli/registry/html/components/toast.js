export function showToast({ title, description, variant = "success" }) {
  const toast = document.createElement("div")
  toast.className = `newt-toast newt-toast--${variant}`
  toast.setAttribute("role", "status")
  toast.setAttribute("aria-live", "polite")
  toast.innerHTML = `
    <div class="newt-toast__icon">${variant === "success" ? "✓" : "!"}</div>
    <div>
      <div class="newt-toast__title">${title}</div>
      <div class="newt-toast__desc">${description}</div>
    </div>
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 5000)
  return toast
}
