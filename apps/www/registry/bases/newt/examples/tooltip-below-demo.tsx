import { Button } from "@/registry/bases/newt/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/newt/ui/tooltip"

/*
 * The label opens above its trigger by default. `side="bottom"` puts it
 * underneath, for a trigger that is already at the top of the window. Radix
 * flips it by itself when there is no room on the chosen side.
 */
export default function TooltipBelowDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Pinned messages</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        3 messages pinned in this channel
      </TooltipContent>
    </Tooltip>
  )
}
