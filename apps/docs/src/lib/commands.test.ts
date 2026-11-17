import { describe, expect, it } from "vitest"

import { commandVariants } from "./commands"

describe("commandVariants", () => {
  it("prefixes a run command with each package manager's runner", () => {
    const variants = commandVariants({ _tag: "run", cmd: "newtui@latest init" })

    expect(variants.map((v) => v.text)).toEqual([
      "pnpm dlx newtui@latest init",
      "npx newtui@latest init",
      "yarn dlx newtui@latest init",
      "bunx newtui@latest init",
    ])
  })

  it("installs packages with each package manager's add command", () => {
    const variants = commandVariants({ _tag: "install", packages: "zod" })

    expect(variants.map((v) => v.text)).toEqual([
      "pnpm add zod",
      "npm install zod",
      "yarn add zod",
      "bun add zod",
    ])
  })

  it("offers the shadcn CLIs for an add of registry items", () => {
    const variants = commandVariants({
      _tag: "run",
      cmd: "newtui@latest add form-fields button",
    })
    const npm = variants.filter((v) => v.pm === "npm")

    expect(npm).toEqual([
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
