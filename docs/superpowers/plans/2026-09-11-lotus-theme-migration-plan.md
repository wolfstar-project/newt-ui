# Piano: rifare il sito docs newt/ui sul tema astro-theme-lotus

> **Status:** Approvato 2026-09-11 | **Branch:** `t3code/astro-lotus-migration`

## Context

Il sito docs vive in `apps/docs` (Astro 7, output statico, `https://newtui.dev`). Oggi tutta la chrome (header, sidebar, TOC, search, pager, footer, prose) è CSS scritto a mano in `src/styles/site.css` (2337 righe) più componenti `.astro` propri. L'obiettivo è ricostruirlo sopra `@prosefly/astro-theme-lotus` (v0.8.0, BSD-3, tema docs installabile come integrazione Astro) mantenendo la stessa interfaccia e le stesse feature, ed elencando esplicitamente ogni cambiamento inevitabile o consigliato.

Il piano è stato approvato il 2026-09-11. L'implementazione (Fasi 0–6) non è ancora iniziata.

## Cosa ho verificato

**Tema Lotus** (clonato in `/tmp/lotus-theme`, tag 0.8.0, ultimo commit 2026-09-10, un solo maintainer, 14 release in 8 settimane, API già con opzioni deprecate). Stack: Astro ^7, Tailwind v4 via `@tailwindcss/vite`, `@astrojs/mdx`, `astro-expressive-code`, Pagefind opzionale, peer obbligatoria `@prosefly/astro-components`. Fornisce layout a 3 colonne, header con SubNav, sidebar configurata via `docsNav`, TOC, prev/next, dark mode a 3 stati (`data-theme` su `<html>`, chiave `lotus-theme`), search (local/pagefind/docsearch/algolia), i18n/RTL, llms.txt, twin `.md`, page actions AI, edit link, contributors, JSON-LD. Non fornisce: OG image, sitemap, PWA, RSS, view transitions, componenti demo/preview, framework switcher, mapping globale dei componenti MDX. Solo 12 slot di override.

**Sito attuale** (`apps/docs`): 107 MDX in `src/content/docs` (71 componenti), sidebar generata da `src/lib/nav.ts` + `registry-categories`, switch framework globale via `html[data-framework]` con doppio render SSR, demo come island React/Vue (`ComponentPreview`), tema via `html[data-newt-theme]` + `newt-ui:theme`, markdown twins con espansione dei tag registry, `llms.txt` con validazione, CopyPage con MCP/Cursor/VS Code/v0/Gemini, Pagefind con `excludeSelectors`, OG via `astro-takumi` (patchato), PWA, RTL per-demo, `/create`, `/typeset`, `/colors`, `/blocks`, changelog. Pipeline: `astro build && bundle-registry.mjs && verify-dist.mjs` (il `dist/` è anche il CDN del registry).

**Incompatibilità confermate nel codice del tema** (file relativi a `packages/astro-theme-lotus/src`):

1. `lib/routes.ts:31-44` inietta `/404`, `/docs/[...slug]`, `/docs/[...slug].md` senza opzione per disattivarle. Astro 7.3 emette solo un warning sulle collisioni statiche.
2. `routes/docs.astro:171-202` rende `<Content />` senza prop `components`: i 107 MDX che usano `ComponentPreview`, `Installation`, ecc. senza import non funzionano con la rotta del tema.
3. `lib/page/head.ts` non permette meta computati per pagina: `og:image` per `astro-takumi` è possibile solo da una rotta propria via prop `head`.
4. `lib/config/markdown.ts:30-57` sostituisce `markdown.processor` quando è `satteri`: si perde `hastHeadingId`, il repo deve passare a remark/rehype (Lotus include `mdast-heading-id`, sintassi `{#id}`).
5. `lib/i18n.ts:168-181` genera href con trailing slash; il sito usa `trailingSlash: "never"`.
6. Il middleware icone (`@prosefly/astro-components`) fa `fetch` a `api.iconify.design` durante il prerender: build con rete.
7. `lib/styles.ts:90-114` inlinea il CSS custom in `.astro/lotus/styles.css`: `@source` e `@import` relativi vanno riscritti, e non si può ripetere `@import "tailwindcss"`.
8. Versioni: il repo ha `vite 8.2.2`, Lotus richiede `^8.3.0`; `@astrojs/mdx` 8.0.0 vs 8.0.1. Lotus registra da solo `mdx()`, Expressive Code e `@tailwindcss/vite`: i duplicati vanno rimossi da `astro.config.ts`.
9. `components/layout/SubNav.astro` è sempre reso anche con una sola sezione in `docsNav`.

## Strategia raccomandata: A ibrida (integrazione npm + rotte proprie + pnpm patch)

