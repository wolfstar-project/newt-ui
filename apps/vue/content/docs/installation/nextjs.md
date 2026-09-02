# Setup — Next.js

Works with Next.js 13+ (App Router) and Next.js 12 (Pages Router).
newt/ui is plain CSS — no special Next.js plugin needed.

---

## 1. Install via CLI

```bash
npx @newtui/react@latest init
npx @newtui/react@latest add button embed status-indicator member-list timeline
```

By default, files land in `components/ui/` and tokens in `styles/`.

---

## 2. Import tokens globally

### App Router (`app/`)

In `app/layout.tsx` (or `app/layout.js`):

```tsx
// app/layout.tsx
import "../styles/newt-tokens.css"
import "../components/ui/button.css"
import "../components/ui/embed.css"
// ... other components

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="newt-root">{children}</body>
    </html>
  )
}
```

### Pages Router (`pages/`)

In `pages/_app.tsx`:

```tsx
// pages/_app.tsx
import "../styles/newt-tokens.css"
import "../components/ui/button.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="newt-root">
      <Component {...pageProps} />
    </div>
  )
}
```

---

## 3. Server Components (App Router)

newt/ui components have no client-side JS requirements at the CSS level, so
they work as Server Components by default. Only interactive wrappers (toggles,
modals, tabs) need `'use client'`.

```tsx
// app/dashboard/page.tsx — Server Component, no 'use client' needed
export default async function DashboardPage() {
  const shards = await fetchShardHealth() // your data fetching

  return (
    <main style={{ padding: "32px" }}>
      <div className="newt-channel-topic">
        <span className="newt-channel-topic__icon">#</span>
        <span className="newt-channel-topic__name">shard-health</span>
        <span className="newt-channel-topic__divider"></span>
        <span className="newt-channel-topic__desc">
          Live status from newt-trace
        </span>
      </div>

      <div className="newt-timeline" style={{ marginTop: "24px" }}>
        {shards.map((shard) => (
          <div className="newt-timeline__item" key={shard.id}>
            <div
              className={`newt-timeline__dot newt-timeline__dot--${
                shard.health === "healthy" ? "success" : "danger"
              }`}
            >
              {shard.health === "healthy" ? "✓" : "!"}
            </div>
            <div className="newt-timeline__content">
              <div className="newt-timeline__title">Shard {shard.id}</div>
              <div className="newt-timeline__meta">
                {shard.guilds} guilds · {shard.latency}ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

---

## 4. Client Components (interactive)

Add `'use client'` only when you need React state or event handlers:

```tsx
// components/ShardCard.tsx
"use client"

import { useState } from "react"

interface Shard {
  id: number
  health: "healthy" | "degraded" | "disconnected"
  latency: number
}

const STATUS_MAP: Record<string, string> = {
  healthy: "online",
  degraded: "idle",
  disconnected: "dnd",
}

export function ShardCard({ shard }: { shard: Shard }) {
  const [expanded, setExpanded] = useState(false)
  const dot = STATUS_MAP[shard.health] ?? "offline"

  return (
    <div className="newt-card">
      <div className="newt-member" onClick={() => setExpanded(!expanded)}>
        <div className="newt-status">
          <div className="newt-avatar av-1">{shard.id}</div>
          <div className={`newt-status__dot newt-status__dot--${dot}`}></div>
        </div>
        <div className="newt-member__info">
          <span className="newt-member__name">Shard {shard.id}</span>
          <span className="newt-member__role">{shard.health}</span>
        </div>
        <span className="newt-badge newt-badge--brand">{shard.latency}ms</span>
      </div>

      {expanded && (
        <div style={{ paddingTop: "12px" }}>
          <div className="newt-embed">
            <div className="newt-embed__body">
              <div className="newt-embed__eyebrow">
                Shard {shard.id} details
              </div>
              <div className="newt-embed__fields">
                <div>
                  <div className="newt-embed__field-name">Health</div>
                  <div className="newt-embed__field-value">{shard.health}</div>
                </div>
                <div>
                  <div className="newt-embed__field-name">Latency</div>
                  <div className="newt-embed__field-value">
                    {shard.latency}ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 5. API routes + real-time with newt-trace

```tsx
// app/api/shards/route.ts
// Proxy newt-trace shard data to the frontend
export async function GET() {
  // Replace with your actual newt-trace server URL
  const data = await fetch("http://your-newt-trace-host/api/shards")
  const shards = await data.json()
  return Response.json(shards)
}
```

```tsx
// hooks/useShards.ts
"use client"
import { useEffect, useState } from "react"

export function useShards(pollMs = 5000) {
  const [shards, setShards] = useState([])

  useEffect(() => {
    const load = () =>
      fetch("/api/shards")
        .then((r) => r.json())
        .then(setShards)
    load()
    const interval = setInterval(load, pollMs)
    return () => clearInterval(interval)
  }, [pollMs])

  return shards
}
```

```tsx
// app/dashboard/page.tsx — polling dashboard
"use client"
import { useShards } from "../../hooks/useShards"
import { ShardCard } from "../../components/ShardCard"

export default function Dashboard() {
  const shards = useShards(3000)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "24px",
      }}
    >
      {shards.length === 0 ? (
        <div className="newt-empty-state">
          <div className="newt-empty-state__icon">📡</div>
          <div className="newt-empty-state__title">No shards reporting</div>
          <div className="newt-empty-state__desc">
            Make sure newt-trace is running and connected.
          </div>
        </div>
      ) : (
        shards.map((shard) => <ShardCard key={shard.id} shard={shard} />)
      )}
    </div>
  )
}
```

---

## 6. TypeScript token helpers (optional)

If you want type-safe status/variant values:

```ts
// lib/newt-ui.ts
export type StatusVariant = "online" | "idle" | "dnd" | "offline" | "streaming"
export type ButtonVariant =
  "primary" | "secondary" | "success" | "danger" | "link"
export type BadgeVariant = "brand" | "success" | "warning" | "danger"

export const shardHealthToStatus = (
  health: "healthy" | "degraded" | "disconnected" | "unknown"
): StatusVariant =>
  ({
    healthy: "online",
    degraded: "idle",
    disconnected: "dnd",
    unknown: "offline",
  })[health] ?? "offline"
```

---

## next.config note

No changes needed to `next.config.js` — Next.js handles plain CSS imports
from `node_modules` and local files without additional config.
