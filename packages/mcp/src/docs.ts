import { z } from "zod"

/*
 * A read-only client for the newt/ui documentation site. It reads only what
 * the site already publishes for agents: `llms.txt` (the page index),
 * `llms-full.txt` (every page's Markdown in one file) and the `.md` twin Blume
 * writes beside every page. Nothing is scraped from HTML.
 *
 * The Blume dev server does not serve the two `llms` files, only the built
 * site does; it does serve the JSON docs API, so the index falls back to
 * `/api/docs/pages.json` when `llms.txt` is missing. That is what lets the
 * server point at `http://localhost:4321` while the docs are being written.
 */

export const DEFAULT_DOCS_URL = "https://newtui.dev"

/** How long a fetched document stays fresh, in milliseconds. */
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000

/** The one network call this module makes; injected so tests never leave the process. */
export type Fetcher = (url: string) => Promise<Response>

export interface DocsClientOptions {
  /** The site root, e.g. `https://newtui.dev` or `http://localhost:4321`. */
  baseUrl: string
  fetcher?: Fetcher
  /** Cache lifetime in milliseconds. `0` disables the cache. */
  ttl?: number
  /** The clock the cache reads; injected so tests can expire entries. */
  now?: () => number
}

/** One page of the documentation, as the index lists it. */
export interface DocEntry {
  title: string
  /** Site-relative route, e.g. `/docs/components/button`. */
  path: string
  /** The page on the configured site. */
  url: string
  /** The page's Markdown twin on the configured site. */
  markdownUrl: string
  description?: string
  /** The `llms.txt` heading the page is listed under, e.g. `Forms`. */
  section?: string
}

export interface SearchHit extends DocEntry {
  score: number
  /** A line of the page body around the first match, for content searches. */
  excerpt?: string
}

export interface SearchResult {
  /** Whether page bodies were searched, or only titles and descriptions. */
  searchedContent: boolean
  hits: SearchHit[]
}

export type DocPage =
  | { found: true; entry: DocEntry; markdown: string }
  | { found: false; path: string; suggestions: DocEntry[] }

export class DocsRequestError extends Error {
  readonly url: string
  readonly status: number

  constructor(url: string, status: number) {
    super(`GET ${url} answered ${status}`)
    this.name = "DocsRequestError"
    this.url = url
    this.status = status
  }
}

/** The subset of Blume's JSON docs API the fallback index reads. */
const pagesApiSchema = z.object({
  pages: z.array(
    z.object({
      route: z.string(),
      title: z.string(),
      description: z.string().optional(),
      contentType: z.string().optional(),
    })
  ),
})

/** The docs site resolves as `--url` > `NEWTUI_DOCS_URL` > the default. */
export function resolveDocsUrl(
  flag: string | undefined,
  env: string | undefined
): string {
  const chosen = [flag, env].find(
    (value) => value !== undefined && value.trim() !== ""
  )
  return chosen?.trim() ?? DEFAULT_DOCS_URL
}

/** Strip the trailing slash so `${base}${path}` never doubles one. */
export function normaliseBaseUrl(url: string): string {
  return new URL(url).toString().replace(/\/+$/u, "")
}

const DEFAULT_HOST = new URL(DEFAULT_DOCS_URL).host

/*
 * `llms.txt` links are absolute and name the canonical site even in a local
 * build, so a link on newtui.dev counts as a page of whichever site is
 * configured. Feeds, skills and the agent manifests are files rather than
 * pages; they carry an extension or live under a dot directory.
 */
function pagePathOf(href: string, base: URL): string | null {
  const link = new URL(href, base)
  if (link.host !== base.host && link.host !== DEFAULT_HOST) {
    return null
  }
  const path = link.pathname.replace(/\/+$/u, "") || "/"
  const segments = path.split("/")
  const last = segments.at(-1) ?? ""
  if (
    segments.some((segment) => segment.startsWith(".")) ||
    last.includes(".")
  ) {
    return null
  }
  return path
}

const LINK_LINE =
  /^- \[(?<title>[^\]]+)\]\((?<href>[^)\s]+)\)(?::\s*(?<description>.*))?$/u

/** Parse an `llms.txt` page index into entries rebased on `baseUrl`. */
export function parseLlmsTxt(source: string, baseUrl: string): DocEntry[] {
  const base = new URL(baseUrl)
  const entries: DocEntry[] = []
  const seen = new Set<string>()
  let section: string | undefined
  for (const line of source.split("\n")) {
    if (line.startsWith("## ")) {
      section = line.slice(3).trim()
      continue
    }
    const groups = LINK_LINE.exec(line.trim())?.groups
    if (groups?.title === undefined || groups.href === undefined) {
      continue
    }
    const path = pagePathOf(groups.href, base)
    if (path === null || seen.has(path)) {
      continue
    }
    seen.add(path)
    entries.push(
      toEntry(baseUrl, path, groups.title, groups.description?.trim(), section)
    )
  }
  return entries
}

