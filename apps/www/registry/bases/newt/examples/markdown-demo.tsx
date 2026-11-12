import {
  Markdown,
  type MarkdownMentionTarget,
} from "@/registry/bases/newt/ui/markdown"

const MESSAGE = `## Release notes
The **new build** is out — read the [changelog](https://example.com/changelog) or ping <@1001> in <#2002>.
- Fixed the *reconnect* loop
  - Sessions resume after a dropped socket
- Added \`/ban\` options for <@&3003>
> Rolling out ||tonight|| at <t:1767225600:t>.
\`\`\`ts
const shard = await connect({ id: 3 })
\`\`\`
-# Posted by the release bot`

/* Mentions carry ids; the page that renders them knows the names. */
const NAMES = new Map<string, MarkdownMentionTarget>([
  ["user:1001", { name: "username" }],
  ["channel:2002", { name: "announcements" }],
  ["role:3003", { name: "Moderator", color: "#f0b232" }],
])

export default function MarkdownDemo() {
  return (
    <Markdown
      className="max-w-xl text-[15px] leading-[1.375] text-newt-text-secondary"
      content={MESSAGE}
      resolveMention={(kind, id) => NAMES.get(`${kind}:${id}`)}
    />
  )
}
