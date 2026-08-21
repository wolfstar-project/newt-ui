import {
  Permission,
  PermissionDescription,
  PermissionInfo,
  PermissionName,
  PermissionStates,
} from "@/registry/default/ui/permission"

export default function PermissionDemo() {
  return (
    <div className="w-full max-w-md">
      <Permission>
        <PermissionInfo>
          <PermissionName>Permission name</PermissionName>
          <PermissionDescription>Permission description.</PermissionDescription>
        </PermissionInfo>
        <PermissionStates aria-label="Permission name" defaultValue="inherit" />
      </Permission>
    </div>
  )
}
