import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "@/registry/bases/newt/ui/poll"

/* With `multiple` a second click on an answer takes the vote back. */
export default function PollMultipleDemo() {
  return (
    <Poll multiple defaultValue={["dungeon"]}>
      <PollQuestion>Which maps should stay in rotation?</PollQuestion>
      <PollAnswers>
        <PollAnswer value="dungeon" emoji="🏰">
          Sunken keep
        </PollAnswer>
        <PollAnswer value="forest" emoji="🌲">
          Old forest
        </PollAnswer>
        <PollAnswer value="desert" emoji="🏜️">
          Glass desert
        </PollAnswer>
      </PollAnswers>
      <PollFooter>Select one or more answers</PollFooter>
    </Poll>
  )
}
