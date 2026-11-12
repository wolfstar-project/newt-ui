import { SelectMenu } from "@/registry/bases/newt/ui/select-menu"

const OPTIONS = [
  { value: "auto", label: "Automatic", note: "(Europe)" },
  { value: "eu", label: "Europe" },
  { value: "us-east", label: "US East" },
]

export default function SelectMenuDisabledDemo() {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      <SelectMenu
        options={OPTIONS}
        defaultValue="auto"
        label="Voice region"
        disabled
      />
      <p className="text-xs text-newt-text-muted">
        Only the channel owner can change the voice region.
      </p>
    </div>
  )
}
