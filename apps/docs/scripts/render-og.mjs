import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { render } from "takumi-js"
import { container, image, text } from "takumi-js/helpers"

/*
 * The social cards, redrawn.
 *
 * Blume renders one 1200×630 card per route into `dist/og/**` and points every
 * page's `og:image` at it. Its layout is fixed — a mark, a headline, a footer
 * rule — and its renderer is a generated endpoint under `.blume/`, which this
 * app does not own. So the routes, the URLs and the head tags stay Blume's,
 * and this step replaces the pixels: for each card Blume wrote, it reads the
 * title and the description back out of the page the card belongs to and
 * draws the site's own card over it.
 *
 * The card is a frame of hairlines with the page set inside it: where the
 * page sits in the site, its title, what it is for, and the mark in the
 * corner. Every colour is a `--newt-*` token read from the dark palette in
 * `tokens.css`, because a card has no cascade to inherit one from.
 *
 * The same renderer Blume uses (Takumi) draws it, so there is still no
 * headless browser in the build, and its built-in font covers the Latin the
 * site is written in without a network request.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = resolve(root, "dist")
const cards = resolve(dist, "og")

const WIDTH = 1200
const HEIGHT = 630
/* The frame: how far in from each edge the hairlines run. */
const INSET = 64

/* ------------------------------------------------------------------ *
 * Tokens
 * ------------------------------------------------------------------ */
const tokensCss = readFileSync(
  resolve(root, "../../packages/cli/registry/html/tokens.css"),
  "utf8"
)

/** A token's value in the first block that declares it, which is the dark one. */
function token(name) {
  const match = tokensCss.match(new RegExp(`--newt-${name}:\\s*([^;]+);`))
  if (match === null) {
    throw new Error(`render-og: tokens.css declares no --newt-${name}.`)
  }
  return match[1].trim()
}

const COLOR = {
  background: token("bg-base"),
  line: token("border"),
  title: token("text-primary"),
  body: token("text-muted"),
  brand: token("brand"),
}

/* ------------------------------------------------------------------ *
 * What a card says
 * ------------------------------------------------------------------ */
const SITE_NAME = "newt/ui"
/* The footer says where the card leads, which is the one thing a share hides. */
const SITE_HOST = "newtui.dev"

const meta = new Map(
  readdirSync(resolve(root, "../www/registry/meta"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const item = JSON.parse(
        readFileSync(resolve(root, "../www/registry/meta", file), "utf8")
      )
      return [item.name, item]
    })
)

function decodeEntities(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
}

function metaContent(html, property) {
  const match = html.match(
    new RegExp(`<meta property="${property}" content="([^"]*)"`)
  )
  return match === null ? undefined : decodeEntities(match[1])
}

/** `dist/og/docs/cli.png` → `/docs/cli`; the home page's card is `index.png`. */
function routeOf(file) {
  const slug = relative(cards, file).slice(0, -".png".length).split(sep)
  return slug.length === 1 && slug[0] === "index" ? "/" : `/${slug.join("/")}`
}

/** Where a page sits, said in a word or two above its title. */
function eyebrowOf(route) {
  const component = route.match(/^\/docs\/components\/([^/]+)$/)
  if (component !== null) {
    return meta.get(component[1])?.type === "registry:block"
      ? "Block"
      : "Component"
  }
  if (route === "/") return "React · Vue · HTML & CSS"
  if (route.startsWith("/docs")) return "Documentation"
  if (route.startsWith("/changelog")) return "Changelog"
  if (route.startsWith("/blocks")) return "Blocks"
  return SITE_NAME
}

function cardOf(file) {
  const route = routeOf(file)
  const page = resolve(dist, `.${route}`, "index.html")
  if (!existsSync(page)) return undefined
  const html = readFileSync(page, "utf8")
  const suffix = ` - ${SITE_NAME}`
  const ogTitle = metaContent(html, "og:title") ?? SITE_NAME
  return {
    route,
    eyebrow: eyebrowOf(route),
    title: ogTitle.endsWith(suffix)
      ? ogTitle.slice(0, -suffix.length)
      : ogTitle,
    description: metaContent(html, "og:description"),
  }
}

