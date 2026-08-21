<script setup lang="ts">
import {
  CooldownBar,
  CooldownBarLabel,
  CooldownBarTrack,
  CooldownBarValue,
} from "@/lib/registry/default/ui/cooldown-bar"
</script>

<template>
  <CooldownBar class="w-full">
    <CooldownBarLabel>
      <span>Command cooldown</span>
      <CooldownBarValue>3.2s</CooldownBarValue>
    </CooldownBarLabel>
    <CooldownBarTrack :value="40" aria-label="Command cooldown" />
  </CooldownBar>
</template>
