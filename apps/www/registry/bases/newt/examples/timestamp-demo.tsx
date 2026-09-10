import { Timestamp } from "@/registry/bases/newt/ui/timestamp"

/* Fixed rather than `Date.now()`, so the demo renders the same every time. */
const RAID = new Date("2026-09-12T20:00:00Z")

export default function TimestampDemo() {
  return (
    <div className="flex flex-col gap-2 text-sm text-newt-text-secondary">
      <p>
        The raid starts <Timestamp value={RAID} format="relative" />.
      </p>
      <p>
        Doors open at <Timestamp value={RAID} format="shortTime" /> on{" "}
        <Timestamp value={RAID} format="longDate" />.
      </p>
    </div>
  )
}
