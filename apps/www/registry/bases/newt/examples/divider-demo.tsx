import { Divider } from "@/registry/bases/newt/ui/divider"

export default function DividerDemo() {
  return (
    <div className="w-full max-w-sm text-sm text-newt-text-secondary">
      <Divider>SECTION LABEL</Divider>
      <Divider spacing="sm" />
      <Divider spacing="lg" line={false}>
        SPACING ONLY
      </Divider>
      <p className="m-0">Above a small separator</p>
      <Divider spacing="small" />
      <p className="m-0">Between a small and a large separator</p>
      <Divider spacing="large" />
      <p className="m-0">Below a large separator</p>
    </div>
  )
}
