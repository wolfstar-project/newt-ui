import { Tabs, TabsList, TabsTrigger } from "@/registry/bases/newt/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">Tab one</TabsTrigger>
        <TabsTrigger value="two">Tab two</TabsTrigger>
        <TabsTrigger value="three">Tab three</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
