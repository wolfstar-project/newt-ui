<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableSort,
} from "~~/registry/bases/newt/ui/table"

const ACTIONS = [
  { member: "kai", action: "Warning", minutes: 0 },
  { member: "ada", action: "Timeout", minutes: 10 },
  { member: "mio", action: "Timeout", minutes: 60 },
]

type Column = "member" | "minutes"

const column = ref<Column>("member")
const ascending = ref(true)

const rows = computed(() =>
  ACTIONS.toSorted((a, b) => {
    const order =
      column.value === "member"
        ? a.member.localeCompare(b.member)
        : a.minutes - b.minutes
    return ascending.value ? order : -order
  })
)

function sortOf(target: Column): TableSort {
  if (column.value !== target) return "none"
  return ascending.value ? "ascending" : "descending"
}

function sortBy(target: Column) {
  ascending.value = column.value === target ? !ascending.value : true
  column.value = target
}
</script>

<template>
  <Table wrapper-class="max-w-md">
    <TableCaption>Recent moderation actions</TableCaption>
    <TableHeader>
      <tr>
        <TableHead :sort="sortOf('member')" @sort="sortBy('member')">
          Member
        </TableHead>
        <TableHead>Action</TableHead>
        <TableHead
          align="end"
          :sort="sortOf('minutes')"
          @sort="sortBy('minutes')"
        >
          Minutes
        </TableHead>
      </tr>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in rows" :key="row.member">
        <TableCell class="font-medium text-newt-text-primary">
          {{ row.member }}
        </TableCell>
        <TableCell>{{ row.action }}</TableCell>
        <TableCell align="end">{{ row.minutes }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
