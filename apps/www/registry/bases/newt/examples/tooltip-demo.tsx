import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/newt/ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Help"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-newt-bg-elevated text-sm font-medium text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent>Tooltip text</TooltipContent>
    </Tooltip>
  )
}
