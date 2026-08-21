import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/registry/default/ui/empty-state"

export default function EmptyStateDemo() {
  return (
    <EmptyState>
      <EmptyStateIcon>📭</EmptyStateIcon>
      <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
      <EmptyStateDescription>
        Description of what to do next.
      </EmptyStateDescription>
    </EmptyState>
  )
}
