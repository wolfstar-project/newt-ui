import { Button } from "@/registry/bases/newt/ui/button"
import { Kbd } from "@/registry/bases/newt/ui/kbd-tag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/newt/ui/tooltip"

/* The content is a slot: the label can bring the keys that do the same thing. */
export default function TooltipShortcutDemo() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="secondary" aria-describedby="tooltip-shortcut">
          Quick switcher
        </Button>
      </TooltipTrigger>
      <TooltipContent
        id="tooltip-shortcut"
        className="flex items-center gap-1.5"
      >
        Jump to a channel
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
