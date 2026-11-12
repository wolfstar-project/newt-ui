<script setup lang="ts">
import { Radio, RadioGroup } from "~~/registry/bases/newt/ui/radio"

/* The arrow keys step over the disabled row rather than stopping on it. */
</script>

<template>
  <RadioGroup
    class="w-full max-w-sm"
    label="Stream quality"
    default-value="720"
  >
    <Radio value="720" description="Smooth on most connections.">720p</Radio>
    <Radio
      value="1080"
      description="Needs a boosted server to turn on."
      disabled
    >
      1080p
    </Radio>
    <Radio value="source" description="Whatever your screen sends.">
      Source
    </Radio>
  </RadioGroup>
</template>
