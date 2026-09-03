import { Suspense, useEffect, useState } from "react"

import { rootClasses } from "@/registry/registry-root-classes"

import {
  findComponent,
  pascalCase,
  reactDemo,
  type ComponentMeta,
} from "../content/components"
import { SITE } from "../content/site"
import { Breadcrumb } from "../site/Breadcrumb"
import { CodeBlock, FrameworkBlock } from "../site/CodeBlock"
import { Demo } from "../site/Demo"
import { DemoBoundary } from "../site/DemoBoundary"
import { InlineCode, Lede, List, P, PageTitle, Section } from "../site/Prose"
import { Link } from "../site/router"
import { useSettings } from "../site/settings"
import { reactSource, vueSource } from "../site/source"
import { Tabs } from "../site/Tabs"
import { VueIsland } from "../site/VueIsland"
import { vueDemo } from "../vue/demos"
import { NotFound } from "./NotFound"

/*
 * Both CLIs default `aliases.ui` to `@/components/ui` in `init`, and both
 * `resolveTargetPath` implementations write a `registry:ui` file under it: the
 * React one flattens to `<name>.tsx`, the Vue one keeps the item's directory,
 * so a Vue component arrives as `<name>/<Part>.vue` beside its `index.ts`
 * barrel. Every path this page prints is derived from that one fact.
 */
const UI_ALIAS = "@/components/ui"

const VUE_EXTENSION = ".vue"

/* past four names a single import line stops reading as a list */
const INLINE_IMPORT_LIMIT = 4

const LINK =
  "text-link underline underline-offset-4 transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

const EYEBROW =
  "font-data text-[11px] tracking-[0.13em] text-weft-faint uppercase"

interface MetaProps {
  readonly meta: ComponentMeta
}

function importLine(names: readonly string[], from: string): string {
  if (names.length > INLINE_IMPORT_LIMIT) {
    const listed = names.map((name) => `  ${name},`).join("\n")
    return `import {\n${listed}\n} from "${from}"`
  }
  return `import { ${names.join(", ")} } from "${from}"`
}

/*
 * One `.vue` file is one component and the barrel re-exports each of them
 * under its own file name, so the file list is the export list. `index.ts` is
 * the barrel itself and names nothing.
 */
function vueExports(meta: ComponentMeta): readonly string[] {
  const names = meta.vueFiles
    .filter((file) => file.endsWith(VUE_EXTENSION))
    .map((file) => file.slice(0, file.length - VUE_EXTENSION.length))
  return names.length > 0 ? names : [pascalCase(meta.name)]
}

function LiveDemo({ meta }: MetaProps) {
  const { framework } = useSettings()
  const caption = `${meta.title}, rendered from the registry source`

  if (framework === "vue") {
    /* the loader keeps its identity across renders, so the island stays put */
    const load = vueDemo(meta.vueDemo)
    if (load === undefined) return null
    return (
      <Demo caption={caption}>
        <VueIsland load={load} />
      </Demo>
    )
  }

  const ReactDemo = reactDemo(meta.reactDemo)
  if (ReactDemo === undefined) return null
  return (
    <Demo caption={caption}>
      <DemoBoundary key={meta.reactDemo}>
        <Suspense
          fallback={
            <span className="font-data text-[13px] text-weft-faint">
              Loading the demo
            </span>
          }
        >
          <ReactDemo />
        </Suspense>
      </DemoBoundary>
    </Demo>
  )
}

/*
 * The Code tab shows the demo file itself, fetched on first open rather than
 * bundled with the page: a reader who never opens it never pays for it.
 */
function DemoSource({ meta }: MetaProps) {
  const { framework } = useSettings()
  const [source, setSource] = useState<string | undefined>(undefined)

  useEffect(() => {
    setSource(undefined)
    const load =
      framework === "vue"
        ? vueSource(meta.vueDemo)
        : reactSource(meta.reactDemo)
    if (!load) return undefined
    let live = true
    void load.then((text) => {
      if (live) setSource(text)
    })
    return () => {
      live = false
    }
  }, [framework, meta.reactDemo, meta.vueDemo])

  if (source === undefined) {
    return (
      <p className="font-data text-[13px] text-weft-faint">
        Loading the source
      </p>
    )
  }

  return <CodeBlock code={source} lang={framework === "vue" ? "html" : "tsx"} />
}

/** The demo and the file that renders it, one tab each. */
function PreviewCode({ meta }: MetaProps) {
  return (
    <Tabs
      tabs={[
        {
          value: "preview",
          label: "Preview",
          content: <LiveDemo meta={meta} />,
        },
        { value: "code", label: "Code", content: <DemoSource meta={meta} /> },
      ]}
    />
  )
}

