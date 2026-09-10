<script setup lang="ts">
import { ref } from "vue"
import { Radio, RadioGroup } from "~~/registry/bases/newt/ui/radio"

const mode = ref("voice-activity")
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <RadioGroup v-model="mode" label="Input mode">
      <Radio value="voice-activity">Voice Activity</Radio>
      <Radio value="push-to-talk">Push to Talk</Radio>
    </RadioGroup>

    <RadioGroup label="Who can reply" default-value="everyone">
      <Radio
        value="everyone"
        description="Anyone in the channel can reply to this message."
      >
        Everyone
      </Radio>
      <Radio
        value="nobody"
        description="Replies are turned off for this message."
        disabled
      >
        Nobody
      </Radio>
    </RadioGroup>
  </div>
</template>
