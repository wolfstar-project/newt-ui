import { useEffect, useRef, type JSX } from "react"

import { typesetVariables, type TypesetParams } from "@/lib/typeset"

/*
 * The four places this library actually renders markdown. They are static
 * markup on purpose: Typeset styles what a renderer emits, so a preview that
 * added classes of its own would be flattering itself.
 */
export const SURFACES = ["message", "embed", "welcome", "article"] as const
export type Surface = (typeof SURFACES)[number]

export const SURFACE_LABELS = {
  message: "Message",
  embed: "Embed",
  welcome: "Channel welcome",
  article: "Docs article",
} as const satisfies Record<Surface, string>

function Message() {
  return (
    <>
      <p>
        Rolled the migration back — the failure was in the <code>threads</code>
        table, not in the deploy. Details in the thread.
      </p>
      <ul>
        <li>Archived threads kept their parent id.</li>
        <li>Private threads lost theirs, which is what broke the list.</li>
      </ul>
      <p>
        Fix is a one-line backfill. I will run it after standup unless somebody
        objects.
      </p>
    </>
  )
}

function Embed() {
  return (
    <>
      <h4>Release 2.4.0</h4>
      <p>
        Threads can now be created from the composer, and archived ones reopen
        on the first new message.
      </p>
      <blockquote>
        Breaking: <code>channel.threads.create</code> now requires a
        <code>type</code>.
      </blockquote>
    </>
  )
}

function Welcome() {
  return (
    <>
      <h2>Welcome to #release-notes</h2>
      <p>
        This is the start of the channel. It carries one message per release,
        and nothing else — questions belong in <a href="#">#support</a>.
      </p>
      <hr />
      <p>
        <strong>Pinned:</strong> how to read a version number, and what the
        three parts of one promise.
      </p>
    </>
  )
}

function Article() {
  return (
    <>
      <h2>Threads</h2>
      <p>
        A thread keeps a side conversation out of the channel it started in, and
        drops off the list once it goes quiet. Anyone who can read the parent
        channel can read the thread.
      </p>
      <h3>Starting one</h3>
      <p>
        Hover a message and choose <kbd>Create Thread</kbd>, or use the
        composer&apos;s thread button for one that is not attached to anything.
      </p>
      <pre>
        <code>{`await channel.threads.create({
  name: "release-notes",
  type: ChannelType.PublicThread,
})`}</code>
      </pre>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Visible to</th>
            <th>Archives after</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Public</td>
            <td>Everyone in the channel</td>
            <td>24 hours</td>
          </tr>
          <tr>
            <td>Private</td>
            <td>Invited members</td>
            <td>72 hours</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const CONTENT = {
  message: Message,
  embed: Embed,
  welcome: Welcome,
  article: Article,
} as const satisfies Record<Surface, () => JSX.Element>

export default function TypesetPreview({
  params,
  surface,
}: {
  readonly params: TypesetParams
  readonly surface: Surface
}) {
  const Content = CONTENT[surface]
  const ref = useRef<HTMLElement>(null)

  /*
   * The custom properties go on the wrapper, which is exactly what the CSS the
   * builder prints does — the preview is the output, not a rehearsal of it.
   */
  useEffect(() => {
    const node = ref.current
    if (node === null) return
    for (const { property, value } of typesetVariables(params)) {
      node.style.setProperty(property, value)
    }
    node.style.maxInlineSize = params.measure === "none" ? "" : params.measure
  }, [params])

  return (
    <article
      ref={ref}
      className={[
        "typeset",
        `typeset-${params.preset}`,
        params.measure === "none" ? undefined : "typeset-measure",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Content />
    </article>
  )
}
