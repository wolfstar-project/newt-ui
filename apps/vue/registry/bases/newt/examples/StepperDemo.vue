<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Stepper } from "~~/registry/bases/newt/ui/stepper"

const STEPS = [
  { title: "Create the app", description: "Name and icon" },
  { title: "Add a bot", description: "Token and intents" },
  { title: "Invite it", description: "Pick a server" },
]

const step = ref(1)
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-6">
    <Stepper :steps="STEPS" :value="step" />
    <div class="flex justify-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        :disabled="step === 0"
        @click="step -= 1"
      >
        Back
      </Button>
      <Button size="sm" :disabled="step === STEPS.length" @click="step += 1">
        {{ step >= STEPS.length - 1 ? "Finish" : "Next" }}
      </Button>
    </div>
  </div>
</template>
