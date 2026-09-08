# shadcn Codebase Structure Alignment

## Reference revisions

- `shadcn-ui/ui` `main`: `3ba91b1cc83e1bbe4ab35a422ff2a694849c5048`
- `unovue/shadcn-vue` `dev`: `dd3ff4ccbb46a15081e841570e51a5a2ace095cf`

## Goal

Align newt/ui's application registries and CLI package boundaries with the
current shadcn React and Vue repositories without duplicating newt/ui's docs
site or its multi-framework CLI.

## Target structure

```text
apps/
  docs/                         # shared Astro documentation site
  www/
    __registry__/               # generated React registry loaders
    registry.json               # generated shadcn registry manifest
    registry/
      bases/newt/{ui,blocks,examples}
      meta/                     # newt/ui source metadata
  vue/
    app/                        # Nuxt 4 application shell only
    __registry__/               # generated Vue registry loaders
    registry.json               # generated shadcn registry manifest
    registry/
      bases/newt/{ui,blocks,examples}
packages/
  cli/                          # the published `newtui` CLI
    src/
      commands/
      mcp/
      preflights/
      registry/{api,schema}.ts
      schema/
      utils/{get-config,transformers,updaters}/
deprecated/
  react-cli/                    # `@newtui/react` forwarding wrapper
  vue-cli/                      # `@newtui/vue` forwarding wrapper
```

The HTML/CSS registry remains packaged with `newtui` because `newtui-html`
ships those files to consumers. This is a product boundary, not application
source, and moving it would make the published CLI depend on an app artifact.

## Compatibility requirements

- Keep package names, executable names, registry URLs, and `components.json`
  compatibility stable.
- Keep one shared Astro docs application and one multi-framework CLI.
- Keep React on Tailwind 3 and Vue on Tailwind 4 as compatibility fixtures.
- Keep generated registry JSON paths valid for the CLI's import transformer.
- Preserve all component source and metadata while moving directories.
- Update contributor documentation and local skills to the canonical paths.
