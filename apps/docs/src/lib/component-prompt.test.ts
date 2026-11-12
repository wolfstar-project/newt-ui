import { describe, expect, it } from "vitest"

import {
  buildComponentPrompt,
  registryClosure,
  rewriteRegistryImports,
} from "./component-prompt"

describe("rewriteRegistryImports", () => {
  it("points React registry imports at the default aliases", () => {
    const source = [
      'import { Avatar } from "@/registry/bases/newt/ui/avatar"',
      'import { Chat } from "@/registry/bases/newt/blocks/chat/chat"',
      'import { cn } from "@/lib/utils"',
    ].join("\n")
    expect(rewriteRegistryImports(source, "react")).toBe(
      [
        'import { Avatar } from "@/components/ui/avatar"',
        'import { Chat } from "@/components/chat/chat"',
        'import { cn } from "@/lib/utils"',
      ].join("\n")
    )
  })

  it("rewrites the Vue registry root, not the React one", () => {
    const source = 'import { Mention } from "~~/registry/bases/newt/ui/mention"'
    expect(rewriteRegistryImports(source, "vue")).toBe(
      'import { Mention } from "@/components/ui/mention"'
    )
    expect(rewriteRegistryImports(source, "react")).toBe(source)
  })
})

describe("registryClosure", () => {
  const graph = new Map<string, readonly string[]>([
    ["chat", ["message", "avatar"]],
    ["message", ["avatar", "timestamp"]],
    ["avatar", []],
    ["timestamp", []],
  ])
  const closure = (name: string) =>
    registryClosure(
      name,
      (item) => graph.get(item),
      (item) => (graph.has(item) ? item : undefined)
    )

  it("lists every level once, each item after what it imports", () => {
    expect(closure("chat")).toEqual(["avatar", "timestamp", "message"])
  })

  it("leaves the item itself out", () => {
    expect(closure("avatar")).toEqual([])
  })

  it("survives a cycle", () => {
    graph.set("avatar", ["chat"])
    expect(closure("chat")).toEqual(["avatar", "timestamp", "message"])
    graph.set("avatar", [])
  })
})

describe("buildComponentPrompt", () => {
  const prompt = buildComponentPrompt({
    framework: "react",
    item: {
      name: "action-row",
      title: "Action Row",
      description: "A row of buttons.",
      files: [
        {
          path: "components/ui/action-row.tsx",
          source:
            'import { Button } from "@/registry/bases/newt/ui/button"\n\nexport const doc = "```js```"\n',
        },
      ],
    },
    dependencies: [
      {
        name: "button",
        title: "Button",
        files: [{ path: "components/ui/button.tsx", source: "export {}\n" }],
      },
    ],
    packages: ["class-variance-authority"],
    siteUrl: "https://newtui.dev",
    siteName: "newt/ui",
    utilsAlias: "@/lib/utils",
  })

  it("says what to do without the CLI, and where the setup lives", () => {
    expect(prompt).toMatch(
      /^Add the newt\/ui Action Row component to this React project by hand, without the newtui CLI\./
    )
    expect(prompt).toContain("https://newtui.dev/docs/installation/manual.md")
    expect(prompt).toContain("`class-variance-authority`")
  })

  it("puts dependencies before the component, with rewritten imports", () => {
    expect(prompt.indexOf('title="components/ui/button.tsx"')).toBeLessThan(
      prompt.indexOf('title="components/ui/action-row.tsx"')
    )
    expect(prompt).toContain('from "@/components/ui/button"')
    expect(prompt).not.toContain("@/registry/bases")
  })

  it("fences a source that holds a fence with a longer one", () => {
    expect(prompt).toContain('````tsx title="components/ui/action-row.tsx"')
  })
})
