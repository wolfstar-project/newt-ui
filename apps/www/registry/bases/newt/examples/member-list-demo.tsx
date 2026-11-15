import { Avatar } from "@/registry/bases/newt/ui/avatar"
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
} from "@/registry/bases/newt/ui/member-list"
import { RoleTag } from "@/registry/bases/newt/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"

/*
 * Each section holds a heading and its own list. The section links the two,
 * so a screen reader names each list by its heading.
 */
export default function MemberListDemo() {
  return (
    <div className="w-60">
      <MemberListSection>
        <MemberListHeading>Moderators — 1</MemberListHeading>
        <MemberList>
          <MemberListItem>
            <StatusIndicator>
              <Avatar size="md">A</Avatar>
              <StatusDot status="online" label="Online" />
            </StatusIndicator>
            <MemberListInfo>
              <MemberListNameRow>
                <MemberListName color="var(--newt-idle)">
                  username
                </MemberListName>
                <MemberListAppTag verified />
              </MemberListNameRow>
              <MemberListRole>Role</MemberListRole>
            </MemberListInfo>
            <RoleTag className="ms-auto">TAG</RoleTag>
          </MemberListItem>
        </MemberList>
      </MemberListSection>
      <MemberListSection offline>
        <MemberListHeading>Offline — 1</MemberListHeading>
        <MemberList>
          <MemberListItem>
            <StatusIndicator>
              <Avatar size="md">B</Avatar>
              <StatusDot status="offline" label="Offline" />
            </StatusIndicator>
            <MemberListInfo>
              <MemberListNameRow>
                <MemberListName>someone</MemberListName>
              </MemberListNameRow>
            </MemberListInfo>
          </MemberListItem>
        </MemberList>
      </MemberListSection>
    </div>
  )
}
