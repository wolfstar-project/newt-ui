<script setup lang="ts">
import { ref } from "vue"
import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "~~/registry/bases/newt/ui/poll"

const answer = ref<readonly string[]>(["friday"])
</script>

<template>
  <Poll v-model="answer" :total="21" show-results>
    <PollQuestion>Which day works for the raid?</PollQuestion>
    <PollAnswers>
      <PollAnswer value="friday" :votes="13" emoji="🌙"
        >Friday night</PollAnswer
      >
      <PollAnswer value="sunday" :votes="8" emoji="☀️">
        Sunday afternoon
      </PollAnswer>
    </PollAnswers>
    <PollFooter>21 votes · 4 hours left</PollFooter>
  </Poll>
</template>
