import { PinInput } from "@/registry/bases/newt/ui/pin-input"

export default function PinInputMaskDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <PinInput label="Parental PIN" length={4} defaultValue="27" mask />
      <p className="text-xs text-newt-text-muted">
        Enter the 4-digit PIN to change these settings
      </p>
    </div>
  )
}
