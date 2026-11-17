import { Tabs, TabsList, TabsTrigger } from "@/registry/bases/newt/ui/tabs"

const TABS = ["Members", "Media", "Files", "Links", "Threads", "Pins"]

/*
 * Six tabs in a narrow panel. The list scrolls sideways instead of clipping,
 * and an arrow key scrolls the focused tab into view.
 */
export default function TabsOverflowDemo() {
  return (
    <div className="w-full max-w-[280px]">
      <Tabs defaultValue="members">
        <TabsList aria-label="Channel details">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