Installare Lotus come integrazione e usarne layout, componenti esportati, stili, config, search e middleware. Scrivere rotte proprie per tutto ciò che il tema non copre. Applicare una `pnpm patch` (il repo ne usa già una per `astro-takumi`) che rimuove le tre `injectRoute` incondizionate in `lib/routes.ts:31-44` e, se lo spike lo richiede, il trailing slash in `lib/i18n.ts`.

Alternative scartate: **B vendoring/fork** in `packages/` (stessa libertà ma si perdono gli aggiornamenti; resta la via d'uscita se la patch supera 3 hunk). **C solo stile** (riprodurre l'estetica Lotus sulla chrome attuale: nessun vincolo del tema, ma non è "usare il tema").

## Mappa attuale → Lotus

| Oggi                                                                                                                      | Con Lotus                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layouts/Base.astro` + `Docs.astro`                                                                                       | `DocsContextLayout` / `BaseLayout` + `SiteHeader` + `SiteFooter` esportati da `@prosefly/astro-theme-lotus/layouts`                                                                                                                                                                                                  |
| `site/Header.astro`, `Sidebar.astro`, `Toc.astro`, `Pager.astro`, `Search.astro`                                          | rimossi: `MainHeader`, `Sidebar`, `TableOfContents`, `PageNavigation`, `SearchDialog` del tema                                                                                                                                                                                                                       |
| `SITE.nav` in `lib/site.ts`                                                                                               | `siteNav` in config Lotus (stesse voci)                                                                                                                                                                                                                                                                              |
| `lib/nav.ts` (`NAV`, `FLAT`, `neighbours`)                                                                                | funzione `buildDocsNav()` in `src/lib/lotus-nav.ts` che produce `docsNav` (una sezione, 13 gruppi, stesso ordine) a partire da `GUIDES`, `INSTALL_TARGETS`, `categories`; prev/next dal tema                                                                                                                         |
| `site/ThemeToggle.astro` + `stores/theme.ts`                                                                              | override slot `ThemeSwitch`: FrameworkSwitcher island + toggle dark/light a 2 stati che scrive la chiave `lotus-theme` e `data-theme`; script inline (config `head`) che riflette `data-theme` su `data-newt-theme` prima del paint                                                                                  |
| `site/CopyPage.astro`                                                                                                     | override slot `PageActions` con lo stesso menu (Copy, View as Markdown, v0, Claude, ChatGPT, Grok, Perplexity, Gemini, MCP, Cursor, VS Code, Edit on GitHub), restilizzato sui token `--lotus-*`                                                                                                                     |
| `site/Wordmark.astro`                                                                                                     | override slot `SiteBrand`                                                                                                                                                                                                                                                                                            |
| `site/Footer.astro` (disclaimer trademark)                                                                                | `footer.copyright` + override slot `FooterLinks` con il disclaimer                                                                                                                                                                                                                                                   |
| `Base.astro` script PWA + anti-FOUC                                                                                       | override slot `Assistant` (reso in ogni pagina dal `BaseLayout`) usato come contenitore degli script di sito: registrazione SW, sync tema                                                                                                                                                                            |
| `pages/docs/[...slug].astro`                                                                                              | riscritta: `DocsContextLayout` + `getDocsContext` (da `/navigation`) + `PageHeader`/`PageNavigation`/`PageAside` (da `/components`), `<Content components={…} />`, prop `head` con `og:image`/twitter                                                                                                                |
| `pages/docs/[...slug].md.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `404.astro`                                              | invariati (Lotus: `llms: false`, rotte iniettate rimosse dalla patch)                                                                                                                                                                                                                                                |
| `astro-pagefind` + `excludeSelectors`                                                                                     | `search: { provider: 'pagefind', excludeSelectors: [...] }` di Lotus                                                                                                                                                                                                                                                 |
| `ec.config.mjs` + `expressiveCode()`                                                                                      | `markdown.expressiveCode` nella config Lotus (temi, font `--newt-font-mono`, `themeCssSelector` su `data-theme`)                                                                                                                                                                                                     |
| `satteri` + `lib/hast-heading-id.ts`                                                                                      | pipeline remark/rehype del tema; anchor `{#id}` via `mdast-heading-id`                                                                                                                                                                                                                                               |
| `styles/site.css` sezioni (a) bridge token, (b) palette, (c) primitive, (d) chrome                                        | `src/styles/lotus.css` via `head: [{ tag: 'style', src }]`: (a)+(b)+(c) conservate, (d) ridotta a demo-frame, tabs, callout, steps, props-table, pagine landing; in più un blocco che mappa `--lotus-*` (background, surface, text*, border*, accent*, code*, header/footer background, radius, font) sui `--newt-*` |
| `content.config.ts` (zod proprio)                                                                                         | `docsLoader()` + `docsSchema({ extend })` con `component`, `new`, `updated`, `links`, `toc`, `pager`                                                                                                                                                                                                                 |
| `pages/index.astro`, `blocks`, `colors`, `create`, `typeset`, `typeset/preview`, `docs/components`, `docs/changelog/*`    | riscritte su `BaseLayout` + `SiteHeader` + `SiteFooter` (o `TextLayout`), stesso contenuto e stesse island                                                                                                                                                                                                           |
| `components/mdx/*` (11)                                                                                                   | conservati, restilizzati sui token `--lotus-*`; `not-prose` su `.demo-frame` e blocchi interattivi                                                                                                                                                                                                                   |
| `astro-takumi`, `@astrojs/sitemap`, `@vite-pwa/astro`, `bundle-registry.mjs`, `verify-dist.mjs`, `gen-component-docs.mjs` | invariati                                                                                                                                                                                                                                                                                                            |
| `astro-seo`                                                                                                               | rimosso: title/description/canonical dal tema, og/twitter dalla prop `head`                                                                                                                                                                                                                                          |

