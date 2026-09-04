# @newtui/react

> **Deprecated.** The React and Vue CLIs were merged into a single unscoped package: [`newtui`](https://www.npmjs.com/package/newtui).

This package now only ships a wrapper that forwards to `newtui`, so existing scripts keep working. It will be removed in the next major.

```bash
npx newtui init      # instead of npx @newtui/react init
npx newtui add button
```

`newtui` detects React projects and records `framework: "react"` in `components.json`. An existing config written by this CLI is migrated automatically — see the [`newtui` README](../newtui/README.md).
