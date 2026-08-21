import { Tabs, TabsTrigger } from "@/registry/default/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="one">
      <TabsTrigger value="one">Tab one</TabsTrigger>
      <TabsTrigger value="two">Tab two</TabsTrigger>
      <TabsTrigger value="three">Tab three</TabsTrigger>
    </Tabs>
  )
}
