"use client"

import * as React from "react"

import { Calendar } from "@/registry/bases/newt/ui/calendar"

/*
 * `locale` names the month and the weekdays; the week's first day and the
 * two button labels are separate props, because a locale does not settle them.
 */
export default function CalendarLocaleDemo() {
  const [date, setDate] = React.useState("2026-11-14")

  return (
    <Calendar
      aria-label="Date de l'événement"
      lang="fr"
      value={date}
      onValueChange={setDate}
      locale="fr-FR"
      weekStartsOn={1}
      previousLabel="Mois précédent"
      nextLabel="Mois suivant"
    />
  )
}
