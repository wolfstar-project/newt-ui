"use client"

import * as React from "react"

import { Calendar } from "@/registry/bases/newt/ui/calendar"

/* `min` and `max` together: only the two weeks of sign-up can be chosen. */
export default function CalendarRangeDemo() {
  const [date, setDate] = React.useState("2026-11-12")

  return (
    <Calendar
      aria-label="Sign-up date"
      value={date}
      onValueChange={setDate}
      min="2026-11-09"
      max="2026-11-22"
    />
  )
}
