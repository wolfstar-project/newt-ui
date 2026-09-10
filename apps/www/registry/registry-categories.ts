// Sidebar taxonomy, ported from the original single-page docs (index.html).
export interface DocsCategory {
  slug: string
  label: string
  components: string[]
}

export const categories: DocsCategory[] = [
  {
    slug: "actions",
    label: "Actions",
    components: ["button", "dropdown", "context-menu", "kbd-tag", "tabs"],
  },
  {
    slug: "feedback",
    label: "Feedback",
    components: [
      "badge",
      "toast",
      "modal",
      "tooltip",
      "progress",
      "cooldown-bar",
      "skeleton",
      "empty-state",
      "pagination",
    ],
  },
  {
    slug: "identity",
    label: "Identity & presence",
    components: [
      "avatar",
      "status-indicator",
      "member-list",
      "role-tag",
      "voice-channel",
      "server-banner",
      "stage-banner",
      "typing-indicator",
    ],
  },
  {
    slug: "messaging",
    label: "Messaging",
    components: [
      "chat",
      "message-list",
      "message-composer",
      "embed",
      "message-group",
      "action-row",
      "invite",
      "reaction",
      "reply-preview",
      "poll",
      "system-message",
      "thread-preview",
      "section",
      "media-gallery",
      "attachment",
      "slash-command",
      "slash-command-suggestions",
      "v2-container",
      "divider",
      "channel-header",
      "channel-topic",
      "channel-welcome",
      "channel-info",
      "notif-badge",
      "user-profile",
    ],
  },
  {
    slug: "forms-data",
    label: "Forms & data",
    components: [
      "form-fields",
      "radio",
      "checkbox-group",
      "file-upload",
      "token-field",
      "select-menu",
      "entity-select",
      "card",
      "permission",
      "timeline",
      "bot-command-card",
    ],
  },
  {
    slug: "formatting",
    label: "Formatting",
    components: [
      "typeset",
      "mention",
      "custom-emoji",
      "timestamp",
      "spoiler",
      "inline-code",
      "code-block",
    ],
  },
  {
    slug: "utilities",
    label: "Utilities",
    components: ["scrollbar", "app-launcher", "direction"],
  },
  {
    slug: "blocks",
    label: "Blocks",
    components: ["chat-window", "server-sidebar", "command-panel"],
  },
]
