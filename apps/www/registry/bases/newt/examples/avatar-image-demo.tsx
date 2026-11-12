import { Avatar, AvatarImage } from "@/registry/bases/newt/ui/avatar"

/* Inline so the demo never reaches out to the network for a placeholder. */
const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%233ba55d'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23ffffff'/%3E%3Cpath d='M6 40a14 14 0 0 1 28 0Z' fill='%23ffffff'/%3E%3C/svg%3E"

export default function AvatarImageDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src={PHOTO} alt="Mira Okafor" />
      </Avatar>
      <Avatar>
        <AvatarImage src={PHOTO} alt="Mira Okafor" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={PHOTO} alt="Mira Okafor" />
      </Avatar>
    </div>
  )
}
