"use client"
import * as React from "react"

import {
  ExpressionsPicker,
  type ExpressionCategory,
  type ExpressionItem,
} from "@/registry/bases/newt/ui/expressions-picker"

/* Drawn rather than fetched, so the demo holds up offline. */
function drawn(body: string) {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${body}</svg>`
    )
  )
}
const LAB = drawn(
  `<rect width="32" height="32" rx="16" fill="#5865f2"/><path d="M12 8h8M14 8v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V8" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>`
)
const SPARK = drawn(
  `<circle cx="16" cy="16" r="15" fill="#5865f2"/><path d="M16 7l2.6 5.6L24 14l-4 3.9.9 5.6L16 21l-4.9 2.5.9-5.6-4-3.9 5.4-1.4z" fill="#fff"/>`
)
const CHECK = drawn(
  `<circle cx="16" cy="16" r="15" fill="#23a55a"/><path d="m9 16 5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
)
const HELLO = drawn(
  `<rect x="2" y="6" width="28" height="20" rx="6" fill="#f0b232"/><text x="16" y="20" font-family="sans-serif" font-size="8" font-weight="700" text-anchor="middle" fill="#1e1f22">HELLO</text>`
)
const THANKS = drawn(
  `<rect x="2" y="6" width="28" height="20" rx="6" fill="#23a55a"/><text x="16" y="20" font-family="sans-serif" font-size="7" font-weight="700" text-anchor="middle" fill="#fff">THANKS</text>`
)
const CONFETTI = drawn(
  `<rect width="32" height="32" rx="4" fill="#2b2d31"/><circle cx="9" cy="10" r="2" fill="#f0b232"/><circle cx="22" cy="8" r="2" fill="#5865f2"/><circle cx="15" cy="18" r="2" fill="#f23f43"/><circle cx="24" cy="22" r="2" fill="#23a55a"/>`
)

const categories: ExpressionCategory[] = [
  { id: "lab", kind: "emoji", label: "Newt Lab", iconSrc: LAB },
  { id: "smileys", kind: "emoji", label: "Smileys & Emotion", glyph: "😀" },
  { id: "people", kind: "emoji", label: "People & Body", glyph: "👋" },
  { id: "nature", kind: "emoji", label: "Animals & Nature", glyph: "🌿" },
  { id: "food", kind: "emoji", label: "Food & Drink", glyph: "🍔" },
  { id: "symbols", kind: "emoji", label: "Symbols", glyph: "❤️" },
  { id: "greetings", kind: "sticker", label: "Greetings", glyph: "🎁" },
  { id: "trending", kind: "gif", label: "Trending", glyph: "🔥" },
]

const tones = (base: string) =>
  ["🏻", "🏼", "🏽", "🏾", "🏿"].map((tone) => base + tone)

const items: ExpressionItem[] = [
  {
    id: "spark",
    kind: "emoji",
    category: "lab",
    label: "spark",
    value: ":spark:",
    src: SPARK,
  },
  {
    id: "check",
    kind: "emoji",
    category: "lab",
    label: "check",
    value: ":check:",
    src: CHECK,
  },
  {
    id: "grinning",
    kind: "emoji",
    category: "smileys",
    label: "grinning face",
    value: "😀",
    keywords: ["happy", "smile"],
  },
  {
    id: "joy",
    kind: "emoji",
    category: "smileys",
    label: "face with tears of joy",
    value: "😂",
    keywords: ["laugh"],
  },
  {
    id: "wink",
    kind: "emoji",
    category: "smileys",
    label: "winking face",
    value: "😉",
  },
  {
    id: "thinking",
    kind: "emoji",
    category: "smileys",
    label: "thinking face",
    value: "🤔",
    keywords: ["hmm"],
  },
  {
    id: "cool",
    kind: "emoji",
    category: "smileys",
    label: "smiling face with sunglasses",
    value: "😎",
  },
  {
    id: "party-face",
    kind: "emoji",
    category: "smileys",
    label: "partying face",
    value: "🥳",
    keywords: ["celebrate"],
  },
  {
    id: "wave",
    kind: "emoji",
    category: "people",
    label: "waving hand",
    value: "👋",
    keywords: ["hello"],
    skins: tones("👋"),
  },
  {
    id: "thumbs-up",
    kind: "emoji",
    category: "people",
    label: "thumbs up",
    value: "👍",
    keywords: ["yes"],
    skins: tones("👍"),
  },
  {
    id: "clap",
    kind: "emoji",
    category: "people",
    label: "clapping hands",
    value: "👏",
    skins: tones("👏"),
  },
  {
    id: "raised",
    kind: "emoji",
    category: "people",
    label: "raising hands",
    value: "🙌",
    keywords: ["celebrate"],
    skins: tones("🙌"),
  },
  {
    id: "dog",
    kind: "emoji",
    category: "nature",
    label: "dog face",
    value: "🐶",
  },
  { id: "fox", kind: "emoji", category: "nature", label: "fox", value: "🦊" },
  {
    id: "lizard",
    kind: "emoji",
    category: "nature",
    label: "lizard",
    value: "🦎",
    keywords: ["newt"],
  },
  {
    id: "moon",
    kind: "emoji",
    category: "nature",
    label: "crescent moon",
    value: "🌙",
    disabled: true,
  },
  {
    id: "coffee",
    kind: "emoji",
    category: "food",
    label: "hot beverage",
    value: "☕",
    keywords: ["coffee"],
  },
  { id: "pizza", kind: "emoji", category: "food", label: "pizza", value: "🍕" },
  {
    id: "cake",
    kind: "emoji",
    category: "food",
    label: "birthday cake",
    value: "🎂",
    keywords: ["celebrate"],
  },
  {
    id: "heart",
    kind: "emoji",
    category: "symbols",
    label: "red heart",
    value: "❤️",
    keywords: ["love"],
  },
  {
    id: "sparkles",
    kind: "emoji",
    category: "symbols",
    label: "sparkles",
    value: "✨",
  },
  {
    id: "hundred",
    kind: "emoji",
    category: "symbols",
    label: "hundred points",
    value: "💯",
  },
  {
    id: "hello-sticker",
    kind: "sticker",
    category: "greetings",
    label: "Hello sticker",
    value: "hello-sticker",
    src: HELLO,
  },
  {
    id: "thanks-sticker",
    kind: "sticker",
    category: "greetings",
    label: "Thanks sticker",
    value: "thanks-sticker",
    src: THANKS,
  },
  {
    id: "confetti-gif",
    kind: "gif",
    category: "trending",
    label: "Confetti",
    value: "confetti-gif",
    src: CONFETTI,
    keywords: ["celebrate"],
  },
  {
    id: "applause-gif",
    kind: "gif",
    category: "trending",
    label: "Applause",
    value: "applause-gif",
    keywords: ["clap"],
  },
]

export default function ExpressionsPickerDemo() {
  const [recent, setRecent] = React.useState<string[]>(["wave", "heart"])
  const [selected, setSelected] = React.useState<string | null>(null)
  return (
    <div className="grid gap-[var(--newt-space-3)]">
      <ExpressionsPicker
        items={items}
        categories={categories}
        recent={recent}
        current={selected}
        onSelect={(item, value) => {
          setSelected(value)
          setRecent((list) =>
            [item.id, ...list.filter((id) => id !== item.id)].slice(0, 18)
          )
        }}
      />
      <p role="status" className="m-0 text-newt-text-secondary">
        {selected
          ? `Selected: ${selected}`
          : "Choose an emoji, sticker, or GIF."}
      </p>
    </div>
  )
}
