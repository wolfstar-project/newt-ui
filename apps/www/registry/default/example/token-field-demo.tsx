import { Label } from "@/registry/default/ui/form-fields"
import { TokenField } from "@/registry/default/ui/token-field"

export default function TokenFieldDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Label htmlFor="newt-token-example">Bot token</Label>
      <TokenField
        id="newt-token-example"
        value="MTA4NzY1NDMyMTA5ODc2NTQzMjE.GxYzAb.c0d3-s3cr3t-t0k3n"
      />
    </div>
  )
}
