import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from "@/registry/default/ui/timeline"

export default function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-sm">
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
  )
}