## Fasi di implementazione (per la richiesta successiva)

**Fase 0. Spike (branch usa-e-getta, `apps/docs`)**. Installare Lotus e verificare: esito delle collisioni di rotta senza patch; `pnpm patch` di `lib/routes.ts`; bump `vite` ≥ 8.3 e `@astrojs/mdx` 8.0.1 senza duplicati; build offline (Iconify `apiBase`/preload); `trailingSlash`; `{#id}` con la forma escapata `\{#id\}` presente in `skills.mdx` e altri; `astro-takumi` con `head` prop; Pagefind con `excludeSelectors`; `Astro.locals.t` nelle rotte proprie in dev. Uscita: patch o decisione di vendoring.

**Fase 1. Fondazioni**. `apps/docs/package.json` (aggiungere `@prosefly/astro-theme-lotus`, `@prosefly/astro-components`, `pagefind`; rimuovere `astro-pagefind`, `astro-seo`, `@astrojs/markdown-satteri`, `satteri`, `astro-expressive-code` diretto), `patches/@prosefly__astro-theme-lotus@0.8.0.patch`, `astro.config.ts` (rimuovere `expressiveCode()`, `mdx()`, `pagefind()`, `vite.plugins tailwindcss()`; aggiungere `lotus({...})` con `docsBase: '/docs'`, `siteNav`, `socials`, `docsNav: buildDocsNav()`, `search`, `llms: false`, `pageActions: []`, `credits: false`, `themeModeControl: false`, `appearance.defaultMode: 'dark'`, `components` overrides, `head` con style e script, `markdown.expressiveCode`, `markdown.packageManagerTabs: false`), `src/content.config.ts`, `src/styles/lotus.css`, `src/lib/lotus-nav.ts`, rimozione `ec.config.mjs` e `lib/hast-heading-id.ts`.

**Fase 2. Shell docs**. Nuova `pages/docs/[...slug].astro`; override in `src/components/lotus/` (`ThemeSwitch.astro`, `PageActions.astro`, `SiteBrand.astro`, `FooterLinks.astro`, `Assistant.astro`); adattare `stores/theme.ts` alla chiave `lotus-theme`; rimuovere `layouts/Docs.astro`, `Base.astro`, `site/Header|Sidebar|Toc|Pager|Search|ThemeToggle|Footer.astro`; `lib/nav.ts` ridotto a `GUIDES`.

**Fase 3. Pagine fuori docs**. `index`, `blocks/index`, `colors`, `create`, `typeset`, `typeset/preview`, `404`, `docs/components/index`, `docs/changelog/index` e `[id]` su `BaseLayout`+`SiteHeader`+`SiteFooter`; ogni pagina passa `head` con `og:image` (`ogImageUrl`) e i link PWA (`virtual:pwa-assets/head`).

**Fase 4. Componenti MDX e prose**. Restyle di `Tabs`, `PmTabs`, `PathTabs`, `Callout`, `Steps`, `PropsTable`, `FrameworkGrid`, `ComponentPreview`, `Installation`, `Usage`, `TokensNote` sui token `--lotus-*`; `not-prose` sui frame demo; tuning di `--lotus-content-width` e dei `--tw-prose-*` per avvicinarsi a 15px/1.7 attuali.

**Fase 5. Contenuti**. Passata sui 107 MDX per la pipeline unified (anchor `{#id}`, eventuali fence `npx` da lasciare fuori dai tab automatici), verifica pagina per pagina.

