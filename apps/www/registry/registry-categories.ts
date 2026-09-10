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
      "invite",
      "reaction",
      "reply-preview",
      "poll",
      "system-message",
      "thread-preview",
      "attachment",
      "slash-command",
      "slash-command-suggestions",
      "divider",
      "channel-header",
      "channel-topic",
      "channel-welcome",
      "channel-info",
      "notif-badge",
      "user-profile",
    ],
  },
  /*
   * The pieces that exist because a message or modal payload defines them,
   * rather than because an interface needs them: they are assembled by an app
   * and rendered by the client, and they are listed in the platform's own
   * component reference. Anything that is also an ordinary control — a button,
   * a select, a radio group — stays with its own kind.
   */
  {
    slug: "message-components",
    label: "Message components",
    components: [
      "action-row",
      "v2-container",
      "section",
      "media-gallery",
      "entity-select",
      "file-upload",
      "checkbox-group",
    ],
  },
  {
    slug: "forms-data",
    label: "Forms & data",
    components: [
      "form-fields",
      "radio",
      "token-field",
      "select-menu",
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
