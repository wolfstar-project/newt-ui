import { Avatar } from "@/registry/default/ui/avatar"
import { DirectionProvider } from "@/registry/default/ui/direction"
import { MessageComposer } from "@/registry/default/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/registry/default/ui/message-group"

/*
 * The same components as anywhere else, with one attribute above them. Nothing
 * here is direction-aware: the logical properties do the work.
 *
 * Placeholder names only — no real account, and no Discord asset.
 */
export default function DirectionDemo() {
  return (
    <DirectionProvider
      dir="rtl"
      className="flex w-full max-w-md flex-col gap-2"
    >
      <MessageGroup>
        <MessageGroupAvatar>
          <Avatar>ل</Avatar>
        </MessageGroupAvatar>
        <MessageGroupBody>
          <MessageGroupHeader>
            <MessageGroupAuthor>ليلى</MessageGroupAuthor>
            <MessageGroupTime dateTime="2026-09-07T12:04">
              اليوم 12:04
            </MessageGroupTime>
          </MessageGroupHeader>
          <MessageGroupContent>
            كل شيء يعمل من اليمين إلى اليسار.
          </MessageGroupContent>
        </MessageGroupBody>
      </MessageGroup>
      <MessageComposer channelName="عام" />
    </DirectionProvider>
  )
}
