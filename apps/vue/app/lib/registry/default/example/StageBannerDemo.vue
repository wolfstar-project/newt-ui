<script setup lang="ts">
import {
  StageBanner,
  StageBannerAction,
  StageBannerClose,
  StageBannerDot,
} from "@/lib/registry/default/ui/stage-banner"
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <StageBanner>
      <StageBannerDot />
      Announcement text goes here.
      <StageBannerAction>Action</StageBannerAction>
    </StageBanner>

    <StageBanner variant="neutral">
      <StageBannerDot status="online" />
      Status message goes here.
      <StageBannerClose
        class="text-newt-text-muted hover:text-newt-text-primary"
      />
    </StageBanner>
  </div>
</template>
