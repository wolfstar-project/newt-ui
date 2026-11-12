import { Button } from "@/registry/bases/newt/ui/button"

/* `icon` has no visible text, so the label moves to `aria-label`. */
export default function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="secondary" aria-label="Add a reaction">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          className="block h-5 w-5"
        >
          <path
            fill="currentColor"
            d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z"
          />
        </svg>
      </Button>
    </div>
  )
}
