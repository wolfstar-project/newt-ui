import { Spoiler } from "@/registry/bases/newt/ui/spoiler"
import { Typeset } from "@/registry/bases/newt/ui/typeset"

/*
 * One of every element a chat markdown parser emits, because that is what the
 * component has to survive: Typeset never sees the source, only the markup a
 * renderer produced from it.
 */
export default function TypesetDemo() {
  return (
    <Typeset as="article" preset="docs" measure>
      <h1>Heading one</h1>
      <h2>Heading two</h2>
      <h3>Heading three</h3>
      <p>
        A message body is <strong>bold</strong>, <em>italic</em>,{" "}
        <u>underlined</u>, <s>struck through</s>, and carries{" "}
        <code>inline code</code>. Links are{" "}
        <a href="#typeset-demo">written with a label</a> or pasted bare.
      </p>
      <p>
        The marks nest, so{" "}
        <strong>
          <em>bold italics</em>
        </strong>
        ,{" "}
        <u>
          <strong>underlined bold</strong>
        </u>{" "}
        and{" "}
        <u>
          <strong>
            <em>all three at once</em>
          </strong>
        </u>{" "}
        each arrive as elements inside elements.
      </p>
      <p>
        <code>||spoiler||</code> is not text styling — it is interface, so it
        stays a component rather than a class: <Spoiler>hidden text</Spoiler>{" "}
        until it is clicked.
      </p>
      <blockquote>
        <p>One chevron quotes a single line.</p>
        <p>
          Three of them quote everything after, to the end of the message — so a
          quote is a block of paragraphs, not one long line.
        </p>
      </blockquote>
      <ul>
        <li>A dash, an asterisk or a plus opens a bullet.</li>
        <li>
          A number and a dot open an ordered list:
          <ol>
            <li>which nests</li>
            <li>and keeps its own counter</li>
          </ol>
        </li>
      </ul>
      <pre>
        <code>{`const thread = await message.startThread({
  name: "release-notes",
})`}</code>
      </pre>
      <small>
        Subtext is the aside under a message: smaller, quieter, same rhythm.
      </small>
    </Typeset>
  )
}