/* ------------------------------------------------------------------ *
 * The drawing
 * ------------------------------------------------------------------ */
const logoSvg = readFileSync(resolve(root, "public/logo.svg"), "utf8")

function logo(color, size) {
  return image({
    src: `data:image/svg+xml;base64,${Buffer.from(
      logoSvg.replaceAll("currentColor", color)
    ).toString("base64")}`,
    width: size,
    height: size,
  })
}

function rule(style) {
  return container({
    style: { position: "absolute", backgroundColor: COLOR.line, ...style },
  })
}

/** The small square that pins each crossing of the frame. */
function pin(left, top) {
  const size = 9
  return container({
    style: {
      position: "absolute",
      left: left - (size - 1) / 2,
      top: top - (size - 1) / 2,
      width: size,
      height: size,
      backgroundColor: COLOR.background,
      border: `1px solid ${COLOR.body}`,
    },
  })
}

function truncate(value, max) {
  const chars = [...value]
  return chars.length > max
    ? `${chars
        .slice(0, max - 1)
        .join("")
        .trimEnd()}…`
    : value
}

/* A long title steps down rather than running into a third line. */
function titleSize(title) {
  if (title.length > 44) return 56
  if (title.length > 26) return 68
  return 84
}

function draw({ eyebrow, title, description }) {
  const right = WIDTH - INSET
  const bottom = HEIGHT - INSET

  const frame = [
    rule({ left: 0, top: INSET, width: WIDTH, height: 1 }),
    rule({ left: 0, top: bottom, width: WIDTH, height: 1 }),
    rule({ left: INSET, top: 0, width: 1, height: HEIGHT }),
    rule({ left: right, top: 0, width: 1, height: HEIGHT }),
    pin(INSET, INSET),
    pin(right, INSET),
    pin(INSET, bottom),
    pin(right, bottom),
  ]

  const body = container({
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flexGrow: 1,
    },
    children: [
      text(eyebrow.toUpperCase(), {
        color: COLOR.brand,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "0.12em",
      }),
      text(truncate(title, 60), {
        color: COLOR.title,
        fontSize: titleSize(title),
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: 1.05,
        marginTop: 20,
        maxWidth: 940,
        textWrap: "balance",
      }),
      description === undefined || description === ""
        ? container({})
        : text(truncate(description, 120), {
            color: COLOR.body,
            fontSize: 32,
            lineHeight: 1.4,
            marginTop: 28,
            maxWidth: 760,
            textWrap: "pretty",
          }),
    ],
  })

  const footer = container({
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      width: "100%",
    },
    children: [
      text(SITE_HOST, {
        color: COLOR.body,
        fontSize: 24,
        fontWeight: 500,
      }),
      logo(COLOR.brand, 52),
    ],
  })

  return container({
    style: {
      position: "relative",
      display: "flex",
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: COLOR.background,
    },
    children: [
      ...frame,
      container({
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: `${INSET + 40}px ${INSET + 56}px ${INSET + 36}px`,
        },
        children: [body, footer],
      }),
    ],
  })
}

/* ------------------------------------------------------------------ *
 * Every card Blume wrote
 * ------------------------------------------------------------------ */
function pngsUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return pngsUnder(path)
    return entry.name.endsWith(".png") ? [path] : []
  })
}

if (!existsSync(cards)) {
  /* `seo.og.enabled: false`, or a build with no site URL: nothing to redraw. */
  console.log("render-og: no generated cards, skipped")
  process.exit(0)
}

let drawn = 0
const orphans = []
for (const file of pngsUnder(cards)) {
  const card = cardOf(file)
  if (card === undefined) {
    orphans.push(relative(dist, file))
    continue
  }
  const png = await render(draw(card), {
    format: "png",
    width: WIDTH,
    height: HEIGHT,
  })
  writeFileSync(file, png)
  drawn += 1
}

if (orphans.length > 0) {
  console.error(
    `render-og: no page behind ${orphans.length} card(s):\n  ${orphans.join("\n  ")}`
  )
  process.exit(1)
}

console.log(`render-og: ${drawn} cards drawn`)
