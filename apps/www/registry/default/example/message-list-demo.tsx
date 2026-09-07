import { Avatar } from "@/registry/default/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/registry/default/ui/message-group"
import { MessageList } from "@/registry/default/ui/message-list"

export default function MessageListDemo() {
  return (
    <MessageList label="Messages in #general" className="w-full max-w-md">
      <MessageGroup>
        <MessageGroupAvatar>
          <Avatar>U</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>username</MessageGroupAuthor>
            <MessageGroupTime dateTime="2026-09-04T14:23:00.000Z">
              Today at 14:23
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>First message.</MessageGroupContent>
        </MessageGroupBody>
      </MessageGroup>
      <MessageGroup>
        <MessageGroupAvatar>
          <Avatar>B</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>someone</MessageGroupAuthor>
            <MessageGroupTime dateTime="2026-09-04T14:24:00.000Z">
              Today at 14:24
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>Second message.</MessageGroupContent>
        </MessageGroupBody>
      </MessageGroup>
    </MessageList>
  )
}
