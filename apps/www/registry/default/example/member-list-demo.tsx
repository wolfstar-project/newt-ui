import { Avatar } from "@/registry/default/ui/avatar"
import {
  MemberList,
  MemberListAppTag,
  MemberListHeading,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListNameRow,
  MemberListRole,
  MemberListSection,
} from "@/registry/default/ui/member-list"
import { RoleTag } from "@/registry/default/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"

export default function MemberListDemo() {
  return (
    <MemberList className="w-60">
      <MemberListSection>
        <MemberListHeading>Moderators — 1</MemberListHeading>
        <MemberListItem>
          <StatusIndicator>
            <Avatar size="sm">A</Avatar>
            <StatusDot status="online" />
          </StatusIndicator>
          <MemberListInfo>
            <MemberListNameRow>
              <MemberListName color="#f0b232">username</MemberListName>
              <MemberListAppTag verified />
            </MemberListNameRow>
            <MemberListRole>Role</MemberListRole>
          </MemberListInfo>
          <RoleTag className="ml-auto">TAG</RoleTag>
        </MemberListItem>
      </MemberListSection>
      <MemberListSection offline>
        <MemberListHeading>Offline — 1</MemberListHeading>
        <MemberListItem>
          <StatusIndicator>
            <Avatar size="sm">B</Avatar>
            <StatusDot status="offline" />
          </StatusIndicator>
          <MemberListInfo>
            <MemberListNameRow>
              <MemberListName>someone</MemberListName>
            </MemberListNameRow>
          </MemberListInfo>
        </MemberListItem>
      </MemberListSection>
    </MemberList>
  )
}
