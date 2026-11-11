"use client"

import * as React from "react"

import { Calendar } from "@/registry/bases/newt/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = React.useState("2026-11-14")

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        aria-label="Event date"
        value={date}
        onValueChange={setDate}
        min="2026-11-03"
      />
      <p className="m-0 text-xs text-newt-text-muted" aria-live="polite">
        Event on <span className="font-mono">{date}</span>
      </p>
    </div>
  )
}
