# Setup — React

newt/ui components are plain CSS classes — no React-specific package needed.
You import the CSS, write JSX with `.newt-*` class names, and you're done.
This works with Create React App, Vite, Parcel, or any React setup.

---

## 1. Install via CLI

From your React project root:

```bash
npx @wolfstar/newt-ui@latest init
npx @wolfstar/newt-ui@latest add button embed status-indicator avatar badge
```

Files land in `components/ui/` (configurable in `newt-ui.json`).

---

## 2. Import tokens globally

In your entry point (`src/index.jsx`, `src/main.jsx`, or `src/App.jsx`):

```jsx
// Import tokens once — before any component stylesheets
import "../styles/newt-tokens.css"
```

Then import individual component CSS wherever you use them (or centrally in
`App.jsx`):

```jsx
import "../components/ui/button.css"
import "../components/ui/embed.css"
import "../components/ui/status-indicator.css"
import "../components/ui/avatar.css"
```

---

## 3. Use in JSX

Class names map 1:1 — `className` instead of `class`, everything else is
identical to the HTML markup in the docs.

```jsx
// components/DeployButton.jsx
export function DeployButton({ onClick, loading }) {
  return (
    <button
      className={`newt-btn newt-btn--primary${loading ? " newt-btn--disabled" : ""}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Deploying…" : "Deploy"}
    </button>
  )
}
```

```jsx
// components/ShardEmbed.jsx
export function ShardEmbed({ shard, latency, timestamp }) {
  return (
    <div className="newt-embed">
      <div className="newt-embed__body">
        <div className="newt-embed__eyebrow">newt-trace · shard {shard}</div>
        <div className="newt-embed__title">Command latency spike</div>
        <div className="newt-embed__description">
          p95 exceeded {latency}ms on this shard.
        </div>
        <div className="newt-embed__fields">
          <div>
            <div className="newt-embed__field-name">Shard</div>
            <div className="newt-embed__field-value">{shard}</div>
          </div>
          <div>
            <div className="newt-embed__field-name">p95 Latency</div>
            <div className="newt-embed__field-value">{latency}ms</div>
          </div>
        </div>
        <div className="newt-embed__footer">{timestamp}</div>
      </div>
    </div>
  )
}
```

---

## 4. Status indicator with live data

```jsx
// components/ShardStatus.jsx
const STATUS_MAP = {
  healthy: "online",
  degraded: "idle",
  disconnected: "dnd",
  unknown: "offline",
}

export function ShardStatus({ id, health, guilds }) {
  const dot = STATUS_MAP[health] ?? "offline"

  return (
    <div className="newt-member">
      <div className="newt-status">
        <div className="newt-avatar av-1">{id}</div>
        <div className={`newt-status__dot newt-status__dot--${dot}`}></div>
      </div>
      <div className="newt-member__info">
        <span className="newt-member__name">Shard {id}</span>
        <span className="newt-member__role">{guilds} guilds</span>
      </div>
    </div>
  )
}
```

---

## 5. Wrapping components for reuse

Since newt/ui has no React package, you can create your own thin wrappers.
The pattern: props → modifier class names.

```jsx
// components/ui/Button.jsx
const VARIANTS = {
  primary: "newt-btn--primary",
  secondary: "newt-btn--secondary",
  danger: "newt-btn--danger",
  success: "newt-btn--success",
  link: "newt-btn--link",
}

const SIZES = {
  sm: "newt-btn--sm",
  md: "",
  lg: "newt-btn--lg",
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  ...props
}) {
  const classes = ["newt-btn", VARIANTS[variant], SIZES[size]]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
```

```jsx
// Usage
import { Button } from "./components/ui/Button"

;<Button variant="danger" size="lg" onClick={handleDelete}>
  Remove bot
</Button>
```

---

## 6. Feeding newt-trace events into a timeline

```jsx
// components/EventTimeline.jsx
import { useEffect, useState } from "react"

const DOT_VARIANT = {
  "shard.connected": "success",
  "shard.disconnected": "danger",
  "command.invoked": "brand",
}

export function EventTimeline({ events }) {
  return (
    <div className="newt-timeline">
      {events.map((event, i) => {
        const dot = DOT_VARIANT[event.type] ?? ""
        return (
          <div className="newt-timeline__item" key={i}>
            <div
              className={`newt-timeline__dot${dot ? ` newt-timeline__dot--${dot}` : ""}`}
            >
              {dot === "success" ? "✓" : dot === "danger" ? "!" : "·"}
            </div>
            <div className="newt-timeline__content">
              <div className="newt-timeline__title">{event.type}</div>
              <div className="newt-timeline__meta">
                shard {event.shard} · {event.timestamp}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

---

## Vite config note

No special config needed — Vite handles CSS imports out of the box.
If you're using CSS modules, import the newt/ui CSS files as plain imports
(not `*.module.css`), since the class names are global by design.

```js
// vite.config.js — no changes needed for newt/ui
export default {
  // your existing config
}
```
