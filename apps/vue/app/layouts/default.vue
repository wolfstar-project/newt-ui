<script setup lang="ts">
import SideNav from "@/components/docs/SideNav.vue"
import SiteFooter from "@/components/docs/SiteFooter.vue"
</script>

<template>
  <div class="layout">
    <SideNav />
    <div class="main">
      <slot />
      <SiteFooter />
    </div>
  </div>
</template>
