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
      "embed",
      "message-group",
      "reaction",
      "reply-preview",
      "mention",
      "spoiler",
      "attachment",
      "slash-command",
      "divider",
      "channel-topic",
      "notif-badge",
      "user-profile",
    ],
  },
  {
    slug: "forms-data",
    label: "Forms & data",
    components: [
      "form-fields",
      "token-field",
      "select-menu",
      "card",
      "permission",
      "timeline",
      "code-block",
      "bot-command-card",
    ],
  },
  {
    slug: "utilities",
    label: "Utilities",
    components: ["scrollbar"],
  },
]
