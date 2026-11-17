import { describe, expect, it } from "vitest"

import { commandVariants } from "./commands"

describe("commandVariants", () => {
  it("runs a package once with each package manager, npm first", () => {
    const variants = commandVariants({ _tag: "run", cmd: "newtui@latest init" })

    expect(variants.map((v) => v.text)).toEqual([
      "npx newtui@latest init",
      "pnpm dlx newtui@latest init",
      "yarn dlx newtui@latest init",
      "bunx newtui@latest init",
      "deno run -A npm:newtui@latest init",
      "vlx newtui@latest init",
      "vp dlx newtui@latest init",
      "nubx newtui@latest init",
      "nlx newtui@latest init",
      "upx newtui@latest init",
    ])
  })

  it("installs packages with each package manager's add command", () => {
    const variants = commandVariants({
      _tag: "install",
      packages: "zod @hookform/resolvers",
    })

    expect(variants.map((v) => v.text)).toEqual([
      "npm install zod @hookform/resolvers",
      "pnpm add zod @hookform/resolvers",
      "yarn add zod @hookform/resolvers",
      "bun add zod @hookform/resolvers",
      "deno add npm:zod npm:@hookform/resolvers",
      "vlt install zod @hookform/resolvers",
      "vp add zod @hookform/resolvers",
      "nub add zod @hookform/resolvers",
      "ni zod @hookform/resolvers",
      "upm add zod @hookform/resolvers",
    ])
  })

  it("offers the shadcn CLIs for an add of registry items", () => {
    const variants = commandVariants({
      _tag: "run",
      cmd: "newtui@latest add form-fields button",
    })

    expect(variants.filter((v) => v.pm === "npm")).toEqual([
      {
        pm: "npm",
        cli: "newtui",
        framework: "any",
        text: "npx newtui@latest add form-fields button",
      },
      {
        pm: "npm",
        cli: "shadcn",
        framework: "react",
        text: "npx shadcn@latest add @newtui/form-fields @newtui/button",
      },
      {
        pm: "npm",
        cli: "shadcn",
        framework: "vue",
        text: "npx shadcn-vue@latest add @newtui/form-fields @newtui/button",
      },
    ])
    expect(
      variants.find((v) => v.pm === "deno" && v.framework === "vue")?.text
    ).toBe(
      "deno run -A npm:shadcn-vue@latest add @newtui/form-fields @newtui/button"
    )
  })

  it("offers only shadcn-vue for an item the React registry lacks", () => {
    const variants = commandVariants({
      _tag: "run",
      cmd: "newtui@latest add nuxt-ui-theme",
      only: "vue",
    })

    expect(
      variants.filter((v) => v.pm === "npm" && v.cli === "shadcn")
    ).toEqual([
      {
        pm: "npm",
        cli: "shadcn",
        framework: "any",
        text: "npx shadcn-vue@latest add @newtui/nuxt-ui-theme",
      },
    ])
  })

  it("offers no shadcn command when the add takes a flag or another registry", () => {
    for (const cmd of [
      "newtui@latest add button --overwrite",
      "newtui@latest add @magicui/marquee",
      "newtui@latest init",
    ]) {
      const clis = commandVariants({ _tag: "run", cmd }).map((v) => v.cli)
      expect(clis).not.toContain("shadcn")
    }
  })
})
