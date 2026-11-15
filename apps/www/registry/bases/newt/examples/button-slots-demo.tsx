import { Button } from "@/registry/bases/newt/ui/button"

/* Any icon component works the same way; this one is inline to stay offline. */
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4"
  >
    <path
      fill="currentColor"
      d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z"
    />
  </svg>
)

/* A unicode emoji is text: hide it when the label already says the action. */
export default function ButtonSlotsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="message" variant="secondary" leading={<PlusIcon />}>
        Add role
      </Button>
      <Button size="message" leading={<span aria-hidden="true">🎉</span>}>
        Celebrate
      </Button>
      <Button
        size="message"
        variant="success"
        trailing={<span aria-hidden="true">✅</span>}
      >
        Accept
      </Button>
    </div>
  )
}