/*
 * The BEM class the plain HTML/CSS build puts on the outermost element. It is
 * the one name that survives every framework, so it is what a reader greps for
 * when they are styling around the component rather than editing it. The
 * lookup is keyed by an arbitrary slug, hence the widened annotation: a
 * component the map has not been updated for reads as absent, not as `""`.
 */
function RootClass({ meta }: MetaProps) {
  const rootClass: string | undefined = rootClasses[meta.name]
  if (rootClass === undefined) return null
  return (
    <p className={EYEBROW}>
      root class <InlineCode>.{rootClass}</InlineCode>
    </p>
  )
}

/*
 * A plain heading rather than `Section`: this now lives inside the Manual
 * tab of the Installation section, not at the top level of the page, so it
 * does not carry its own id or belong in the On This Page index.
 */
function Dependencies({ meta }: MetaProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-ui text-[15px] font-semibold text-weft">
        Dependencies
      </h3>
      {meta.dependencies.length > 0 && (
        <div className="flex flex-col gap-3">
          <P>
            Packages the source imports. The CLI installs any of them the
            project does not already have.
          </P>
          <List>
            {meta.dependencies.map((dependency) => (
              <li key={dependency}>
                <InlineCode>{dependency}</InlineCode>
              </li>
            ))}
          </List>
        </div>
      )}

      {meta.registryDependencies.length > 0 && (
        <div className="flex flex-col gap-3">
          <P>
            Other registry items written alongside this one, each with a page of
            its own.
          </P>
          <List>
            {meta.registryDependencies.map((dependency) => (
              <li key={dependency}>
                <Link href={`/docs/components/${dependency}`} className={LINK}>
                  {findComponent(dependency)?.title ?? dependency}
                </Link>
              </li>
            ))}
          </List>
        </div>
      )}
    </div>
  )
}

function Installation({ meta }: MetaProps) {
  const directory = `${UI_ALIAS}/${meta.name}`
  const install = `add ${meta.name}`
  const hasDependencies =
    meta.dependencies.length > 0 || meta.registryDependencies.length > 0

  return (
    <Section id="installation" title="Installation">
      <Tabs
        tabs={[
          {
            value: "cli",
            label: "CLI",
            content: (
              <FrameworkBlock
                shell
                lang="bash"
                react={`${SITE.reactCli} ${install}`}
                vue={`${SITE.vueCli} ${install}`}
              />
            ),
          },
          {
            value: "manual",
            label: "Manual",
            content: (
              <div className="flex flex-col gap-5">
                {hasDependencies && <Dependencies meta={meta} />}
                <div className="flex flex-col gap-3">
                  <P>
                    Copy the file below into your project, at the path your ui
                    alias names.
                  </P>
                  <FrameworkBlock
                    react={`${directory}.tsx`}
                    vue={meta.vueFiles
                      .map((file) => `${directory}/${file}`)
                      .join("\n")}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </Section>
  )
}

function Usage({ meta }: MetaProps) {
  const directory = `${UI_ALIAS}/${meta.name}`
  return (
    <Section id="usage" title="Usage">
      <FrameworkBlock
        lang="typescript"
        react={importLine([pascalCase(meta.name)], directory)}
        vue={importLine(vueExports(meta), directory)}
      />
    </Section>
  )
}

function Article({ meta }: MetaProps) {
  return (
    <article className="flex flex-col gap-14">
      <Breadcrumb
        trail={[
          { label: "Docs", href: "/docs/installation" },
          { label: "Components", href: "/docs/components/button" },
          { label: meta.title },
        ]}
      />

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <p className={EYEBROW}>{meta.category}</p>
          <RootClass meta={meta} />
        </div>
        <PageTitle>{meta.title}</PageTitle>
        <Lede>{meta.description}</Lede>
      </header>

      <Section id="preview" title="Preview">
        <PreviewCode meta={meta} />
      </Section>

      <Installation meta={meta} />

      <Usage meta={meta} />

      <Section id="tokens" title="Tokens">
        <P>
          Every colour, radius, shadow and duration in this component resolves
          through the <InlineCode>--newt-*</InlineCode> layer, so restyling it
          is a matter of overriding those variables rather than editing the
          classes in the file. The full list, and where to put the override, are
          on the{" "}
          <Link href="/docs/installation#tokens" className={LINK}>
            installation page
          </Link>
          .
        </P>
      </Section>
    </article>
  )
}

interface ComponentPageProps {
  readonly name: string
}

export function ComponentPage({ name }: ComponentPageProps) {
  const meta = findComponent(name)
  /* a slug the registry does not carry is an address that leads nowhere */
  if (meta === undefined) return <NotFound />
  return <Article meta={meta} />
}
