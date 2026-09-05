import { Divider } from "@/registry/default/ui/divider"

export default function DividerDemo() {
  return (
    <div className="w-full max-w-sm">
      <Divider>SECTION LABEL</Divider>
      <Divider spacing="sm" />
      <Divider spacing="lg" line={false}>
        SPACING ONLY
      </Divider>
    </div>
  )
}
