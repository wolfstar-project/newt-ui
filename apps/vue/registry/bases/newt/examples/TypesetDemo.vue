<script setup lang="ts">
/*
 * What a CommonMark + GFM renderer (remark-gfm, markdown-it, marked) emits for
 * a typical release note, element for element: Typeset never sees the source,
 * only the markup a renderer produced from it, and none of it carries a class.
 */
import { Typeset } from "~~/registry/bases/newt/ui/typeset"
</script>

<template>
  <Typeset as="article" preset="docs" measure>
    <h1>Release 2.4.0</h1>
    <p>
      Threads can now be started from the composer, and an archived one reopens
      on the first new message. The <code>threads</code> table gained a
      <strong>parent id</strong> for private threads, which <em>fixes</em> the
      list that <del>dropped them</del> lost them after a restart<sup
        ><a href="#typeset-demo-fn-1" id="typeset-demo-ref-1">1</a></sup
      >. See <a href="#typeset-demo">the migration guide</a> for the backfill.
    </p>
    <h2>Upgrading</h2>
    <blockquote>
      <p>
        Breaking: <code>channel.threads.create</code> now requires a
        <code>type</code>.
      </p>
    </blockquote>
    <ol>
      <li>Update the client.</li>
      <li>
        Run the backfill:
        <ul>
          <li>once per database,</li>
          <li>before the first deploy.</li>
        </ul>
      </li>
    </ol>
    <pre><code>await channel.threads.create({
  name: "release-notes",
  type: ChannelType.PublicThread,
})</code></pre>
    <h3>Checklist</h3>
    <ul>
      <li><input type="checkbox" checked disabled /> Backfill parent ids</li>
      <li><input type="checkbox" disabled /> Announce in the changelog</li>
    </ul>
    <table>
      <thead>
        <tr>
          <th>Thread</th>
          <th align="center">Visible to</th>
          <th align="right">Archives after</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Public</td>
          <td align="center">Everyone in the channel</td>
          <td align="right">24 h</td>
        </tr>
        <tr>
          <td>Private</td>
          <td align="center">Invited members</td>
          <td align="right">72 h</td>
        </tr>
      </tbody>
    </table>
    <section data-footnotes>
      <ol>
        <li id="typeset-demo-fn-1">
          <p>
            Only threads created before 2.3.0 were affected.
            <a href="#typeset-demo-ref-1" aria-label="Back to reference 1">↩</a>
          </p>
        </li>
      </ol>
    </section>
  </Typeset>
</template>
