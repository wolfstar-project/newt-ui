import { SITE } from "../content/site"
import { CodeBlock, FrameworkBlock, FrameworkText } from "../site/CodeBlock"
import {
  InlineCode,
  Lede,
  List,
  Note,
  P,
  PageTitle,
  Section,
} from "../site/Prose"
import { Link } from "../site/router"
import { useSettings } from "../site/settings"

const LINK =
  "text-link underline underline-offset-4 transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

const INIT_REACT = `${SITE.reactCli} init`
const INIT_VUE = `${SITE.vueCli} init`

const ADD_REACT = `${SITE.reactCli} add button
${SITE.reactCli} add modal badge`

const ADD_VUE = `${SITE.vueCli} add button
${SITE.vueCli} add modal badge`

const REACT_FILES = `components.json                 init — the config file
app/globals.css                 init — the --newt-* token block
lib/utils.ts                    init — cn(), from the cn package

components/ui/button.tsx        add button
components/ui/modal.tsx         add modal badge
components/ui/badge.tsx`

const VUE_FILES = `components.json                     init — the config file
src/assets/css/tailwind.css         init — the --newt-* token block
lib/utils.ts                        init — cn(), from the cn package

components/ui/button/Button.vue     add button
components/ui/button/index.ts

components/ui/modal/Modal.vue       add modal badge
components/ui/modal/ModalHeader.vue
components/ui/modal/ModalBody.vue
components/ui/modal/ModalFooter.vue
components/ui/modal/ModalClose.vue
components/ui/modal/index.ts
components/ui/badge/Badge.vue
components/ui/badge/index.ts`

const TOKENS_REACT = `// app/layout.tsx — the stylesheet init wrote the tokens into
import "./globals.css"`

const TOKENS_VUE = `// nuxt.config.ts
export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
})

// on Vite, from your entry instead — src/main.ts
import "./assets/index.css"`

const NUXT_CONFIG = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["${SITE.nuxtModule}"],
  newt: {
    prefix: "",              // "Newt" gives you <NewtButton />
    componentDir: "components",
    css: true,               // false if you already ship the tokens
  },
})`

const NEXT_LAYOUT = `// app/layout.tsx
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="newt-root">{children}</body>
    </html>
  )
}`

const HTML_CLI = `${SITE.reactCli} --legacy init
${SITE.reactCli} --legacy add button`

const HTML_MARKUP = `<!-- tokens first: every component reads var(--newt-*) -->
<link rel="stylesheet" href="styles/newt-tokens.css" />
<link rel="stylesheet" href="components/ui/button.css" />

<body class="newt-root">
  <button class="newt-btn newt-btn--primary">Primary</button>
  <button class="newt-btn newt-btn--secondary">Secondary</button>
</body>`

const FLAGS_REACT = `-c, --cwd <dir>        working directory
-r, --registry <url>   registry base url (or NEWT_REGISTRY_URL)
-y, --yes              skip confirmation prompts
-d, --defaults         use the default configuration (init)
    --css <path>       path to your global css file (init)
    --skip-install     skip installing dependencies (init, add)
-o, --overwrite        overwrite existing files (add)
-a, --all              add every available component (add)
-p, --path <path>      the path to add the component to (add)
-t, --type <type>      filter by registry item type (list)
    --json             output as JSON (list)
    --legacy           use the HTML/CSS CLI (same as newt-ui-html)
-h, --help             display the help
-v, --version          display the version number`

const FLAGS_VUE = `-c, --cwd <dir>        working directory
-r, --registry <url>   registry base url (or NEWT_REGISTRY_URL)
-y, --yes              skip confirmation prompts
-d, --defaults         use the default configuration (init)
-f, --framework <name> nuxt or vite (init)
    --css <path>       path to your global css file (init)
    --skip-install     skip installing dependencies (init, add)
-o, --overwrite        overwrite existing files (add)
-a, --all              add every available component (add)
-p, --path <path>      the path to add the component to (add)
-t, --type <type>      filter by registry item type (list)
    --json             output as JSON (list)
