import {
  Attachment,
  AttachmentIcon,
  AttachmentMeta,
  AttachmentName,
  AttachmentSize,
} from "@/registry/bases/newt/ui/attachment"
import { Button } from "@/registry/bases/newt/ui/button"

export default function AttachmentDemo() {
  return (
    <Attachment>
      <AttachmentIcon>FILE</AttachmentIcon>
      <AttachmentMeta>
        <AttachmentName>filename.ext</AttachmentName>
        <AttachmentSize>1.2 MB</AttachmentSize>
      </AttachmentMeta>
      <Button variant="icon" aria-label="Download file">
        ⬇
      </Button>
    </Attachment>
  )
}
