<script setup lang="ts">
import {
  MediaGallery,
  MediaGalleryItem,
} from "~~/registry/bases/newt/ui/media-gallery"

/* Drawn rather than fetched, so the demo holds up offline. */
function tile(from: string, to: string): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
        </linearGradient></defs>
        <rect width="200" height="200" fill="url(#g)"/>
      </svg>`
    )
  )
}
</script>

<template>
  <MediaGallery class="h-[220px]" :count="3">
    <MediaGalleryItem
      :src="tile('#5865f2', '#1e1f22')"
      alt="The yard at noon"
    />
    <MediaGalleryItem :src="tile('#23a55a', '#1e1f22')" alt="The roof line" />
    <MediaGalleryItem :src="tile('#eb459e', '#1e1f22')" alt="The skyline" />
  </MediaGallery>
</template>
