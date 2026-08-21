import {
  ReplyPreview,
  ReplyPreviewAuthor,
  ReplyPreviewText,
} from "@/registry/default/ui/reply-preview"

export default function ReplyPreviewDemo() {
  return (
    <ReplyPreview>
      <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
      <ReplyPreviewText>
        original message text being replied to
      </ReplyPreviewText>
    </ReplyPreview>
  )
}
