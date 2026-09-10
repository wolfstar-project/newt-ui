export type MemberStatus = "online" | "idle" | "dnd" | "offline" | "streaming"

/*
 * The shape the sidebar reads. A block does not know your data layer; map onto
 * this at the edge of it.
 */
export interface SidebarMember {
  id: string
  name: string
  initials: string
  status: MemberStatus
  /** The section heading this member belongs under. */
  group: string
}

export interface VoiceChannelSummary {
  name: string
  members: readonly string[]
}
