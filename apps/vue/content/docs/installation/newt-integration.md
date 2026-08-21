# Setup — newt-dsl & newt-trace Integration

This guide is specific to the WolfStar toolchain. It shows how to wire
**newt-trace** telemetry events and **newt-dsl** bot commands directly into
newt/ui components — building a real-time bot dashboard with zero boilerplate.

---

## Architecture overview

```
Discord bot (newt-dsl)
  └─ emits lifecycle events
       └─ newt-trace SDK
            └─ structured JSON events (HTTP / WebSocket)
                 └─ your dashboard (newt/ui components)
```

newt-trace events are plain JSON objects. Every field maps directly to a
newt/ui component prop or element — no transformation layer needed.

---

## 1. Install newt/ui in your dashboard project

```bash
npx @wolfstar/newt-ui@latest init
npx @wolfstar/newt-ui@latest add \
  embed timeline status-indicator member-list \
  progress cooldown-bar badge bot-command-card \
  message-group channel-topic server-banner
```

---

## 2. newt-trace event → Embed

newt-trace emits structured lifecycle events. Every event has a predictable
shape — map it directly to `.newt-embed` fields.

**newt-trace event shape:**

```json
{
  "type": "command.invoked",
  "shard": 2,
  "guild": "123456789",
  "user": "987654321",
  "command": "/deploy",
  "latency": 842,
  "timestamp": "2026-06-13T14:23:00Z"
}
```

**Mapping to embed (plain JS):**

```js
function renderEvent(event) {
  const embed = document.createElement("div")
  embed.className = "newt-embed"
  embed.innerHTML = `
    <div class="newt-embed__body">
      <div class="newt-embed__eyebrow">newt-trace · shard ${event.shard}</div>
      <div class="newt-embed__title">${event.type}</div>
      <div class="newt-embed__fields">
        <div>
          <div class="newt-embed__field-name">Command</div>
          <div class="newt-embed__field-value">${event.command ?? "—"}</div>
        </div>
        <div>
          <div class="newt-embed__field-name">Latency</div>
          <div class="newt-embed__field-value">${event.latency}ms</div>
        </div>
        <div>
          <div class="newt-embed__field-name">Guild</div>
          <div class="newt-embed__field-value">${event.guild}</div>
        </div>
      </div>
      <div class="newt-embed__footer">${new Date(event.timestamp).toLocaleTimeString()}</div>
    </div>
  `
  return embed
}
```

---

## 3. newt-trace event stream → Timeline

Build a live event log by prepending new events to a `.newt-timeline`:

```js
const DOT_VARIANT = {
  "shard.connected": { cls: "success", icon: "✓" },
  "shard.disconnected": { cls: "danger", icon: "!" },
  "shard.reconnecting": { cls: "brand", icon: "↻" },
  "command.invoked": { cls: "brand", icon: "/" },
  "command.error": { cls: "danger", icon: "✕" },
  "rate.limit.hit": { cls: "danger", icon: "⚠" },
}

function addTimelineEvent(container, event) {
  const { cls, icon } = DOT_VARIANT[event.type] ?? { cls: "", icon: "·" }

  const item = document.createElement("div")
  item.className = "newt-timeline__item"
  item.innerHTML = `
    <div class="newt-timeline__dot${cls ? ` newt-timeline__dot--${cls}` : ""}"
         aria-hidden="true">${icon}</div>
    <div class="newt-timeline__content">
      <div class="newt-timeline__title">${event.type}</div>
      <div class="newt-timeline__meta">
        shard ${event.shard} · ${new Date(event.timestamp).toLocaleTimeString()}
      </div>
    </div>
  `

  // Prepend so newest is at top
  container.insertBefore(item, container.firstChild)

  // Keep max 50 events
  while (container.children.length > 50) {
    container.removeChild(container.lastChild)
  }
}
```

---

## 4. Shard health → Status indicators

newt-trace reports shard health as part of its status payload. Map health
states directly to `.newt-status__dot` variants:

```js
const HEALTH_TO_STATUS = {
  healthy: "online",
  degraded: "idle",
  reconnecting: "dnd",
  disconnected: "offline",
}

function renderShardList(shards) {
  return shards
    .map((shard) => {
      const dot = HEALTH_TO_STATUS[shard.health] ?? "offline"
      return `
      <div class="newt-member">
        <div class="newt-status">
          <div class="newt-avatar av-1">${shard.id}</div>
          <div class="newt-status__dot newt-status__dot--${dot}"></div>
        </div>
        <div class="newt-member__info">
          <span class="newt-member__name">Shard ${shard.id}</span>
          <span class="newt-member__role">${shard.guilds} guilds</span>
        </div>
        <span class="newt-badge ${
          shard.latency < 200
            ? "newt-badge--success"
            : shard.latency < 500
              ? "newt-badge--warning"
              : "newt-badge--danger"
        }">${shard.latency}ms</span>
      </div>
    `
    })
    .join("")
}
```

---

## 5. Rate limits → Cooldown bar

When newt-trace emits a `rate.limit.hit` event, surface it as a cooldown bar:

