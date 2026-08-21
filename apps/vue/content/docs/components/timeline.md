---
title: Event Timeline
description: A vertical event log with connected status dots, titles and metadata.
---

<ComponentPreview name="TimelineDemo" />

## Installation

```bash
npx newt-ui-vue@latest add timeline
```

## Usage

```vue
<script setup lang="ts">
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineMeta,
} from "@/components/ui/timeline"
</script>

<template>
  <Timeline>
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
```

## Examples

### Dot variants

```vue
<template>
  <TimelineDot>•</TimelineDot>
  <TimelineDot variant="success">✓</TimelineDot>
  <TimelineDot variant="danger">✕</TimelineDot>
  <TimelineDot variant="brand">↻</TimelineDot>
</template>
```
