export function SiteFooter() {
  return (
    <footer className="page-footer">
      <div className="page-footer__row">
        <span>newt/ui · MIT License · built by Newt Devs</span>
        <span>
          <a href="https://github.com/newt-devs">github.com/newt-devs</a> ·{" "}
          <a href="/#installation">CLI</a> · <a href="/#cdn">CDN</a> ·{" "}
          <a href="https://github.com/newt-devs/newt-ui/tree/main/apps/www/content/docs/installation">
            Setup guides
          </a>
        </span>
      </div>
      <p className="page-footer__disclaimer">
        newt/ui is an independent, open-source project built by Newt Devs. It is
        not affiliated with, endorsed by, or sponsored by Discord Inc.
        &quot;Discord&quot; and the Discord logo are trademarks of Discord Inc.;
        this project does not use or redistribute Discord&apos;s logos,
        wordmarks, or other copyrighted brand assets — its components are
        original CSS inspired by Discord&apos;s publicly observable visual
        style. See{" "}
        <a href="https://github.com/newt-devs/newt-ui/blob/main/DISCLAIMER.md">
          DISCLAIMER.md
        </a>{" "}
        for details.
      </p>
    </footer>
  )
}
