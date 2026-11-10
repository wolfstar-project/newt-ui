export type UserStatus = "online" | "idle" | "dnd" | "offline" | "streaming"

/*
 * The shape the sidebar reads. A block does not know your data layer; map
 * onto this at the edge of it.
 */
export interface SidebarUser {
  name: string
  initials: string
  status: UserStatus
  /** The line under the name. */
  statusText?: string
}
