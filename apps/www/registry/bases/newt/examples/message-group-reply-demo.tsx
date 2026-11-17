import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupReply,
  MessageGroupTime,
} from "@/registry/bases/newt/ui/message-group"
import {
  ReplyPreview,
  ReplyPreviewAction,
  ReplyPreviewAuthor,
  ReplyPreviewCommand,
  ReplyPreviewText,
} from "@/registry/bases/newt/ui/reply-preview"

/*
 * The spine of the preview starts above the centre of the avatar. The second
 * row holds a smaller avatar, so it states the size and the gap it uses.
 */
export default function MessageGroupReplyDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <MessageGroup withReply>
        <MessageGroupReply>
          <ReplyPreview>
            <ReplyPreviewAuthor>@rowan</ReplyPreviewAuthor>
            <ReplyPreviewText>
              Is the raid still on for Friday?
            </ReplyPreviewText>
          </ReplyPreview>
        </MessageGroupReply>
        <MessageGroupAvatar>
          <Avatar>J</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>juniper</MessageGroupAuthor>
            <MessageGroupTime dateTime="2026-09-04T14:25:00.000Z">
              Today at 14:25
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>
            Yes, same time as last week.
          </MessageGroupContent>
        </MessageGroupBody>
      </MessageGroup>
      <MessageGroup
        withReply
        className="[--newt-message-group-avatar-size:24px] [--newt-message-group-gap:12px]"
      >
        <MessageGroupReply>
          <ReplyPreview>
            <ReplyPreviewAuthor>@sorrel</ReplyPreviewAuthor>
            <ReplyPreviewAction>used</ReplyPreviewAction>
            <ReplyPreviewCommand>/roll</ReplyPreviewCommand>
          </ReplyPreview>
        </MessageGroupReply>
        <MessageGroupAvatar>
          <Avatar size="sm">D</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>dicebot</MessageGroupAuthor>
            <MessageGroupBotTag />
            <MessageGroupTime dateTime="2026-09-04T14:31:00.000Z">
              Today at 14:31
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>Sorrel rolled a 17.</MessageGroupContent>
        </MessageGroupBody>
      </MessageGroup>
    </div>
  )
}
