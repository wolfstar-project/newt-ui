# Changelog

All notable changes to newt/ui are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — Unreleased

### Added

- Initial release: 43 components (button, badge, status indicator, avatar,
  embed, card, form fields, slash command tag, tabs, tooltip, modal, toast,
  code block, reaction pill, reply preview, typing indicator, progress bar,
  member list row, role tag, divider, mention chips, spoiler, voice channel
  row, attachment card, timeline, permission row, token field, dropdown menu,
  skeleton loader, empty state, context menu, server banner, keyboard
  shortcut tag, cooldown bar, pagination/load-more, stage banner, and the
  scrollbar utility).
- `tokens.css` — shared design token file (colors, radius, type, motion
  placeholders).
- `newt-ui` CLI (`init`, `add`, `list`) for copying components into a project,
  with dependency resolution (e.g. `status-indicator` pulls in `avatar`).
- Documentation/showcase site (`docs/index.html`) — single-file, no build
  step, with live previews and copy-to-clipboard markup for every component.
- `AGENT_GUIDE.md` — conventions and worked example for adding components.
- `DISCLAIMER.md` — Discord trademark/affiliation notice.
- jsDelivr CDN usage documented for both npm and GitHub sources.

### Changed

- Removed all CSS animations, transitions, and `@keyframes` — components now
  communicate state through static color/shape only (see `AGENT_GUIDE.md`
  §6).
- Docs page redesigned from a "fake Discord client" layout into a proper
  reference-manual layout (numbered sections, sticky sidebar nav, Discord-
  styled scrollbars).
