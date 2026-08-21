import { Avatar } from "@/registry/default/ui/avatar"
import {
  MemberList,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListRole,
} from "@/registry/default/ui/member-list"
import { RoleTag } from "@/registry/default/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"

export default function MemberListDemo() {
  return (
    <MemberList className="w-60">
      <MemberListItem>
        <StatusIndicator>
          <Avatar size="sm">A</Avatar>
          <StatusDot status="online" />
        </StatusIndicator>
        <MemberListInfo>
          <MemberListName>username</MemberListName>
          <MemberListRole>Role</MemberListRole>
        </MemberListInfo>
        <RoleTag className="ml-auto">TAG</RoleTag>
      </MemberListItem>
    </MemberList>
  )
}
