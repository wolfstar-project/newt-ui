import { Avatar } from "@/registry/default/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupEphemeralAction,
  MessageGroupEphemeralNotice,
  MessageGroupHeader,
  MessageGroupReactions,
  MessageGroupReply,
  MessageGroupTime,
} from "@/registry/default/ui/message-group"
import { Reaction } from "@/registry/default/ui/reaction"
import {
  ReplyPreview,
  ReplyPreviewAuthor,
  ReplyPreviewText,
} from "@/registry/default/ui/reply-preview"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"

export default function MessageGroupDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <MessageGroup withReply>
        <MessageGroupReply>
          <ReplyPreview>
            <ReplyPreviewAuthor>@someone</ReplyPreviewAuthor>
            <ReplyPreviewText>original message text</ReplyPreviewText>
          </ReplyPreview>
        </MessageGroupReply>
        <MessageGroupAvatar>
          <StatusIndicator>
            <Avatar>U</Avatar>
            <StatusDot status="online" />
          </StatusIndicator>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>username</MessageGroupAuthor>
            <MessageGroupBotTag verified />
            <MessageGroupTime dateTime="2026-09-04T14:23:00.000Z">
              Today at 14:23
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>Message content goes here.</MessageGroupContent>
          <MessageGroupReactions>
            <Reaction emoji="👍" count={1} />
          </MessageGroupReactions>
        </MessageGroupBody>
      </MessageGroup>
      <MessageGroup ephemeral>
        <MessageGroupAvatar>
          <Avatar>B</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>botname</MessageGroupAuthor>
            <MessageGroupBotTag>APP</MessageGroupBotTag>
          </MessageGroupHeader>
          <MessageGroupContent>Command ran successfully.</MessageGroupContent>
          <MessageGroupEphemeralNotice>
            Only you can see this •
            <MessageGroupEphemeralAction>
              Dismiss message
            </MessageGroupEphemeralAction>
          </MessageGroupEphemeralNotice>
        </MessageGroupBody>
      </MessageGroup>
    </div>
  )
}
