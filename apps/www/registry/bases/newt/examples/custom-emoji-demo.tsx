import { CustomEmoji } from "@/registry/bases/newt/ui/custom-emoji"

/* Drawn rather than fetched, so the demo holds up offline. */
const SPARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="#5865f2"/>
      <path d="M16 7l2.6 5.6L24 14l-4 3.9.9 5.6L16 21l-4.9 2.5.9-5.6-4-3.9 5.4-1.4z" fill="#fff"/>
    </svg>`
  )

export default function CustomEmojiDemo() {
  return (
    <div className="flex flex-col gap-3 text-[15px] text-newt-text-secondary">
      <p>
        Ship it <CustomEmoji src={SPARK} name="spark" />
      </p>
      <p>
        <CustomEmoji src={SPARK} name="spark" size="jumbo" />
      </p>
    </div>
  )
}
