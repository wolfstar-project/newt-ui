import { Breadcrumb, BreadcrumbItem } from "@/registry/bases/newt/ui/breadcrumb"

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#">Server settings</BreadcrumbItem>
      <BreadcrumbItem href="#">Roles</BreadcrumbItem>
      <BreadcrumbItem current>Moderator</BreadcrumbItem>
    </Breadcrumb>
  )
}
