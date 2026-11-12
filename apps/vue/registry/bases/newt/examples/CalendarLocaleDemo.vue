<script setup lang="ts">
import { ref } from "vue"
import { Calendar } from "~~/registry/bases/newt/ui/calendar"

/*
 * `locale` names the month and the weekdays; the week's first day and the
 * two button labels are separate props, because a locale does not settle them.
 */
const date = ref("2026-11-14")
</script>

<template>
  <Calendar
    v-model="date"
    aria-label="Date de l'événement"
    lang="fr"
    locale="fr-FR"
    :week-starts-on="1"
    previous-label="Mois précédent"
    next-label="Mois suivant"
  />
</template>
