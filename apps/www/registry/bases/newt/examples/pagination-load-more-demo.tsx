"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import { LoadMore } from "@/registry/bases/newt/ui/pagination"

const ENTRIES = [
  "Ada changed the server name",
  "Lin created #announcements",
  "Ada gave Sol the Moderator role",
  "Sol deleted 4 messages in #lounge",
  "Lin updated the welcome screen",
  "Sol timed out a member for 10 minutes",
  "Ada created an invite that never expires",
  "Lin renamed #general to #lobby",
]
const STEP = 3

/*
 * `LoadMore` is a row, not a button: it holds the control while there is more
 * to fetch, and the closing line once the list has reached its end.
 */
export default function PaginationLoadMoreDemo() {
  const [shown, setShown] = React.useState(STEP)

  return (
    <div className="flex w-full max-w-sm flex-col">
      <ul className="flex flex-col gap-2 text-sm text-newt-text-secondary">
        {ENTRIES.slice(0, shown).map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
      <LoadMore>
        {shown < ENTRIES.length ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShown(shown + STEP)}
          >
            Load more
          </Button>
        ) : (
          "End of the audit log"
        )}
      </LoadMore>
    </div>
  )
}