```js
function showCooldown(container, event) {
  // event.resetAt is a Unix timestamp when the bucket resets
  const totalMs = event.resetAt - event.triggeredAt
  const remaining = Math.max(0, event.resetAt - Date.now())
  const pct = ((totalMs - remaining) / totalMs) * 100
  const ready = remaining <= 0

  container.innerHTML = `
    <div class="newt-cooldown">
      <div class="newt-cooldown__label">
        <span>${event.route} rate limit</span>
        <strong>${ready ? "Ready" : (remaining / 1000).toFixed(1) + "s"}</strong>
      </div>
      <div class="newt-cooldown__track">
        <div class="newt-cooldown__fill ${ready ? "newt-cooldown__fill--ready" : ""}"
             style="width: ${pct}%"></div>
      </div>
    </div>
  `
}
```

---

## 6. newt-dsl commands → Bot command card

If you're documenting your newt-dsl bot's slash commands, map each command
definition to a `.newt-command-card`:

```js
// newt-dsl command definition (simplified)
const commands = [
  {
    name: "trace",
    description: "Stream live lifecycle events into this channel.",
    options: [
      {
        name: "shard",
        type: "INTEGER",
        required: true,
        desc: "Shard ID to subscribe to",
      },
      {
        name: "filter",
        type: "STRING",
        required: false,
        desc: "Event type filter",
      },
      {
        name: "limit",
        type: "INTEGER",
        required: false,
        desc: "Max events (default 50)",
      },
    ],
  },
]

function renderCommandCard(cmd) {
  const options = cmd.options
    .map(
      (opt) => `
    <div class="newt-command-card__option">
      <span class="newt-command-card__opt-name">${opt.name}</span>
      <span class="newt-command-card__opt-type">${opt.type}</span>
      ${opt.required ? '<span class="newt-command-card__opt-required">required</span>' : ""}
      <span class="newt-command-card__opt-desc">${opt.desc}</span>
    </div>
  `
    )
    .join("")

  return `
    <div class="newt-command-card">
      <div class="newt-command-card__header">
        <span class="newt-command-card__name">
          <span class="newt-command-card__slash">/</span>${cmd.name}
        </span>
        <span class="newt-badge newt-badge--brand">newt-dsl</span>
      </div>
      <div class="newt-command-card__desc">${cmd.description}</div>
      <div class="newt-command-card__options">${options}</div>
    </div>
  `
}
```

---

## 7. Real-time WebSocket feed (full example)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="styles/newt-tokens.css" />
    <link rel="stylesheet" href="components/ui/embed.css" />
    <link rel="stylesheet" href="components/ui/timeline.css" />
    <link rel="stylesheet" href="components/ui/channel-topic.css" />
    <link rel="stylesheet" href="components/ui/status-indicator.css" />
    <link rel="stylesheet" href="components/ui/member-list.css" />
    <link rel="stylesheet" href="components/ui/badge.css" />
    <link rel="stylesheet" href="components/ui/scrollbar.css" />
  </head>
  <body
    class="newt-root"
    style="display:grid;grid-template-columns:240px 1fr;height:100vh;"
  >
    <!-- Shard sidebar -->
    <div
      id="shard-list"
      class="newt-scrollbar"
      style="background:var(--newt-bg-surface);padding:16px;overflow-y:auto;"
    >
      <div
        style="font-size:11px;font-weight:700;text-transform:uppercase;
                letter-spacing:.08em;color:var(--newt-text-muted);margin-bottom:12px;"
      >
        Shards
      </div>
    </div>

    <!-- Event feed -->
    <div style="display:flex;flex-direction:column;">
      <div class="newt-channel-topic">
        <span class="newt-channel-topic__icon">#</span>
        <span class="newt-channel-topic__name">live-events</span>
        <span class="newt-channel-topic__divider"></span>
        <span class="newt-channel-topic__desc" id="event-count"
          >0 events received</span
        >
      </div>

      <div
        id="timeline"
        class="newt-timeline newt-scrollbar"
        style="padding:24px;overflow-y:auto;flex:1;"
      ></div>
    </div>

    <script type="module">
      // Replace with your newt-trace WebSocket URL
      // Replace with your actual newt-trace WebSocket URL
      const ws = new WebSocket("wss://your-newt-trace-host/events")
      const timeline = document.getElementById("timeline")
      const shardList = document.getElementById("shard-list")
      let eventCount = 0

      ws.onmessage = ({ data }) => {
        const event = JSON.parse(data)
        eventCount++
        document.getElementById("event-count").textContent =
          `${eventCount} events received`
        addTimelineEvent(timeline, event)
      }

      // Include helper functions from sections 3 and 4 above
    </script>
  </body>
</html>
```

---

## 8. Polling vs WebSocket

|          | Polling                | WebSocket          |
| -------- | ---------------------- | ------------------ |
| Setup    | Simple `setInterval`   | Requires WS server |
| Latency  | Configurable (e.g. 3s) | Real-time          |
| Best for | Shard health status    | Live event feed    |

For shard health (slow-changing), polling every 3–5 seconds is fine.
For the event timeline (high-frequency), use WebSocket or SSE.