**Fase 6. Verifica e chiusura**. `pnpm --filter docs build` con `verify-dist.mjs` verde, conteggio pagine Pagefind, OG webp, `.md` twins, `llms.txt`, PWA, RTL, `pnpm quality`, `pnpm knip`, `pnpm typecheck`; aggiornare `AGENTS.md` (sezione docs site) e la skill `newt-ui-architecture`; nessun changeset (l'app docs non è pubblicata).

## Cambiamenti rispetto all'interfaccia attuale (da approvare)

**Inevitabili (portati dal tema)**

1. Aspetto della chrome: header, sidebar, TOC, dialog di ricerca, prev/next, footer e tipografia del corpo diventano quelli di Lotus (Tailwind Typography). Palette e token restano `--newt-*` (blurple, grigi Discord-like) tramite mapping su `--lotus-*`, ma spaziature, raggi e dimensioni cambiano.
2. Barra SubNav sotto l'header: Lotus la rende sempre. **Scelta consigliata**: una sola sezione "Docs" e SubNav nascosta via CSS (parità con oggi). Alternativa: due sezioni "Guides" e "Components" come tab, con sidebar che mostra solo la sezione corrente (cambio di IA).
3. Ricerca: stessa scorciatoia ⌘K e stesso indice Pagefind, ma dialog e risultati con lo stile Lotus; in `astro dev` la ricerca non è disponibile (Lotus non serve il bundle in dev, oggi mostriamo un avviso).
4. Toggle tema: si mantiene il toggle a 2 stati dark/light (override dello slot), ma la chiave localStorage cambia da `newt-ui:theme` a `lotus-theme` (la preferenza salvata dagli utenti viene azzerata una volta).
5. Pipeline markdown da `satteri` a remark/rehype: possibili micro-differenze di resa; gli anchor espliciti `\{#id\}` vanno riscritti nella sintassi `{#id}` di `mdast-heading-id`.
6. Link interni generati dal tema con trailing slash (`/docs/button/`), da neutralizzare via patch o accettando `trailingSlash: "ignore"` con canonical senza slash.
7. Build con accesso di rete (Iconify API) salvo soluzione dallo spike.
8. Footer: layout Lotus (brand, copyright, colonne di link); il disclaimer trademark Discord resta, tramite override.
9. Bump di `vite` a ≥ 8.3 e `@astrojs/mdx` a 8.0.1 per tutto il monorepo.
10. Dipendenza da un tema pre-1.0 con un solo maintainer: versione pinnata e patch da riapplicare a ogni aggiornamento.

**Consigliati / opzionali (default: disattivati per parità)** 11. Badge "New"/"Updated" in sidebar (Lotus li supporta; i campi `new`/`updated` esistono già nello schema ma non sono usati). 12. Gruppi sidebar collassabili (`collapsed`). 13. "Last updated" e "Contributors" in fondo alle pagine (Lotus li ricava da git). 14. Homepage con i blocchi `Hero`/`FeatureGrid`/`CTA` del tema invece del port fedele dell'attuale (consiglio: port fedele, blocchi solo se si vuole cambiare look). 15. Sostituire `Callout`/`Steps`/`Tabs` propri con quelli di `@prosefly/astro-components` (consiglio: no, i nostri hanno `persistKey` e integrazione framework). 16. Badge "Built with Lotus" nel footer (`credits: false` di default).

**Invariati**: switch framework React/Vue globale, demo live, toggle RTL per demo, `/create`, `/typeset`, `/colors`, `/blocks`, changelog, CopyPage con MCP e deep-link IDE, `llms.txt`/`llms-full.txt`, twin `.md` con espansione registry, OG image, sitemap, PWA, `dist/r` e `dist/vue/r`, `verify-dist.mjs`, `gen-component-docs.mjs`, i due test vitest, disclaimer trademark.

## Rischi

- Collisione rotte iniettate vs file: se lo spike non dà un esito deterministico, passare al vendoring (B).
- Patch che cresce a ogni release di Lotus; pinnare la versione, valutare B se supera 3 hunk.
- `@prosefly/astro-components` fa fetch a Iconify nel prerender: CI senza rete fallisce.
- Perdita di `hastHeadingId`: link pubblici con anchor espliciti da verificare uno per uno.
- Doppie istanze Vite/Tailwind/EC se non si rimuovono i duplicati.
- Tailwind Typography può toccare le demo: `not-prose` obbligatorio su ogni frame.

## Verifica (per l'implementazione)

`pnpm --filter docs build` (include `verify-dist.mjs`), `pnpm --filter docs preview` con controllo manuale di: `/`, `/docs`, `/docs/components/button` (switch framework, demo, RTL, CopyPage, TOC, prev/next), `/create`, `/typeset`, `/colors`, `/blocks`, `/404`, `/docs/components/button.md`, `/llms.txt`, `/docs/components/button/index.webp`, `/manifest.webmanifest`, ricerca ⌘K; poi `pnpm quality`, `pnpm knip`, `pnpm typecheck`, `pnpm test`.
