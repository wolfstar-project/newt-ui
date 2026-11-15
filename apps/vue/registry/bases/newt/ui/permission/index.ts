export { default as Permission } from "./Permission.vue"
export { default as PermissionInfo } from "./PermissionInfo.vue"
export { default as PermissionName } from "./PermissionName.vue"
export { default as PermissionDescription } from "./PermissionDescription.vue"
export { default as PermissionStates } from "./PermissionStates.vue"

export type PermissionValue = "deny" | "inherit" | "allow"

/** The accessible name of each state button. */
export interface PermissionStateLabels {
  deny: string
  inherit: string
  allow: string
}

/** The English defaults. Pass `labels` to translate them. */
export const defaultPermissionStateLabels: PermissionStateLabels = {
  deny: "Deny",
  inherit: "Inherit",
  allow: "Allow",
}
