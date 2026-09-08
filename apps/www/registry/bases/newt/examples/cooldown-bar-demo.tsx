import {
  CooldownBar,
  CooldownBarLabel,
  CooldownBarTrack,
  CooldownBarValue,
} from "@/registry/bases/newt/ui/cooldown-bar"

export default function CooldownBarDemo() {
  return (
    <CooldownBar className="w-full">
      <CooldownBarLabel>
        <span>Command cooldown</span>
        <CooldownBarValue>3.2s</CooldownBarValue>
      </CooldownBarLabel>
      <CooldownBarTrack value={40} aria-label="Command cooldown" />
    </CooldownBar>
  )
}
