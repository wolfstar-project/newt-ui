"use client"

import * as React from "react"

import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "@/registry/bases/newt/ui/poll"

export default function PollDemo() {
  const [answer, setAnswer] = React.useState<readonly string[]>(["friday"])

  return (
    <Poll total={21} showResults value={answer} onValueChange={setAnswer}>
      <PollQuestion>Which day works for the raid?</PollQuestion>
      <PollAnswers>
        <PollAnswer value="friday" votes={13} emoji="🌙">
          Friday night
        </PollAnswer>
        <PollAnswer value="sunday" votes={8} emoji="☀️">
          Sunday afternoon
        </PollAnswer>
      </PollAnswers>
      <PollFooter>21 votes · 4 hours left</PollFooter>
    </Poll>
  )
}
