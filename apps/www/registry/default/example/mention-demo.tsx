import { Mention } from "@/registry/default/ui/mention"

export default function MentionDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Mention variant="user">@username</Mention>
      <Mention variant="channel">#channel</Mention>
      <Mention variant="role">@RoleName</Mention>
    </div>
  )
}
