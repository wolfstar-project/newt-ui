export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-bold">Hello from newt/ui</h1>
      <p className="mt-3 text-newt-text-secondary">
        This project is preconfigured with the newt/ui design tokens and
        Tailwind preset. Add components with{" "}
        <code className="font-mono text-newt-text-link">
          npx newtui add button
        </code>
        .
      </p>
      <div className="mt-10 rounded-md bg-newt-bg-surface p-6 shadow-elevation-low">
        <p className="text-sm text-newt-text-muted">
          Every utility below maps to a --newt-* token.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-sm bg-newt-brand px-4 py-2 text-sm font-medium text-white">
            brand
          </span>
          <span className="rounded-sm bg-newt-bg-elevated px-4 py-2 text-sm text-newt-text-primary">
            elevated
          </span>
          <span className="rounded-sm bg-newt-online px-4 py-2 text-sm text-white">
            online
          </span>
          <span className="rounded-sm bg-newt-danger px-4 py-2 text-sm text-white">
            danger
          </span>
        </div>
      </div>
      <p className="mt-10 text-xs text-newt-text-muted">
        newt/ui is an independent project and is not affiliated with Discord
        Inc.
      </p>
    </main>
  )
}
