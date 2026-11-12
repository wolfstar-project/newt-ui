import { Tabs, TabsContent, TabsTrigger } from "@/registry/bases/newt/ui/tabs"

/*
 * `TabsContent` reads the active tab from `Tabs`, so the panels sit inside it.
 * `Tabs` is the tablist by default, which would put the panels inside the list
 * of tab controls: here it only shares state (`role="none"`, no pill of its
 * own) and the triggers get a tablist wrapper of their own.
 */
export default function TabsPanelsDemo() {
  return (
    <Tabs
      defaultValue="overview"
      role="none"
      className="block w-full max-w-sm bg-transparent p-0"
    >
      <div
        role="tablist"
        className="flex w-fit gap-1 rounded-md bg-newt-bg-base p-1"
      >
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="invites">Invites</TabsTrigger>
      </div>
      <TabsContent
        value="overview"
        className="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
      >
        Rename the server, change its icon and pick the channel new members land
        in.
      </TabsContent>
      <TabsContent
        value="roles"
        className="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
      >
        Three roles. Drag one above another to give it precedence.
      </TabsContent>
      <TabsContent
        value="invites"
        className="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
      >
        One active invite link, used 12 times, expiring in 6 days.
      </TabsContent>
    </Tabs>
  )
}
