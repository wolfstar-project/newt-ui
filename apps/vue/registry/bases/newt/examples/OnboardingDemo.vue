<script setup lang="ts">
import { computed, ref } from "vue"
import { Onboarding } from "~~/registry/bases/newt/blocks/onboarding"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~~/registry/bases/newt/ui/alert"
import {
  CheckboxGroup,
  CheckboxOption,
} from "~~/registry/bases/newt/ui/checkbox-group"
import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "~~/registry/bases/newt/ui/form-fields"
import { Radio, RadioGroup } from "~~/registry/bases/newt/ui/radio"

const STEPS = [
  { title: "Name your server", description: "You can change it later" },
  { title: "What is it for?", description: "Sets the defaults" },
  { title: "Starting channels", description: "Pick at least one" },
]

const name = ref("Build Club")
const purpose = ref("community")
const channels = ref<readonly string[]>(["general"])
const step = ref(0)
const done = ref(false)

const canContinue = computed(() => {
  if (step.value === 0) return String(name.value).trim() !== ""
  if (step.value === 2) return channels.value.length > 0
  return true
})
</script>

<template>
  <Alert v-if="done" variant="success" class="max-w-xl">
    <AlertTitle>{{ name }} is ready</AlertTitle>
    <AlertDescription>
      Created with {{ channels.length }}
      {{ channels.length === 1 ? "channel" : "channels" }}.
    </AlertDescription>
  </Alert>
  <Onboarding
    v-else
    v-model:step="step"
    class="max-w-xl"
    aria-label="Create a server"
    :steps="STEPS"
    :can-continue="canContinue"
    @complete="done = true"
  >
    <template #default="{ step: current }">
      <Field v-if="current === 0">
        <Label for="onboarding-name">Server name</Label>
        <Input id="onboarding-name" v-model="name" />
        <FieldHelp>Members see this at the top of the channel list.</FieldHelp>
      </Field>
      <RadioGroup v-else-if="current === 1" v-model="purpose" label="Purpose">
        <Radio value="community" description="Open to anyone with the link.">
          A community
        </Radio>
        <Radio
          value="team"
          description="Invite only, for people you work with."
        >
          A team
        </Radio>
      </RadioGroup>
      <CheckboxGroup v-else v-model="channels" label="Starting channels">
        <CheckboxOption value="general">#general</CheckboxOption>
        <CheckboxOption value="help" description="Questions and answers">
          #help
        </CheckboxOption>
        <CheckboxOption value="release-notes">#release-notes</CheckboxOption>
      </CheckboxGroup>
    </template>
  </Onboarding>
</template>
