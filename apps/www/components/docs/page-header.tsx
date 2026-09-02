import { buttonVariants } from "@/registry/default/ui/button"
import { ui } from "@/registry/registry-ui"

const MANIFEST: [string, string, boolean?][] = [
  ["components", String(ui.length), true],
  ["dependencies", "0"],
  ["license", "Apache-2.0"],
  ["install", "npx @newtui/react"],
  ["tokens", "CSS vars"],
  ["frameworks", "React · Vue"],
]

export function PageHeader() {
  return (
    <header className="page-header" id="overview">
      <div className="page-header__main">
        <div className="page-header__eyebrow">
          <span>newt/ui</span>
          <span>·</span>
          <span>
            <b>v0.2.0</b>
          </span>
          <span>·</span>
          <span>early access</span>
        </div>
        <h1>
          <em>component spec —</em>Discord-styled UI, copy-pasted into your
          project.
        </h1>
        <p className="lead">
          A component library, design token system, and AI agent guide for
          building Discord-styled UI — bots, dashboards, and docs that look like
          they belong in the client. Built by WolfStar, the team behind{" "}
          <strong>newt-dsl</strong> and <strong>newt-trace</strong>.
        </p>
        <div className="page-header__cta">
          <a
            className={buttonVariants({ variant: "primary", size: "lg" })}
            href="#installation"
          >
            Get started
          </a>
          <a
            className={buttonVariants({ variant: "secondary", size: "lg" })}
            href="https://github.com/wolfstar-project/newt-ui"
          >
            View on GitHub
          </a>
        </div>
      </div>
      <div className="page-header__manifest">
        <div className="manifest__heading">package.json</div>
        {MANIFEST.map(([key, value, brand]) => (
          <div className="manifest__row" key={key}>
            <span className="manifest__key">{key}</span>
            <span
              className={`manifest__val${brand ? " manifest__val--brand" : ""}`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </header>
  )
}
