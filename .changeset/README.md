# Releasing with Changesets

newt/ui uses [`@changesets/cli`](https://github.com/changesets/changesets) for
monorepo releases. Each published package — `newtui` (the CLI),
`@newtui/nuxt` (the Nuxt module), and the `@newtui/react` / `@newtui/vue`
deprecation wrappers — is versioned independently according to the changesets
included in each release.

---

## Development workflow: adding a changeset

Every pull request that changes publishable package code (`packages/*`)
**must** include a changeset file.

```sh
pnpm changeset
```

The interactive CLI will ask:

1. Which packages are affected
2. Bump type: `patch` / `minor` / `major`
3. A short summary for the changelog

This creates a `.changeset/<random-slug>.md` file. Commit it alongside your
code changes.

If a change does not need a release (docs, CI-only, etc.), run:

```sh
pnpm changeset add --empty
```

---

## One-time setup (required before first release)

### 1. Allow GitHub Actions to create pull requests

Under **Settings → Actions → General → Workflow permissions**, enable
**Allow GitHub Actions to create and approve pull requests**.

Without this, `changesets/action` fails when it attempts to open the release
PR.

### 2. Configure secrets

Repository secrets (**Settings → Secrets and variables → Actions**):

| Secret           | Description                                                                                                                                                                                                        |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WOLFSTAR_TOKEN` | A GitHub PAT with `repo` and `workflow` scopes. Used by `changesets/action` to push commits and open PRs (the default `GITHUB_TOKEN` does not trigger other workflows). Also required by the `@next` snapshot job. |

npm publishing does **not** use a secret. `changeset publish` shells out to
`pnpm publish` (the repo's `packageManager` is pnpm), which authenticates via
its own [OIDC trusted-publishing](https://docs.npmjs.com/trusted-publishers/)
exchange: the `id-token: write` permission lets it verify the workflow's
identity directly, so there's no long-lived npm token to leak or rotate. This
requires pnpm >= 11.1.3, which fixed pnpm sending an unresolved
`${NODE_AUTH_TOKEN}` `.npmrc` placeholder literally instead of falling back to
OIDC ([pnpm/pnpm#11526](https://github.com/pnpm/pnpm/pull/11526)) — the
pinned `packageManager` version here is well above that.

For each published package (`newtui`, `@newtui/nuxt`, `@newtui/react`,
`@newtui/vue`), configure a trusted publisher once at
`https://www.npmjs.com/package/<name>/access` → **Publishing access** →
**Add GitHub Actions**:

- Owner: `wolfstar-project`
- Repository: `newt-ui`
- Workflow file: `release.yml`
- Environment: _(leave empty — this workflow doesn't use a GitHub Environment)_

An old `NPM_PUBLISH_TOKEN` secret, if still present from before trusted
publishing was set up, is unused now and can be removed from repo secrets.

### 3. Install the autofix.ci GitHub App (optional)

`.github/workflows/autofix.yml` uses the [autofix.ci](https://autofix.ci)
GitHub App to push lint/format fixes back to PR branches. Install it at
<https://github.com/apps/autofix-ci>.

---

## Release runbook

### Cutting a stable release

1. Merge one or more PRs that include changeset files.
2. The `release` job in `.github/workflows/release.yml` automatically creates
   or updates a **"chore: update changelog and release"** PR. This PR bumps
   affected package versions and updates CHANGELOGs.
3. Review the PR and optionally edit the changelog entries.
4. Merge the PR. `changesets/action` publishes the bumped packages to npm
   automatically with provenance attestation and creates GitHub Releases.

Only packages with pending changesets are versioned and published.

### Local release scripts

| Script                      | Purpose                                           |
| :-------------------------- | :------------------------------------------------ |
| `pnpm changeset`            | Add a changeset file (`changeset add`)            |
| `pnpm run publish:snapshot` | Publish a `@next` snapshot (CI uses this)         |
| `pnpm run publish`          | Version, build, and publish to npm (CI uses this) |

### Recovering a failed publish

If the automatic publish step in `release.yml` fails after the release PR is
merged:

1. Fix the underlying issue (trusted publisher misconfiguration, network, build failure, etc.).
2. Re-run the failed **Create Release PR or Publish** job from **Actions**, or
   trigger **release** manually via **Run workflow** on `main`.
3. The job runs `pnpm run publish` (builds only `packages/*`, then
   `changeset publish`).
   `changeset publish` is idempotent and skips packages already published at
   the current version.

Use this only when versions on `main` are already bumped and you need to
retry npm publish. It does not create or update the release PR.

### Canary (`@next`) channel

The `snapshot` job in `release.yml` publishes affected packages under the
dist-tag `next` whenever `main` receives a push that changes `packages/` or
root `package.json`. Version bumps use Changesets snapshots via
`pnpm run publish:snapshot`: the base is the version the pending changesets
would bump to, suffixed with the `next` tag — for example
`0.3.0-next-20260821120000`. Only packages with pending changesets enter the
snapshot release plan; a push with no changesets publishes nothing.

Snapshot publish is skipped when the push commit message contains
`chore: version packages` or `chore: update changelog and release` (the
release PR merge commit), and also when there are no pending changesets to
snapshot — `changeset version` exits with code `1` in that case since
Changesets v3, so `scripts/publish-snapshot.mjs` checks for pending
changesets first and exits cleanly instead of failing the job.

No manual action is needed. Consumers can install the latest canary via:

```sh
pnpm add newtui@next
```

---

## Version policy

- Each package has its own semver. Select only the packages you changed when
  running `pnpm changeset`.
- **Do not edit `package.json#version` by hand.** The release PR owns version
  bumps.
- Bump type is set explicitly in each changeset file added during
  development:
  - `patch` — bug fixes, dependency updates
  - `minor` — new features (backwards compatible)
  - `major` — breaking changes