-h, --help             display the help
-v, --version          display the version number`

export function Installation() {
  const { framework } = useSettings()
  const vue = framework === "vue"

  return (
    <article className="flex flex-col gap-14">
      <header className="flex flex-col gap-5">
        <PageTitle>Installation</PageTitle>
        <Lede>
          Two commands. The first reads your project and writes the tokens, the
          second writes a component and everything it imports.
        </Lede>
      </header>

      <Section id="requirements" title="What you need first">
        <List>
          <li>
            Node 18 or newer, which is what both CLIs declare. The Nuxt module
            asks for Node 20, and this repository itself is built on Node 22.
          </li>
          <li>
            {vue
              ? "Vue 3.5 and a Vite or Nuxt project."
              : "React 19 and a Next or Vite project."}{" "}
            The components are copied into your source tree, so there is no
            runtime package to depend on afterwards.
          </li>
          <li>
            <FrameworkText
              react={
                <span>
                  A Tailwind project. The React registry is developed against
                  Tailwind v3, where <InlineCode>init</InlineCode> prints a
                  preset to paste into your{" "}
                  <InlineCode>tailwind.config.ts</InlineCode>. It detects the
                  major of whatever project it runs in, and on v4 it writes an{" "}
                  <InlineCode>@theme</InlineCode> block instead and asks you for
                  nothing.
                </span>
              }
              vue={
                <span>
                  A Tailwind project. The Vue registry is developed against
                  Tailwind v4, where the theme is read straight out of the{" "}
                  <InlineCode>@theme</InlineCode> block{" "}
                  <InlineCode>init</InlineCode> writes. It detects the major of
                  whatever project it runs in, and on v3 it prints a preset for
                  your <InlineCode>tailwind.config.ts</InlineCode> instead.
                </span>
              }
            />
          </li>
          <li>
            The npm packages <InlineCode>init</InlineCode> installs for you:{" "}
            <InlineCode>class-variance-authority</InlineCode>,{" "}
            <InlineCode>tailwindcss-animate</InlineCode>, and the class merger
            that matches your Tailwind major — <InlineCode>cn</InlineCode> on
            v4, <InlineCode>clsx</InlineCode> with{" "}
            <InlineCode>tailwind-merge</InlineCode> on v3.
          </li>
        </List>
        <Note>
          None of this applies to the plain HTML and CSS flavour. That one is
          two stylesheets and a class name, with no build step, no framework and
          no package manager — it is the last section on this page.
        </Note>
      </Section>

      <Section id="init" title="Run init once">
        <FrameworkBlock shell lang="bash" react={INIT_REACT} vue={INIT_VUE} />
        <P>
          It asks a handful of questions and then writes three things.{" "}
          <InlineCode>components.json</InlineCode> at the root of your project,
          which is the same file shadcn reads, so a project using both CLIs
          keeps one config and not two. A <InlineCode>cn</InlineCode> helper at
          the path your utils alias names — a re-export of the{" "}
          <InlineCode>cn</InlineCode> package on Tailwind v4, and{" "}
          <InlineCode>clsx</InlineCode> passed through{" "}
          <InlineCode>tailwind-merge</InlineCode> on v3, whose tables still
          understand v3 class names. And the <InlineCode>--newt-*</InlineCode>{" "}
          token block, appended to the global stylesheet it found.
        </P>
        <P>
          <FrameworkText
            react={
              <span>
                The config records your aliases, the stylesheet and the config
                path it detected, and two switches: <InlineCode>tsx</InlineCode>
                , and <InlineCode>rsc</InlineCode> for React Server Components.
                Both change what <InlineCode>add</InlineCode> writes later. The
                default aliases are <InlineCode>@/components</InlineCode>,{" "}
                <InlineCode>@/components/ui</InlineCode>,{" "}
                <InlineCode>@/lib</InlineCode>,{" "}
                <InlineCode>@/lib/utils</InlineCode> and{" "}
                <InlineCode>@/hooks</InlineCode>.
              </span>
            }
            vue={
              <span>
                The config records your aliases, the stylesheet and the config
                path it detected, whether you are on TypeScript, and whether the
                project is Nuxt or Vite — it guesses that from a{" "}
                <InlineCode>nuxt.config</InlineCode> or a{" "}
                <InlineCode>vite.config</InlineCode>, and{" "}
                <InlineCode>--framework</InlineCode> overrides it. The default
                aliases are <InlineCode>@/components</InlineCode>,{" "}
                <InlineCode>@/components/ui</InlineCode>,{" "}
                <InlineCode>@/lib</InlineCode>,{" "}
                <InlineCode>@/lib/utils</InlineCode> and{" "}
                <InlineCode>@/composables</InlineCode>.
              </span>
            }
          />
        </P>
        <P>
          It does not edit your aliases. It reads them out of{" "}
          <InlineCode>tsconfig.json</InlineCode> or{" "}
          <InlineCode>jsconfig.json</InlineCode> and resolves them to real
          directories, falling back to <InlineCode>src</InlineCode> when that
          directory exists. A project whose alias is already declared needs
          nothing here.
        </P>
        <Note>
          The token values come from the registry theme item, so they are
          defined once and not restated by the CLI. If the registry cannot be
          reached, the copy of the tokens bundled with the CLI is written
          instead, and it tells you what that costs you. Running{" "}
          <InlineCode>init</InlineCode> twice does not write them twice: it
          looks for the tokens already in your stylesheet and skips.
        </Note>
      </Section>

      <Section id="add" title="Then add what you need">
        <FrameworkBlock shell lang="bash" react={ADD_REACT} vue={ADD_VUE} />
        <P>
          Registry dependencies are resolved before anything is written, so you
          name what you want and get what it is built out of. The modal above
          names the button, which means <InlineCode>add modal</InlineCode> on
          its own writes both. The npm packages the components import are
          collected across the whole tree and installed in one pass; pass{" "}
          <InlineCode>--skip-install</InlineCode> and the files still land and
          your package manager is left alone.
        </P>
        <P>
          A file already on disk is kept, not replaced: you are asked, and with{" "}
          <InlineCode>--yes</InlineCode> it is skipped and reported.{" "}
          <InlineCode>--overwrite</InlineCode> is how you take the registry
          version back. Run <InlineCode>add</InlineCode> with no names and it
          lists the registry and lets you pick.
        </P>
      </Section>

      <Section id="written" title="What lands in your project">
        <P>
          Every path below the blank line is relative to whatever your aliases
          resolve to, so a project with a <InlineCode>src</InlineCode> directory
          gets them under <InlineCode>src</InlineCode>. The two paths above it
          are the ones <InlineCode>init</InlineCode> detected and recorded.
        </P>
        <FrameworkBlock react={REACT_FILES} vue={VUE_FILES} />
        <P>
          <FrameworkText
            react={
              <span>
                One file per component, and the imports inside it are rewritten
                on the way in:{" "}
                <InlineCode>@/registry/default/ui/button</InlineCode> becomes
                your ui alias, and <InlineCode>@/lib/utils</InlineCode> becomes
                your utils alias. The variants are{" "}
                <InlineCode>class-variance-authority</InlineCode>, so a
                component you want to change is a file you edit.
              </span>
            }
            vue={
              <span>
                A folder per component: the single-file components, and an{" "}
                <InlineCode>index.ts</InlineCode> barrel that re-exports them
                along with the <InlineCode>class-variance-authority</InlineCode>{" "}
                variants. The imports are rewritten on the way in, so{" "}
                <InlineCode>@/lib/registry/default/ui/button</InlineCode>{" "}
                becomes your ui alias and <InlineCode>@/lib/utils</InlineCode>{" "}
                becomes your utils alias.
              </span>
            }
          />
        </P>
        <Note>
          Nothing here is a dependency on {SITE.name}. The files are yours from
          the moment they are written, and deleting{" "}
          <InlineCode>components.json</InlineCode> costs you the next{" "}
          <InlineCode>add</InlineCode>, not the components you already have.
        </Note>
      </Section>

      <Section id="tokens" title="The token layer">
        <P>
          Every colour, radius, shadow, font and duration in the library is a{" "}
          <InlineCode>--newt-*</InlineCode> custom property. The source of truth
          is one file in the repository,{" "}
          <InlineCode>packages/newt-ui/registry/html/tokens.css</InlineCode>,
          and all three flavours read from it: the Tailwind theme maps its
          namespaces onto those variables, and the plain CSS components use{" "}
          <InlineCode>var(--newt-brand)</InlineCode> directly.
        </P>
        <P>
          The same file carries one class, <InlineCode>.newt-root</InlineCode>,
          which sets the font family, the base text colour and font smoothing.
          Put it on the element that wraps your application. Then make sure the
          stylesheet <InlineCode>init</InlineCode> wrote into is actually
          loaded:
        </P>
        <FrameworkBlock
          lang="typescript"
          react={TOKENS_REACT}
          vue={TOKENS_VUE}
        />
        <Note>
          Overriding a token is a one-line change in your own stylesheet, and it
          reaches every component at once. Hardcoding a hex that already exists
          as a token is the one thing worth avoiding: it is the only way to end
          up with a component that no longer follows the rest.
        </Note>
      </Section>

      {vue && (
        <Section id="nuxt" title="On Nuxt">
          <P>
            <InlineCode>{SITE.nuxtModule}</InlineCode> saves you the imports. It
            registers your <InlineCode>components/ui</InlineCode> directory with
            Nuxt so <InlineCode>Button.vue</InlineCode> is available as{" "}
            <InlineCode>&lt;Button /&gt;</InlineCode> anywhere, without the
            directory name in front of it, and it prepends the token stylesheet
            to your CSS so the variables are there before your own styles run.
            It needs Nuxt 4.
          </P>
          <CodeBlock code={NUXT_CONFIG} lang="typescript" />
          <P>
            The three options are all optional. <InlineCode>prefix</InlineCode>{" "}
            namespaces the auto-imported names if a bare{" "}
            <InlineCode>&lt;Button /&gt;</InlineCode> would collide with
            something you already have, <InlineCode>componentDir</InlineCode>{" "}
            points at your components directory relative to the Nuxt source
            directory, and <InlineCode>css: false</InlineCode> turns the
            injected tokens off when your own CSS entry already carries them.
          </P>
        </Section>
      )}

      {!vue && (
        <Section id="next" title="On Next and the App Router">
          <P>
            <InlineCode>init</InlineCode> looks for{" "}
            <InlineCode>app/globals.css</InlineCode> first, so on a standard App
            Router project the tokens land in the stylesheet your layout already
            imports. The class goes on the body:
          </P>
          <CodeBlock code={NEXT_LAYOUT} lang="tsx" />
          <P>
            Nine of the components ship with a{" "}
            <InlineCode>&quot;use client&quot;</InlineCode> directive — the
            interactive ones: modal, tabs, toast, reaction, spoiler,
            form-fields, permission, stage-banner and token-field. The rest
            render on the server. Answering yes to the React Server Components
            question at <InlineCode>init</InlineCode> keeps those directives;
            answering no sets <InlineCode>rsc: false</InlineCode> in your config
            and <InlineCode>add</InlineCode> strips them as it writes.
          </P>
        </Section>
      )}

      <Section id="html" title="Without a bundler">
        <P>
          The same components exist as plain CSS with BEM class names, with no
          Tailwind, no framework and no build step. That flavour ships inside
          the React package, and the CLI reaches it through{" "}
          <InlineCode>--legacy</InlineCode> — the same program is also exposed
          as the <InlineCode>newt-ui-html</InlineCode> binary.
        </P>
        <CodeBlock shell lang="bash" code={HTML_CLI} />
        <P>
          <InlineCode>init</InlineCode> writes{" "}
          <InlineCode>newt-ui.json</InlineCode> and copies{" "}
          <InlineCode>tokens.css</InlineCode> to{" "}
          <InlineCode>styles/newt-tokens.css</InlineCode>; the two paths in that
          config are where everything afterwards goes.{" "}
          <InlineCode>add</InlineCode> copies a <InlineCode>.css</InlineCode>{" "}
          and a <InlineCode>.html</InlineCode> file per component into{" "}
          <InlineCode>components/ui</InlineCode>, following the same dependency
          links as the registry. The HTML file is the markup to copy:
        </P>
        <CodeBlock code={HTML_MARKUP} lang="html" />
        <P>
          These are local files served by your own site. There is no CDN to
          point at, which is the point: nothing is fetched at runtime and
          nothing can change under you. <InlineCode>--legacy list</InlineCode>{" "}
          prints what is available.
        </P>
      </Section>

      <Section id="options" title="Options">
        <FrameworkBlock react={FLAGS_REACT} vue={FLAGS_VUE} />
        <P>
          <InlineCode>--registry</InlineCode> overrides where items are fetched
          from, and so does the <InlineCode>NEWT_REGISTRY_URL</InlineCode>{" "}
          environment variable. The default is{" "}
          <InlineCode>
            {vue ? SITE.vueRegistryUrl : SITE.registryUrl}
          </InlineCode>
          . Beyond <InlineCode>init</InlineCode> and{" "}
          <InlineCode>add</InlineCode> there are two more commands:{" "}
          <InlineCode>list</InlineCode>, which prints the registry, and{" "}
          <InlineCode>diff</InlineCode>, which compares a component you have
          against the one the registry currently ships.
        </P>
      </Section>

      <P>
        <Link href="/docs/components/button" className={LINK}>
          The button page
        </Link>
        <span>
          {" "}
          is the shortest way to see what one of these files looks like once it
          is in your project. The registry, both CLIs and the Nuxt module all
          live in{" "}
        </span>
        <a href={SITE.github} target="_blank" rel="noreferrer" className={LINK}>
          the repository
        </a>
        <span>, under {SITE.license}.</span>
      </P>
    </article>
  )
}
