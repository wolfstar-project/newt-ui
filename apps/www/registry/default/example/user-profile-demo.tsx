import { Avatar } from "@/registry/default/ui/avatar"
import { Button } from "@/registry/default/ui/button"
import { RoleTag } from "@/registry/default/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"
import {
  UserProfile,
  UserProfileActions,
  UserProfileAvatar,
  UserProfileBanner,
  UserProfileBio,
  UserProfileBody,
  UserProfileDivider,
  UserProfileHandle,
  UserProfileHead,
  UserProfileName,
  UserProfileRoles,
  UserProfileSectionLabel,
} from "@/registry/default/ui/user-profile"

export default function UserProfileDemo() {
  return (
    <UserProfile>
      <UserProfileBanner />
      <UserProfileHead>
        <UserProfileActions>
          <Button variant="icon" aria-label="Send message">
            ✉
          </Button>
        </UserProfileActions>
        <UserProfileAvatar>
          <StatusIndicator>
            <Avatar size="lg">U</Avatar>
            <StatusDot status="online" />
          </StatusIndicator>
        </UserProfileAvatar>
        <UserProfileName>username</UserProfileName>
        <UserProfileHandle>username#0000</UserProfileHandle>
        <UserProfileDivider />
      </UserProfileHead>
      <UserProfileBody>
        <UserProfileSectionLabel>About me</UserProfileSectionLabel>
        <UserProfileBio>Bio text goes here.</UserProfileBio>
        <UserProfileDivider />
        <UserProfileSectionLabel>Roles</UserProfileSectionLabel>
        <UserProfileRoles>
          <RoleTag>Role</RoleTag>
        </UserProfileRoles>
      </UserProfileBody>
    </UserProfile>
  )
}
