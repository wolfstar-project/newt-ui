import { RoleTag, RoleTagDot } from "@/registry/default/ui/role-tag"

export default function RoleTagDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <RoleTag>
        <RoleTagDot />
        Role name
      </RoleTag>
      <RoleTag color="#5865f2">
        <RoleTagDot />
        Admin
      </RoleTag>
      <RoleTag color="#23a55a">
        <RoleTagDot />
        Moderator
      </RoleTag>
    </div>
  )
}
