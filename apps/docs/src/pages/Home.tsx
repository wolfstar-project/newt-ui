import { Suspense, type ReactNode } from "react"

import { buttonVariants } from "@/registry/default/ui/button"

import {
  COMPONENTS,
  findComponent,
  reactDemo,
  type ComponentMeta,
} from "../content/components"
import { SITE } from "../content/site"
import { FrameworkBlock } from "../site/CodeBlock"
import { Demo } from "../site/Demo"
import { DemoBoundary } from "../site/DemoBoundary"
import { InlineCode } from "../site/Prose"
import { Link } from "../site/router"
import { useSettings } from "../site/settings"
import { VueIsland } from "../site/VueIsland"
import { vueDemo } from "../vue/demos"

const LINK =
  "text-link underline underline-offset-4 transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

/*
 * The two calls to action are the library's own button, not a pair the site
 * drew for itself: the first thing a reader sees is a component from the
 * registry they are being offered.
 */
const CTA_PRIMARY = buttonVariants({ variant: "primary" })

const CTA_SECONDARY = buttonVariants({ variant: "secondary" })

/*
 * The two marks are the only colours on the site the palette does not own: a
 * framework is recognised by its own hue before it is read as a word.
 */
function ReactMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-[var(--brand-react)]"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10.5" ry="4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(120 12 12)"
        />
      </g>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  )
}

function VueMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-[var(--brand-vue)]"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      >
        <path d="M1.5 4.5 12 21 22.5 4.5" />
        <path d="M8 4.5 12 10.5 16 4.5" />
      </g>
    </svg>
  )
}

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
          <p className="font-data text-[13px] text-weft-faint">
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
    <div className="flex flex-col gap-2 border-t border-reed pt-5">
      <h3 className="font-ui text-[17px] font-semibold tracking-[-0.02em] text-weft">
        {title}
      </h3>
      <p className="text-prose text-weft-dim">{children}</p>
    </div>
  )
}

export function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="warp-field pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto flex max-w-320 flex-col gap-8 px-4 pt-20 pb-14 sm:px-6">
          <p className="flex items-center gap-2.5 font-data text-[11px] tracking-[0.18em] text-weft-faint uppercase">
            <span className="flex items-center gap-2">
              <ReactMark />
              <VueMark />
            </span>
            <span>A React and Vue component registry</span>
          </p>
          <h1 className="max-w-4xl font-ui text-[clamp(34px,6vw,60px)] leading-[1.04] font-bold tracking-[-0.04em] text-weft">
            Discord-inspired components you paste into your own project.
          </h1>
          <p className="max-w-2xl text-prose text-weft-dim">
            Every component here is plain HTML and CSS driven by one set of{" "}
            <InlineCode>--newt-*</InlineCode> custom properties, with React and
            Vue wrappers over the same markup. The CLI copies the source into
            your repository instead of adding a package to your dependencies, so
            there is no runtime dependency to keep in step — the files are
            yours, and you edit them the way you edit anything else you wrote.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/docs/installation" className={CTA_PRIMARY}>
              Get started
            </Link>
            <Link href="/docs/components/button" className={CTA_SECONDARY}>
              Browse the components
            </Link>
          </div>
          <FrameworkBlock
            shell
            react={`${SITE.reactCli} init\n${SITE.reactCli} add button`}
            vue={`${SITE.vueCli} init\n${SITE.vueCli} add button`}
            className="max-w-sm"
          />
          <p className="text-weft-dim">
            <span>Version {SITE.version}, </span>
            <span>{SITE.channel}</span>
            <span>, {SITE.license}. The registry and both CLIs live on </span>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className={LINK}
            >
              GitHub
            </a>
            <span>.</span>
          </p>
        </div>
        <div className="reed-band h-0.5 w-full" />
      </section>

      <section className="mx-auto flex w-full max-w-320 flex-col gap-6 px-4 py-14 sm:px-6">
        <h2 className="font-data text-[11px] tracking-[0.18em] text-weft-faint uppercase">
          Three of them, running
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {SHOWCASE.map((meta, index) => (
            <Demo
              key={meta.name}
              caption={meta.title}
              className={index === 0 ? "lg:col-span-2" : undefined}
            >
              <LiveDemo meta={meta} />
            </Demo>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-320 gap-6 px-4 pb-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <Pitch title="One token system, three targets">
          The tokens are declared once and every surface reads them: the plain
          HTML and CSS build, the React wrappers, and the Vue single file
          components. Change a token and all three move together, because none
          of them holds a colour, radius or font of its own.
        </Pitch>
        <Pitch title="You own the code">
          The CLI writes component source into your project and stops there. No
          package sits between you and the markup, so a component you need to
          bend is a file you already have, under {SITE.license}.
        </Pitch>
        <Pitch title="No motion by default">
          There are no transitions, animations or keyframes in the components.
          Hover, focus, online, do-not-disturb and loading are all carried by
          colour, border and shape — the status dot states its mode by its
          outline, not by a pulse.
        </Pitch>
        <Pitch title="Accessible by construction">
          Body text meets WCAG AA contrast, every control is reachable by{" "}
          <InlineCode>Tab</InlineCode> with a visible focus ring, icon-only
          controls carry a label, and presence is announced rather than left to
          colour alone.
        </Pitch>
      </section>

      <section className="mx-auto w-full max-w-320 px-4 pb-14 sm:px-6">
        <p className="text-prose text-weft-dim">
          <span>The </span>
          <Link href="/docs/installation" className={LINK}>
            installation guide
          </Link>
          <span>
            {" "}
            covers both CLIs and the Nuxt module; every component page carries a
            live example, the files it writes and the dependencies it needs.
            Issues, the registry source and the full component list are on{" "}
          </span>
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
      </section>
    </div>
  )
}
