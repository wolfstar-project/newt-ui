<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  CheckboxGroup,
  CheckboxOption,
} from "~~/registry/bases/newt/ui/checkbox-group"

const PERMISSIONS = [
  { value: "read", label: "Read messages" },
  { value: "send", label: "Send messages" },
  { value: "attach", label: "Attach files" },
  { value: "pin", label: "Pin messages" },
]

/*
 * With the value held outside, anything else on the page can write it: the
 * two buttons replace the whole selection in one step.
 */
const granted = ref<readonly string[]>(["read", "send"])
</script>

<template>
  <div class="flex w-full max-w-[360px] flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-newt-text-muted" aria-live="polite">
        {{ granted.length }} of {{ PERMISSIONS.length }} granted
      </span>
      <div class="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          @click="granted = PERMISSIONS.map((each) => each.value)"
        >
          Grant all
        </Button>
        <Button
          variant="secondary"
          size="sm"
          :disabled="granted.length === 0"
          @click="granted = []"
        >
          Clear
        </Button>
      </div>
    </div>
    <CheckboxGroup v-model="granted" label="Channel permissions">
      <CheckboxOption
        v-for="permission in PERMISSIONS"
        :key="permission.value"
        :value="permission.value"
      >
        {{ permission.label }}
      </CheckboxOption>
    </CheckboxGroup>
  </div>
</template>
