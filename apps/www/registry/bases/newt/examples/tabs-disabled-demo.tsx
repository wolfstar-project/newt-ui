import { Tabs, TabsTrigger } from "@/registry/bases/newt/ui/tabs"

/*
 * A trigger is a native button, so `disabled` is all it takes to make a tab
 * unreachable; the two `disabled:` utilities are what make it look that way.
 */
export default function TabsDisabledDemo() {
  return (
    <Tabs defaultValue="messages">
      <TabsTrigger value="messages">Messages</TabsTrigger>
      <TabsTrigger value="threads">Threads</TabsTrigger>
      <TabsTrigger
        value="insights"
        disabled
        className="disabled:cursor-not-allowed disabled:opacity-40"
      >
        Insights
      </TabsTrigger>
    </Tabs>
  )
}
