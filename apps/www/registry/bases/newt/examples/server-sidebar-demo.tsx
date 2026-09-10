import { ServerSidebar } from "@/registry/bases/newt/blocks/server-sidebar/server-sidebar"

/* Placeholder names: no real account, and no Discord asset. */
const MEMBERS = [
  {
    id: "1",
    name: "alex",
    initials: "A",
    status: "online",
    group: "Moderators",
  },
  { id: "2", name: "sam", initials: "S", status: "idle", group: "Online" },
  { id: "3", name: "robin", initials: "R", status: "dnd", group: "Online" },
  { id: "4", name: "kit", initials: "K", status: "offline", group: "Offline" },
] as const

export default function ServerSidebarDemo() {
  return (
    <ServerSidebar
      className="w-64"
      serverName="Build Club"
      voiceChannel={{ name: "General voice", members: ["alex", "sam"] }}
      members={MEMBERS}
    />
  )
}
