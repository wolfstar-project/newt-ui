import { Suspense, type ReactNode } from "react"

import { buttonVariants } from "@/registry/default/ui/button"

import {
  COMPONENTS,
  findComponent,
  reactDemo,
  type ComponentMeta,
} from "../content/components"
import { SITE } from "../content/site"
import { CodeBlock } from "../site/CodeBlock"
import { Demo } from "../site/Demo"
import { DemoBoundary } from "../site/DemoBoundary"
import { InlineCode, PageHead, Section } from "../site/Prose"
import { Link } from "../site/router"
import { useSettings } from "../site/settings"
import { Content } from "../site/Shell"
import { VueIsland } from "../site/VueIsland"
import { vueDemo } from "../vue/demos"

const LINK =
  "text-newt-text-link underline underline-offset-4 transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-newt-text-primary"

/*
 * The two calls to action are the library's own button, not a pair the site
 * drew for itself: the first thing a reader sees is a component from the
 * registry they are being offered.
 */
const CTA_PRIMARY = buttonVariants({ variant: "primary", size: "lg" })

const CTA_SECONDARY = buttonVariants({ variant: "secondary", size: "lg" })

/* the three that carry the most of the library between them */
const FEATURED = ["user-profile", "embed", "member-list"] as const

function pickFeatured(): readonly ComponentMeta[] {
  const found = FEATURED.flatMap((name) => {
    const meta = findComponent(name)
    return meta ? [meta] : []
  })
  return found.length === FEATURED.length ? found : COMPONENTS.slice(0, 3)
}

/* resolved once: a loader that changes identity would remount its island */
const SHOWCASE = pickFeatured()

interface LiveDemoProps {
  readonly meta: ComponentMeta
}

/*
 * The demo follows the framework switch rather than the page: React renders the
 * lazy example, Vue mounts the same example as an island. A component whose
 * example is missing on one side renders nothing on that side.
 */
function LiveDemo({ meta }: LiveDemoProps) {
  const { framework } = useSettings()

  if (framework === "vue") {
    const load = vueDemo(meta.vueDemo)
    return load ? <VueIsland load={load} /> : null
  }

  const Example = reactDemo(meta.reactDemo)
  if (!Example) return null

  return (
    <DemoBoundary key={meta.reactDemo}>
      <Suspense
        fallback={
          <p className="font-mono text-[13px] text-newt-text-muted">
            Loading the example…
          </p>
        }
      >
        <Example />
      </Suspense>
    </DemoBoundary>
  )
}

interface PitchProps {
  readonly title: string
  readonly children: ReactNode
}

function Pitch({ title, children }: PitchProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-newt-border pt-4">
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-newt-text-primary">
        {title}
      </h3>
      <p className="text-[13px] leading-[1.6] text-newt-text-secondary">
        {children}
      </p>
    </div>
  )
}

export function Home() {
  return (
    <>
      <PageHead
        eyebrow={[SITE.name, `v${SITE.version}`, SITE.channel]}
        overline="component spec —"
        title="Discord-styled UI, copy-pasted into your project."
        lead={
          <>
            A component library, a design token system and an agent guide for
            building Discord-styled interfaces — bots, dashboards and docs that
            look like they belong in the client. Every component ships as plain
            HTML and CSS, as a React file, and as a Vue single file component,
            all reading one set of tokens.
          </>
        }
        actions={
          <>
            <Link href="/docs/installation" className={CTA_PRIMARY}>
              Get started
            </Link>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className={CTA_SECONDARY}
            >
              View on GitHub
            </a>
          </>
        }
        manifest={[
          { key: "components", value: COMPONENTS.length, brand: true },
          { key: "runtime deps", value: "0" },
          { key: "license", value: SITE.license },
          { key: "install", value: "npx newtui" },
          { key: "tokens", value: "CSS vars" },
          { key: "frameworks", value: "React · Vue · HTML" },
        ]}
      />

      <Content>
        <Section
          id="install"
          title="Install"
          meta="npx newtui@latest"
          description="One CLI for both frameworks. It reads your project during init, then writes component source into it — there is no package between you and the markup."
        >
          <CodeBlock
            shell
            lang="bash"
            code={`${SITE.cli} init\n${SITE.cli} add button embed member-list`}
          />
        </Section>

        <Section
          id="showcase"
          title="Three of them, running"
          description="The same examples every component page carries, rendered from the registry source in the framework the sidebar has chosen."
        >
          <div className="flex flex-col gap-3">
            {SHOWCASE.map((meta) => (
              <Demo key={meta.name} caption={meta.title}>
                <LiveDemo meta={meta} />
              </Demo>
            ))}
          </div>
        </Section>

        <Section
          id="principles"
          title="What it is"
          description="Four decisions the whole registry is built on. They are why a component here is short enough to read before you paste it."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Pitch title="One token system, three targets">
              The tokens are declared once and every surface reads them: the
              plain HTML and CSS build, the React wrappers, and the Vue single
              file components. Change a token and all three move together.
            </Pitch>
            <Pitch title="You own the code">
              The CLI writes component source into your project and stops there.
              A component you need to bend is a file you already have, under{" "}
              {SITE.license}.
            </Pitch>
            <Pitch title="No motion by default">
              Hover, focus, online, do-not-disturb and loading are carried by
              colour, border and shape — the status dot states its mode by its
              outline, not by a pulse.
            </Pitch>
            <Pitch title="Accessible by construction">
              Body text meets WCAG AA contrast, every control is reachable by{" "}
              <InlineCode>Tab</InlineCode> with a visible focus ring, and
              presence is announced rather than left to colour alone.
            </Pitch>
          </div>
        </Section>

        <Section
          id="next"
          title="Where to go next"
          description="The installation guide covers both CLIs and the Nuxt module; every component page carries a live example, the files it writes and the dependencies it needs."
        >
          <p className="max-w-2xl text-prose text-newt-text-secondary">
            <span>Start with the </span>
            <Link href="/docs/installation" className={LINK}>
              installation guide
            </Link>
            <span>, browse the </span>
            <Link href="/docs/components/button" className={LINK}>
              components
            </Link>
            <span>, or read how to drive the registry from an agent in </span>
            <Link href="/docs/using-with-ai" className={LINK}>
              Using with AI
            </Link>
            <span>. Issues and the registry source are on </span>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className={LINK}
            >
              GitHub
            </a>
            <span>
              . {SITE.name} is not affiliated with or endorsed by Discord.
            </span>
          </p>
        </Section>
      </Content>
    </>
  )
}
