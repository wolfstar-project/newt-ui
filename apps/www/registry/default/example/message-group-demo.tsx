import { Avatar } from "@/registry/default/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupReactions,
  MessageGroupTime,
} from "@/registry/default/ui/message-group"
import { Reaction } from "@/registry/default/ui/reaction"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"

export default function MessageGroupDemo() {
  return (
    <MessageGroup className="w-full max-w-md">
      <StatusIndicator>
        <Avatar>U</Avatar>
        <StatusDot status="online" />
      </StatusIndicator>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>username</MessageGroupAuthor>
          <MessageGroupBotTag />
          <MessageGroupTime>Today at 14:23</MessageGroupTime>
        </MessageGroupHeader>
        <MessageGroupContent>Message content goes here.</MessageGroupContent>
        <MessageGroupReactions>
          <Reaction emoji="👍" count={1} />
        </MessageGroupReactions>
      </MessageGroupBody>
    </MessageGroup>
  )
}
