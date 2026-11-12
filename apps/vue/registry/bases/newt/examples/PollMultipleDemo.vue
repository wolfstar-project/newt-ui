<script setup lang="ts">
import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "~~/registry/bases/newt/ui/poll"

/* With `multiple` a second click on an answer takes the vote back. */
</script>

<template>
  <Poll multiple :default-value="['dungeon']">
    <PollQuestion>Which maps should stay in rotation?</PollQuestion>
    <PollAnswers>
      <PollAnswer value="dungeon" emoji="🏰">Sunken keep</PollAnswer>
      <PollAnswer value="forest" emoji="🌲">Old forest</PollAnswer>
      <PollAnswer value="desert" emoji="🏜️">Glass desert</PollAnswer>
    </PollAnswers>
    <PollFooter>Select one or more answers</PollFooter>
  </Poll>
</template>
