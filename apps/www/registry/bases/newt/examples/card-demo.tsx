import { Card, CardDescription, CardTitle } from "@/registry/bases/newt/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Card title</CardTitle>
      <CardDescription>Card description text.</CardDescription>
    </Card>
  )
}
