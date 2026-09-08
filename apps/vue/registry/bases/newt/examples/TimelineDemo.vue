<script setup lang="ts">
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from "~~/registry/bases/newt/ui/timeline"
</script>

<template>
  <Timeline class="w-full max-w-sm">
    <TimelineItem>
      <TimelineDot variant="brand">↻</TimelineDot>
      <TimelineContent>
        <TimelineTitle>Event title</TimelineTitle>
        <TimelineMeta>Detail · timestamp</TimelineMeta>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineDot variant="success">✓</TimelineDot>
      <TimelineContent>
        <TimelineTitle>Event title</TimelineTitle>
        <TimelineMeta>Detail · timestamp</TimelineMeta>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
</template>
