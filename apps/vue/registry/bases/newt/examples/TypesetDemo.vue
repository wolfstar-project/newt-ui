<script setup lang="ts">
import { Typeset } from "~~/registry/bases/newt/ui/typeset"
</script>

<template>
  <Typeset as="article" preset="docs" measure>
    <h2>Threads</h2>
    <p>
      A thread keeps a side conversation out of the channel it started in, and
      drops off the list once it goes quiet. Anyone who can read the parent
      channel can read the thread.
    </p>
    <ul>
      <li>Public threads inherit the channel's permissions.</li>
      <li>Private threads are invite-only.</li>
      <li>An archived thread reopens the moment somebody posts in it.</li>
    </ul>
    <blockquote>
      Archived is not deleted: the history stays searchable, and the first new
      message brings it back.
    </blockquote>
    <p>The <code>type</code> field is what tells the two apart.</p>
  </Typeset>
</template>