/** Parse Blume's `/api/docs/pages.json` into the same entries. */
export function parsePagesApi(source: string, baseUrl: string): DocEntry[] {
  const { pages } = pagesApiSchema.parse(JSON.parse(source))
  return pages
    .filter((page) => page.route !== "/404")
    .map((page) =>
      toEntry(
        baseUrl,
        page.route.replace(/\/+$/u, "") || "/",
        page.title,
        page.description,
        page.contentType
      )
    )
}

/*
 * `llms-full.txt` concatenates every page as `# Title`, `Source: <url>`, then
 * the body. The `Source:` line right under a top-level heading is what marks a
 * page boundary; a body may contain its own `# ` lines.
 */
export function parseLlmsFull(
  source: string,
  baseUrl: string
): Map<string, string> {
  const base = new URL(baseUrl)
  const lines = source.split("\n")
  const starts: { path: string; heading: number }[] = []
  for (let index = 1; index < lines.length; index++) {
    const match = /^Source: (?<href>\S+)$/u.exec(lines[index] ?? "")
    const href = match?.groups?.href
    if (href === undefined || !(lines[index - 1] ?? "").startsWith("# ")) {
      continue
    }
    const path = pagePathOf(href, base)
    if (path !== null) {
      starts.push({ path, heading: index - 1 })
    }
  }
  const bodies = new Map<string, string>()
  starts.forEach((start, position) => {
    const end = starts[position + 1]?.heading ?? lines.length
    bodies.set(
      start.path,
      lines
        .slice(start.heading + 2, end)
        .join("\n")
        .trim()
    )
  })
  return bodies
}

function toEntry(
  baseUrl: string,
  path: string,
  title: string,
  description: string | undefined,
  section: string | undefined
): DocEntry {
  const entry: DocEntry = {
    title,
    path,
    url: `${baseUrl}${path === "/" ? "" : path}`,
    markdownUrl: `${baseUrl}${markdownPathFor(path)}`,
  }
  if (description !== undefined && description !== "") {
    entry.description = description
  }
  if (section !== undefined) {
    entry.section = section
  }
  return entry
}

/** Blume writes `/docs.md` for `/docs` and `/index.md` for the home page. */
export function markdownPathFor(path: string): string {
  return path === "/" ? "/index.md" : `${path}.md`
}

/**
 * Turn whatever an agent passes — a slug, a route, a full URL, with or
 * without `.md` — into a site-relative route.
 */
export function toRoute(input: string): string {
  let value = input.trim()
  if (/^https?:\/\//u.test(value)) {
    value = new URL(value).pathname
  }
  value = value
    .replace(/[?#].*$/u, "")
    .replace(/\.mdx?$/u, "")
    .replace(/\/+$/u, "")
  if (value === "" || value === "/index") {
    return "/"
  }
  return value.startsWith("/") ? value : `/${value}`
}

function terms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 0)
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    count++
    index = haystack.indexOf(needle, index + needle.length)
  }
  return count
}

/*
 * The body line that best shows why a page matched: the query as typed, then
 * a line holding every term, then any term at all.
 */
function excerptOf(
  body: string,
  query: string,
  words: string[]
): string | undefined {
  const lines = body.split("\n").map((line) => line.trim())
  const lowered = lines.map((line) => line.toLowerCase())
  const phrase = query.trim().toLowerCase()
  const tests: ((line: string) => boolean)[] = [
    (line) => line.includes(phrase),
    (line) => words.every((word) => line.includes(word)),
    (line) => words.some((word) => line.includes(word)),
  ]
  for (const test of tests) {
    const index = lowered.findIndex(test)
    const line = lines[index]
    if (index !== -1 && line !== undefined) {
      return line.length > 200 ? `${line.slice(0, 197)}...` : line
    }
  }
  return undefined
}

/**
 * Rank entries against a keyword query. Every term has to appear somewhere —
 * the title, the route, the description, the section or (when given) the
 * body — and where it appears decides the weight.
 */
