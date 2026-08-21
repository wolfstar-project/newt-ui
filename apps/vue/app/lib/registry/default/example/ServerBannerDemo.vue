<script setup lang="ts">
import { Button } from "@/lib/registry/default/ui/button"
import {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerMeta,
  ServerBannerMetaItem,
  ServerBannerName,
} from "@/lib/registry/default/ui/server-banner"
</script>

<template>
  <ServerBanner>
    <ServerBannerIcon>N</ServerBannerIcon>
    <ServerBannerInfo>
      <ServerBannerName>Server name</ServerBannerName>
      <ServerBannerMeta>
        <ServerBannerMetaItem status="online">142 Online</ServerBannerMetaItem>
        <ServerBannerMetaItem status="offline"
          >1,024 Members</ServerBannerMetaItem
        >
      </ServerBannerMeta>
    </ServerBannerInfo>
    <Button variant="primary">Join</Button>
  </ServerBanner>
</template>
