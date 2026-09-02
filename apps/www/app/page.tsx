const DOCS_URL = "https://github.com/wolfstar-project/newt-ui"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 bg-newt-bg-base px-6 py-16">
      <h1 className="text-3xl font-bold text-newt-text-primary">newt/ui</h1>
      <p className="text-newt-text-secondary">
        This deployment only serves the React component registry under{" "}
        <code className="text-newt-text-primary">/r</code>, consumed by the{" "}
        <code className="text-newt-text-primary">@wolfstar/newt-ui</code> CLI.
      </p>
      <a
        className="text-newt-text-link underline underline-offset-4"
        href={DOCS_URL}
      >
        Read the documentation
      </a>
    </main>
  )
}
