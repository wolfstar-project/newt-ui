import * as React from "react"

import { Demos } from "@/__registry__/demos"
import { ComponentSection } from "@/components/docs/component-section"
import { PageHeader } from "@/components/docs/page-header"
import { Preview } from "@/components/docs/preview"
import { CodeBlock } from "@/registry/default/ui/code-block"
import { categories } from "@/registry/registry-categories"
import { rootClasses } from "@/registry/registry-root-classes"
import { ui } from "@/registry/registry-ui"

const INSTALL_SNIPPET = `# install the CLI
npx @wolfstar/newt-ui@latest init

# add a component
npx @wolfstar/newt-ui@latest add status-indicator embed slash-command

# list everything available
npx @wolfstar/newt-ui@latest list`

const CDN_SNIPPET = `<!-- design tokens + a single component, straight from jsDelivr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@wolfstar/newt-ui@latest/registry/html/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@wolfstar/newt-ui@latest/registry/html/components/button.css">

<!-- pin to a git tag for stability -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wolfstar-project/newt-ui@v0.2.0/packages/newt-ui/registry/html/tokens.css">`

const TOKENS_SNIPPET = `:root {
  --newt-bg-base: #1e1f22;      /* app background, deepest layer */
  --newt-bg-surface: #2b2d31;   /* sidebars, channel lists */
  --newt-bg-elevated: #313338;  /* cards, main content, modals */
  --newt-border: #3f4147;
  --newt-text-primary: #f2f3f5;
  --newt-text-secondary: #b5bac1;
  --newt-text-muted: #949ba4;
  --newt-brand: #5865f2;
  --newt-online: #23a55a;
  --newt-idle: #f0b232;
  --newt-dnd: #f23f42;
  --newt-offline: #80848e;
}

/* In React, every token is a Tailwind utility: */
<div className="bg-newt-bg-elevated text-newt-text-primary rounded-md" />`

export default function Home() {
  let index = 3

  return (
    <>
      <PageHeader />

      <div className="content">
        <ComponentSection
          id="installation"
          index={1}
          title="Installation"
          description="Install the CLI and add components directly into your project — same pattern as shadcn. No runtime dependency; components are copied into your codebase so you fully own them."
        >
          <Preview column code={INSTALL_SNIPPET}>
            <CodeBlock className="w-full">{INSTALL_SNIPPET}</CodeBlock>
          </Preview>
        </ComponentSection>

        <ComponentSection
          id="cdn"
          index={2}
          title="CDN"
          rootClass="jsDelivr"
          description="For static sites or quick prototypes, skip the CLI entirely and load the design tokens plus component styles straight from jsDelivr."
        >
          <Preview column code={CDN_SNIPPET}>
            <CodeBlock className="w-full">{CDN_SNIPPET}</CodeBlock>
          </Preview>
        </ComponentSection>

        <ComponentSection
          id="tokens"
          index={3}
          title="Design tokens"
          rootClass="--newt-*"
          description="Every component is built on CSS variables matching Discord's actual surface and accent colors. Never hardcode a hex value — reference a --newt-* token."
        >
          <Preview column code={TOKENS_SNIPPET}>
            <CodeBlock className="w-full">{TOKENS_SNIPPET}</CodeBlock>
          </Preview>
        </ComponentSection>

        {categories.map((category) => (
          <React.Fragment key={category.slug}>
            <div className="category-heading">{category.label}</div>
            {category.components.map((name) => {
              const item = ui.find((entry) => entry.name === name)
              const Demo = Demos[name]
              index += 1
              return (
                <ComponentSection
                  key={name}
                  id={name}
                  index={index}
                  title={item?.title ?? name}
                  rootClass={rootClasses[name]}
                  description={item?.description}
                >
                  <Preview>{Demo ? <Demo /> : null}</Preview>
                </ComponentSection>
              )
            })}
          </React.Fragment>
        ))}

        <div className="category-heading">Ecosystem</div>
        <ComponentSection
          id="ecosystem"
          index={index + 1}
          title="Ecosystem"
          description="Part of the WolfStar toolchain for the Discord developer lifecycle."
        >
          <Preview>
            <div className="preview-grid">
              <div className="rounded-md border border-newt-border bg-newt-bg-elevated p-4">
                <div className="font-semibold">newt-dsl</div>
                <p className="mt-1 text-sm text-newt-text-secondary">
                  A human-readable language for building Discord bots.
                </p>
              </div>
              <div className="rounded-md border border-newt-border bg-newt-bg-elevated p-4">
                <div className="font-semibold">newt-trace</div>
                <p className="mt-1 text-sm text-newt-text-secondary">
                  Discord-native telemetry SDK — runtime events as structured
                  data.
                </p>
              </div>
            </div>
          </Preview>
        </ComponentSection>
      </div>
    </>
  )
}
