import { Button } from "@/registry/default/ui/button"
import {
  Invite,
  InviteBody,
  InviteCount,
  InviteCounts,
  InviteEyebrow,
  InviteIcon,
  InviteInfo,
  InviteName,
} from "@/registry/default/ui/invite"

/* Inline so the demo never reaches out to the network for a placeholder. */
const SERVER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%235865f2'/%3E%3C/svg%3E"

export default function InviteDemo() {
  return (
    <Invite>
      <InviteEyebrow>You&apos;ve been invited to join a server</InviteEyebrow>
      <InviteBody>
        <InviteIcon src={SERVER_ICON} />
        <InviteInfo>
          <InviteName href="#">Newt Community</InviteName>
          <InviteCounts>
            <InviteCount online>1,024 Online</InviteCount>
            <InviteCount>8,192 Members</InviteCount>
          </InviteCounts>
        </InviteInfo>
        <Button variant="success">Join</Button>
      </InviteBody>
    </Invite>
  )
}
