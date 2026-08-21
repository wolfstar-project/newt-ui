---
name: newt-ui-trademark
description: Use when writing copy, naming things, adding assets, or describing newt/ui anywhere — docs, README, component text, demos, or package metadata.
---

# newt/ui trademark boundaries

newt/ui is visually inspired by Discord's client and is **not affiliated with,
endorsed by, or sponsored by Discord Inc.** `DISCLAIMER.md` is the binding
document; these are the rules it implies, and they are enforced in every
component, doc page, example, and published package.

## Invariants

- No Discord logos, wordmarks, icons, or brand assets — not in the repository,
  not fetched at runtime, not reproduced as CSS or SVG paths.
- No copyrighted Discord assets of any kind: emoji sets, sounds, fonts,
  screenshots, illustrations, or copied product copy.
- Colours and layout metrics are derived from the publicly observable visual
  style and live as our own `--newt-*` tokens. That is the whole of the
  relationship.
- Framing is always "Discord-inspired" or "Discord-styled", never "Discord's",
  "official", "for Discord", or anything implying a partnership.
- The disclaimer stays reachable: linked from the README, the docs footer, and
  kept in the published package files.
- Package names, npm keywords, domains, and social handles do not present the
  project as a Discord product.
- Demo content uses placeholder names (`username`, `Shard 3`, generic servers),
  never real Discord users, servers, or trademarks.

## Review workflow

1. Grep the diff for `discord` (case-insensitive) and read every hit in
   context.
2. For each hit, decide: is this describing inspiration, or claiming
   association? Rewrite the second kind.
3. Check any added asset for provenance. If you cannot name where it came
   from, do not ship it.
4. Confirm the disclaimer link still resolves from wherever you added copy.
