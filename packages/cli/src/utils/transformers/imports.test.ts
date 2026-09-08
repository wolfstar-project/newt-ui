import { describe, expect, it } from "vitest"

import {
  rawConfigSchema,
  resolveConfigPaths,
  type Framework,
} from "../get-config.js"
import { transformContent } from "./imports.js"

async function createConfig(framework: Framework) {
  return resolveConfigPaths(
    "/tmp/newtui-transformer-test",
    rawConfigSchema.parse({
      style: "default",
      framework,
      typescript: true,
      rsc: true,
      tailwind: {
        config: "tailwind.config.ts",
        css: "app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
        prefix: "",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
        composables: "@/composables",
      },
    })
  )
}

describe("registry import transforms", () => {
  it("rewrites the React base registry to the configured UI alias", async () => {
    const config = await createConfig("react")

    expect(
      transformContent(
        'import { Button } from "@/registry/bases/newt/ui/button"',
        config
      )
    ).toBe('import { Button } from "@/components/ui/button"')
  })

  it("rewrites the root-level Vue base registry to the configured UI alias", async () => {
    const config = await createConfig("vue")

    expect(
      transformContent(
        'import { Button } from "~~/registry/bases/newt/ui/button"',
        config
      )
    ).toBe('import { Button } from "@/components/ui/button"')
  })

  it("keeps imports from registries published before the layout move compatible", async () => {
    const config = await createConfig("vue")

    expect(
      transformContent(
        'import { Button } from "@/lib/registry/default/ui/button"',
        config
      )
    ).toBe('import { Button } from "@/components/ui/button"')
  })
})
