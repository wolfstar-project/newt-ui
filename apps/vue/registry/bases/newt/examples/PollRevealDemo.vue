<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Poll,
  PollAnswer,
  PollAnswers,
  PollFooter,
  PollQuestion,
} from "~~/registry/bases/newt/ui/poll"

const answers = [
  { value: "voice", label: "Voice chat", emoji: "🎙️", votes: 9 },
  { value: "text", label: "Text only", emoji: "⌨️", votes: 5 },
  { value: "either", label: "Either works", emoji: "🤷", votes: 3 },
]
const VOTES_BEFORE = 17

/* The results stay hidden until the reader has voted, then count their vote. */
const picked = ref<readonly string[]>([])
const voted = computed(() => picked.value.length > 0)
const total = computed(() => VOTES_BEFORE + (voted.value ? 1 : 0))
</script>

<template>
  <Poll v-model="picked" :total="total" :show-results="voted">
    <PollQuestion>How should we run the next session?</PollQuestion>
    <PollAnswers>
      <PollAnswer
        v-for="answer in answers"
        :key="answer.value"
        :value="answer.value"
        :emoji="answer.emoji"
        :votes="answer.votes + (picked.includes(answer.value) ? 1 : 0)"
      >
        {{ answer.label }}
      </PollAnswer>
    </PollAnswers>
    <PollFooter>
      {{ voted ? `${total} votes` : "Vote to see the results" }}
    </PollFooter>
  </Poll>
</template>
