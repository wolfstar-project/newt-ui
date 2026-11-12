"use client"

import * as React from "react"

import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "@/registry/bases/newt/ui/poll"

const ANSWERS = [
  { value: "voice", label: "Voice chat", emoji: "🎙️", votes: 9 },
  { value: "text", label: "Text only", emoji: "⌨️", votes: 5 },
  { value: "either", label: "Either works", emoji: "🤷", votes: 3 },
]
const VOTES_BEFORE = 17

/* The results stay hidden until the reader has voted, then count their vote. */
export default function PollRevealDemo() {
  const [picked, setPicked] = React.useState<readonly string[]>([])
  const voted = picked.length > 0
  const total = VOTES_BEFORE + (voted ? 1 : 0)

  return (
    <Poll
      total={total}
      showResults={voted}
      value={picked}
      onValueChange={setPicked}
    >
      <PollQuestion>How should we run the next session?</PollQuestion>
      <PollAnswers>
        {ANSWERS.map((answer) => (
          <PollAnswer
            key={answer.value}
            value={answer.value}
            emoji={answer.emoji}
            votes={answer.votes + (picked.includes(answer.value) ? 1 : 0)}
          >
            {answer.label}
          </PollAnswer>
        ))}
      </PollAnswers>
      <PollFooter>
        {voted ? `${total} votes` : "Vote to see the results"}
      </PollFooter>
    </Poll>
  )
}
