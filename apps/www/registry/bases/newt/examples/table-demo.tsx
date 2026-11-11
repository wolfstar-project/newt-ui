"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/newt/ui/table"

const ACTIONS = [
  { member: "kai", action: "Warning", minutes: 0 },
  { member: "ada", action: "Timeout", minutes: 10 },
  { member: "mio", action: "Timeout", minutes: 60 },
]

type Column = "member" | "minutes"

export default function TableDemo() {
  const [column, setColumn] = React.useState<Column>("member")
  const [ascending, setAscending] = React.useState(true)

  const rows = ACTIONS.toSorted((a, b) => {
    const order =
      column === "member"
        ? a.member.localeCompare(b.member)
        : a.minutes - b.minutes
    return ascending ? order : -order
  })

  const sortOf = (target: Column) =>
    column !== target ? "none" : ascending ? "ascending" : "descending"
  const sortBy = (target: Column) => {
    setAscending(column === target ? !ascending : true)
    setColumn(target)
  }

  return (
    <Table wrapperClassName="max-w-md">
      <TableCaption>Recent moderation actions</TableCaption>
      <TableHeader>
        <tr>
          <TableHead sort={sortOf("member")} onSort={() => sortBy("member")}>
            Member
          </TableHead>
          <TableHead>Action</TableHead>
          <TableHead
            align="end"
            sort={sortOf("minutes")}
            onSort={() => sortBy("minutes")}
          >
            Minutes
          </TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.member}>
            <TableCell className="font-medium text-newt-text-primary">
              {row.member}
            </TableCell>
            <TableCell>{row.action}</TableCell>
            <TableCell align="end">{row.minutes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
