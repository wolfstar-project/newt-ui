# next-template

A minimal [Next.js 15](https://nextjs.org) + React 19 starter preconfigured with
[newt/ui](https://wolfstar-project.github.io/newt-ui) — Discord-native components you
copy into your project.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## What's already set up

- `app/globals.css` — the `--newt-*` design tokens inside `@layer base`.
- `tailwind.config.ts` — the `newtPreset`, so `bg-newt-bg-surface`,
  `text-newt-text-primary`, `shadow-elevation-low`, `ease-newt` … all resolve to tokens.
- `components.json` — the newt/ui CLI config (`ui` -> `@/components/ui`,
  `utils` -> `@/lib/utils`).
- `lib/utils.ts` — the `cn()` helper (clsx + tailwind-merge).

## Adding components

```bash
npx @newtui/react add button
npx @newtui/react list
npx @newtui/react diff button
```

Components land in `components/ui/` and are yours to edit.

```tsx
import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button variant="primary">Send</Button>
}
```

## Scripts

| Script           | Description                |
| ---------------- | -------------------------- |
| `pnpm dev`       | Start the dev server       |
| `pnpm build`     | Production build           |
| `pnpm start`     | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit`             |

newt/ui is an independent project and is not affiliated with Discord Inc.
