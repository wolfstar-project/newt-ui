import { Avatar, AvatarFallback } from "@/registry/bases/newt/ui/avatar"

/*
 * Initials on their own are not a name, so a lone avatar is an image with a
 * label. The fill is a token utility passed through `className`.
 */
export default function AvatarFallbackDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar role="img" aria-label="Mira Okafor">
        <AvatarFallback>MO</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Jun Park" className="bg-newt-online">
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Sam Reyes" className="bg-newt-danger">
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar
        role="img"
        aria-label="Deleted user"
        className="bg-newt-bg-elevated text-newt-text-muted"
      >
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    </div>
  )
}