export function rankEntries(
  entries: DocEntry[],
  query: string,
  bodies?: Map<string, string>
): SearchHit[] {
  const words = terms(query)
  if (words.length === 0) {
    return []
  }
  const phrase = words.join(" ")
  const hits: SearchHit[] = []
  for (const entry of entries) {
    const title = entry.title.toLowerCase()
    const titleWords = new Set(terms(entry.title))
    const route = entry.path.toLowerCase()
    const description = (entry.description ?? "").toLowerCase()
    const section = (entry.section ?? "").toLowerCase()
    const body = bodies?.get(entry.path)?.toLowerCase() ?? ""
    let score = title === phrase ? 20 : title.includes(phrase) ? 8 : 0
    let everyTermFound = true
    for (const word of words) {
      let weight = 0
      if (titleWords.has(word)) weight += 10
      else if (title.includes(word)) weight += 6
      if (route.includes(word)) weight += 4
      if (description.includes(word)) weight += 2
      if (section.includes(word)) weight += 1
      weight += Math.min(countOccurrences(body, word), 5)
      if (weight === 0) {
        everyTermFound = false
        break
      }
      score += weight
    }
    if (!everyTermFound) {
      continue
    }
    const hit: SearchHit = { ...entry, score }
    const excerpt =
      body === ""
        ? undefined
        : excerptOf(bodies?.get(entry.path) ?? "", query, words)
    if (excerpt !== undefined) {
      hit.excerpt = excerpt
    }
    hits.push(hit)
  }
  return hits.toSorted(
    (left, right) =>
      right.score - left.score || left.path.localeCompare(right.path)
  )
}

interface CacheEntry {
  expires: number
  value: Promise<string | null>
}

export class DocsClient {
  readonly baseUrl: string
  readonly #fetcher: Fetcher
  readonly #ttl: number
  readonly #now: () => number
  readonly #cache = new Map<string, CacheEntry>()

  constructor(options: DocsClientOptions) {
    this.baseUrl = normaliseBaseUrl(options.baseUrl)
    this.#fetcher =
      options.fetcher ??
      ((url) => fetch(url, { signal: AbortSignal.timeout(15_000) }))
    this.#ttl = options.ttl ?? DEFAULT_CACHE_TTL
    this.#now = options.now ?? Date.now
  }

  /**
   * A cached GET. `null` means the site answered 404 — a fact worth caching
   * too; any other failure throws and is not cached, so the next call retries.
   */
  async #get(path: string): Promise<string | null> {
    const url = `${this.baseUrl}${path}`
    const cached = this.#cache.get(url)
    if (cached !== undefined && cached.expires > this.#now()) {
      return cached.value
    }
    const value = this.#fetcher(url).then(async (response) => {
      if (response.status === 404) {
        return null
      }
      if (!response.ok) {
        throw new DocsRequestError(url, response.status)
      }
      return response.text()
    })
    if (this.#ttl > 0) {
      this.#cache.set(url, { expires: this.#now() + this.#ttl, value })
      value.catch(() => this.#cache.delete(url))
    }
    return value
  }

  /** Every page the site lists, in the order `llms.txt` lists them. */
  async listDocs(): Promise<DocEntry[]> {
    const llms = await this.#get("/llms.txt")
    if (llms !== null) {
      return parseLlmsTxt(llms, this.baseUrl)
    }
    const api = await this.#get("/api/docs/pages.json")
    if (api !== null) {
      return parsePagesApi(api, this.baseUrl)
    }
    throw new DocsRequestError(`${this.baseUrl}/llms.txt`, 404)
  }

  /** Page bodies keyed by route, or `null` when the site has no `llms-full.txt`. */
  async #bodies(): Promise<Map<string, string> | null> {
    const full = await this.#get("/llms-full.txt")
    return full === null ? null : parseLlmsFull(full, this.baseUrl)
  }

  async searchDocs(
    query: string,
    includeContent: boolean
  ): Promise<SearchResult> {
    const entries = await this.listDocs()
    const bodies = includeContent ? await this.#bodies() : null
    return {
      searchedContent: bodies !== null,
      hits: rankEntries(entries, query, bodies ?? undefined),
    }
  }

  /**
   * One page's Markdown. A bare slug (`button`) is matched against the index
   * first — the last segment of a route — then tried under `/docs/`.
   */
  async getDoc(input: string): Promise<DocPage> {
    const route = toRoute(input)
    const entries = await this.listDocs().catch(() => [])
    const slug = route.slice(1)
    const known = new Set(entries.map((entry) => entry.path))
    const guesses = [
      route,
      `/docs${route}`,
      ...entries
        .filter((entry) => entry.path.endsWith(route))
        .map((entry) => entry.path),
    ]
    // Routes the index knows are tried before guesses, so a slug costs one
    // request rather than a 404 per guess.
    const candidates = new Set([
      ...guesses.filter((path) => known.has(path)),
      ...guesses,
    ])
    for (const path of candidates) {
      const markdown = await this.#get(markdownPathFor(path))
      if (markdown !== null) {
        const entry =
          entries.find((candidate) => candidate.path === path) ??
          toEntry(this.baseUrl, path, path, undefined, undefined)
        return { found: true, entry, markdown }
      }
    }
    // Loosen each word to a stem so a plural or a typo still finds the page.
    const words = terms(slug)
      .map((word) => word.slice(0, Math.max(4, word.length - 2)))
      .join(" ")
    return {
      found: false,
      path: route,
      suggestions: rankEntries(entries, words).slice(0, 5),
    }
  }
}
