import { rootClasses } from "@/registry/registry-root-classes"

import { COMPONENTS } from "../content/components"
import { SITE } from "../content/site"
import { CodeBlock } from "../site/CodeBlock"
import { InlineCode, List, Note, P, PageHead, Section } from "../site/Prose"
import { Link } from "../site/router"
import { useSettings } from "../site/settings"
import { Content } from "../site/Shell"

const LINK =
  "text-newt-text-link underline underline-offset-4 transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-newt-text-primary"

/*
 * The rules an agent has to be told, written as the prompt itself rather than
 * as prose about a prompt: a reader copies this block into their system
 * message and it works as it stands.
 */
const HOUSE_RULES = `You are building a Discord-styled interface with newt/ui.

Rules:
- Use only the components already installed under @/components/ui.
  If one is missing, stop and say which \`npx newtui add <name>\` to run.
- Never hardcode a colour, radius, shadow or duration. Every value comes
  from a --newt-* custom property:
    surfaces  --newt-bg-base, --newt-bg-surface, --newt-bg-elevated,
              --newt-bg-floating, --newt-bg-input, --newt-bg-hover,
              --newt-bg-active, --newt-border
    text      --newt-text-primary, --newt-text-secondary,
              --newt-text-muted, --newt-text-link
    brand     --newt-brand, --newt-brand-hover, --newt-brand-active
    status    --newt-online, --newt-idle, --newt-dnd, --newt-offline,
              --newt-danger
    shape     --newt-radius-sm|md|lg|full
    motion    --newt-duration-fast|base, --newt-ease
- Do not add transitions, animations or keyframes. State is carried by
  colour, border and shape.
- Do not restyle a component by editing its file. Pass className, or
  override a token on a wrapper.
- Every icon-only control takes an aria-label. Presence is announced in
  text, not by colour alone.`

const CLI_PROMPT = `Before writing any UI, list what is available and install what you need:

  npx newtui@latest list --json      # every component, machine readable
  npx newtui@latest add embed member-list status-indicator

\`add\` pulls a component's registry dependencies with it, so asking for
\`chat\` also writes \`message-list\`, \`message-group\` and \`scrollbar\`.
Never invent a component name: if \`list\` does not print it, it does not
exist, and the closest real one should be used instead.`

const HTML_PROMPT = `Generate plain HTML using only .newt-* class names from newt/ui.

Root classes available:
  .newt-btn, .newt-embed, .newt-member, .newt-message, .newt-mention,
  .newt-modal, .newt-status, .newt-timeline, .newt-card, …

Rules:
- No inline styles, except to set a --newt-* custom property.
- No new CSS class names.
- Element modifiers use the BEM form the library already uses:
  .newt-btn--primary, .newt-status__dot--online.
- Load the stylesheets rather than restating the CSS:
  <link rel="stylesheet" href="…/registry/html/tokens.css">
  <link rel="stylesheet" href="…/registry/html/components/button.css">`

const REVIEW_PROMPT = `Review this diff against the newt/ui house rules and report only breaches:

1. A hex, rgb() or oklch() literal where a --newt-* token exists.
2. A transition, animation or keyframe added to a component.
3. A component file edited to restyle it rather than wrapped.
4. An icon-only control with no accessible name.
5. A status or presence conveyed by colour with no text equivalent.
6. An import from a component that is not in the registry.

For each, quote the line and name the token or component that should
have been used. Report nothing else.`

