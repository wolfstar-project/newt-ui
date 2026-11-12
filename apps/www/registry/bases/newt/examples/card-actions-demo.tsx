import { Button } from "@/registry/bases/newt/ui/button"
import { Card, CardDescription, CardTitle } from "@/registry/bases/newt/ui/card"

/* The card has no footer part: a row of buttons is plain markup inside it. */
export default function CardActionsDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Turn on community updates</CardTitle>
      <CardDescription>
        Moderators get a weekly summary of new members and reported messages.
      </CardDescription>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="secondary">
          Not now
        </Button>
        <Button size="sm">Turn on</Button>
      </div>
    </Card>
  )
}
