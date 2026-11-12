import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/newt/ui/avatar"

/* Inline so the demo never reaches out to the network for a placeholder. */
const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%233ba55d'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23ffffff'/%3E%3Cpath d='M6 40a14 14 0 0 1 28 0Z' fill='%23ffffff'/%3E%3C/svg%3E"

/* The name beside it is the accessible name, so the avatar stays silent. */
export default function AvatarWithNameDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={PHOTO} alt="" />
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-newt-text-primary">
            Mira Okafor
          </span>
          <span className="truncate text-xs text-newt-text-muted">
            Moderator
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar aria-hidden="true">
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-newt-text-primary">
            Jun Park
          </span>
          <span className="truncate text-xs text-newt-text-muted">
            Joined yesterday
          </span>
        </div>
      </div>
    </div>
  )
}