export function UsingWithAI() {
  const { framework } = useSettings()
  const react = framework === "react"

  const wiring = react
    ? `// The data your bot already has, mapped onto the component's props.
// The component holds no colour, so the mapping is the whole integration.
const PRESENCE = {
  healthy: "online",
  degraded: "idle",
  unreachable: "dnd",
  unknown: "offline",
} as const

export function ShardRow({ shard }: { shard: Shard }) {
  return (
    <MemberListItem>
      <StatusIndicator status={PRESENCE[shard.health]} />
      <MemberListName>Shard {shard.id}</MemberListName>
      <MemberListActivity>{shard.guilds} guilds</MemberListActivity>
    </MemberListItem>
  )
}`
    : `<script setup lang="ts">
// The data your bot already has, mapped onto the component's props.
// The component holds no colour, so the mapping is the whole integration.
const PRESENCE = {
  healthy: "online",
  degraded: "idle",
  unreachable: "dnd",
  unknown: "offline",
} as const

const props = defineProps<{ shard: Shard }>()
</script>

<template>
  <MemberListItem>
    <StatusIndicator :status="PRESENCE[props.shard.health]" />
    <MemberListName>Shard {{ props.shard.id }}</MemberListName>
    <MemberListActivity>{{ props.shard.guilds }} guilds</MemberListActivity>
  </MemberListItem>
</template>`

  return (
    <>
      <PageHead
        eyebrow={[SITE.name, `v${SITE.version}`, "using with ai"]}
        overline="implementation guide —"
        title="Driving the registry from an agent."
        lead="A copy-paste registry suits an agent well: the component source is already in the repository it is editing, and every value it may reach for is a named token. What follows is the prompting that keeps it inside those two facts."
      />

      <Content>
        <Section
          id="why"
          title="Why this works"
          description="The two properties of the registry an agent can rely on, and the one failure they rule out."
        >
          <P>
            An agent writing against a package it cannot see guesses at prop
            names and invents CSS. Neither is possible here. The component is a
            file in the repository, so the agent can read the props rather than
            recall them, and every colour, radius, shadow and duration resolves
            through a <InlineCode>--newt-*</InlineCode> custom property, so
            there is nothing to invent a value for.
          </P>
          <List>
            <li>
              The source is local. <InlineCode>{SITE.cli} add</InlineCode>{" "}
              writes it under your ui alias, and the agent reads it from there.
            </li>
            <li>
              The vocabulary is closed. {COMPONENTS.length} components and one
              token layer — anything outside them is a mistake worth catching in
              review.
            </li>
            <li>
              The same markup exists three times over, so a prompt written for
              React holds for Vue and for the plain HTML build with only the
              import line changed.
            </li>
          </List>
        </Section>

        <Section
          id="house-rules"
          title="The house rules"
          meta="system prompt"
          description="Paste this into the system message. It is the whole contract: what to use, what never to hardcode, and what not to touch."
        >
          <CodeBlock code={HOUSE_RULES} className="max-w-none" />
        </Section>

        <Section
          id="cli"
          title="Let the agent drive the CLI"
          meta="npx newtui list"
          description="The registry is discoverable from the terminal, which is the one place an agent can check itself rather than guess."
        >
          <CodeBlock code={CLI_PROMPT} className="max-w-none" />
          <Note>
            <InlineCode>list --json</InlineCode> is the cheapest grounding you
            can give a model: it is the registry, in full, in a form it can
            parse — and it is generated from the same metadata these pages read.
          </Note>
        </Section>

        <Section
          id="wiring"
          title="Wire real data to a component"
          description="The components carry no data model. An integration is a map from what your bot knows onto the props a component takes."
        >
          <CodeBlock
            code={wiring}
            lang={react ? "tsx" : "html"}
            accent={framework}
            className="max-w-none"
          />
          <P>
            Presence is the clearest case: four health values, four statuses,
            and the component decides what green means. An agent asked to “show
            the shard as offline” has one correct edit to make, and no colour to
            choose.
          </P>
        </Section>

        <Section
          id="html"
          title="Generating plain HTML"
          meta={`.${rootClasses["button"] ?? "newt-btn"} · BEM`}
          description="When the target has no bundler, the same rules hold against the class names instead of the components."
        >
          <CodeBlock code={HTML_PROMPT} className="max-w-none" />
          <P>
            Every component page prints its root class beside the title, and the{" "}
            <Link href="/docs/installation#html" className={LINK}>
              installation guide
            </Link>{" "}
            lists the stylesheets to load. Those two together are enough context
            for a model to write correct markup without seeing the CSS.
          </P>
        </Section>

        <Section
          id="review"
          title="Review what it wrote"
          description="A short checklist, phrased as a prompt, that catches the five things a model gets wrong here."
        >
          <CodeBlock code={REVIEW_PROMPT} className="max-w-none" />
        </Section>

        <Section
          id="limits"
          title="What not to ask for"
          description="Three requests that produce plausible code and a component that no longer belongs to the system."
        >
          <List>
            <li>
              <strong className="text-newt-text-primary">
                A new component in the library's style.
              </strong>{" "}
              A model will produce one that looks right and shares none of the
              structure. Compose the existing parts, or open an issue.
            </li>
            <li>
              <strong className="text-newt-text-primary">A theme.</strong>{" "}
              Overriding twenty tokens by hand yields a palette with no
              relationships in it. Start from the{" "}
              <InlineCode>.newt-light</InlineCode> block and change what you
              actually need.
            </li>
            <li>
              <strong className="text-newt-text-primary">
                Discord's own assets.
              </strong>{" "}
              No logo, wordmark or icon from the client ships here, and none
              should be generated. Every glyph in the registry is drawn for it.
            </li>
          </List>
        </Section>
      </Content>
    </>
  )
}
