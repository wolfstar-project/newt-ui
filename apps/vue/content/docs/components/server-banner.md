---
title: Server Banner
description: Invite-style card with a server icon, name, live member counts and a join button.
---

<ComponentPreview name="ServerBannerDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add server-banner
```

## Usage

```vue
<script setup lang="ts">
import {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerMeta,
  ServerBannerMetaItem,
  ServerBannerName,
} from "@/components/ui/server-banner"
import { Button } from "@/components/ui/button"
</script>

<template>
  <ServerBanner>
    <ServerBannerIcon>N</ServerBannerIcon>
    <ServerBannerInfo>
      <ServerBannerName>WolfStar</ServerBannerName>
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
```
