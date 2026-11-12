import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/registry/bases/newt/ui/message-group"

const MESSAGES = [
  {
    author: "rowan",
    initial: "R",
    dateTime: "2026-09-04T14:23:00.000Z",
    time: "Today at 14:23",
    content: "Is the raid still on for Friday?",
  },
  {
    author: "juniper",
    initial: "J",
    dateTime: "2026-09-04T14:25:00.000Z",
    time: "Today at 14:25",
    content: "Yes, same time as last week.",
  },
  {
    author: "sorrel",
    initial: "S",
    dateTime: "2026-09-04T14:31:00.000Z",
    time: "Today at 14:31",
    content: "I can bring a healer this time.",
  },
]

/* `as="li"` makes each row an item of the list that holds the channel. */
export default function MessageGroupListDemo() {
  return (
    <ol
      aria-label="Messages in raid-planning"
      className="m-0 flex w-full max-w-md list-none flex-col p-0"
    >
      {MESSAGES.map((message) => (
        <MessageGroup key={message.dateTime} as="li">
          <MessageGroupAvatar>
            <Avatar>{message.initial}</Avatar>
          </MessageGroupAvatar>
          <MessageGroupBody>
            <MessageGroupHeader>
              <MessageGroupAuthor>{message.author}</MessageGroupAuthor>
              <MessageGroupTime dateTime={message.dateTime}>
                {message.time}
              </MessageGroupTime>
            </MessageGroupHeader>
            <MessageGroupContent>{message.content}</MessageGroupContent>
          </MessageGroupBody>
        </MessageGroup>
      ))}
    </ol>
  )
}
