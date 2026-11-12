import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "@/registry/bases/newt/ui/poll"

/* A closed poll: the results stay, and no answer takes a click any more. */
export default function PollClosedDemo() {
  return (
    <Poll total={48} showResults defaultValue={["co-op"]}>
      <PollQuestion>What should we play next season?</PollQuestion>
      <PollAnswers>
        <PollAnswer value="co-op" votes={27} emoji="🤝" disabled>
          Co-op campaign
        </PollAnswer>
        <PollAnswer value="ranked" votes={15} emoji="🏆" disabled>
          Ranked ladder
        </PollAnswer>
        <PollAnswer value="casual" votes={6} emoji="🎲" disabled>
          Casual nights
        </PollAnswer>
      </PollAnswers>
      <PollFooter>48 votes · Poll closed</PollFooter>
    </Poll>
  )
}
