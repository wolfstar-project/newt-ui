import { Avatar } from "@/registry/bases/newt/ui/avatar"
import { Button } from "@/registry/bases/newt/ui/button"
import { RoleTag } from "@/registry/bases/newt/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"
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
} from "@/registry/bases/newt/ui/user-profile"

export default function UserProfileDemo() {
  return (
    <UserProfile>
      <UserProfileBanner />
      <UserProfileHead>
        <UserProfileActions>
          <Button variant="secondary" size="icon" aria-label="Send message">
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
