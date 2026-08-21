import { Button } from "@/registry/default/ui/button"
import {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerMeta,
  ServerBannerMetaItem,
  ServerBannerName,
} from "@/registry/default/ui/server-banner"

export default function ServerBannerDemo() {
  return (
    <ServerBanner>
      <ServerBannerIcon>N</ServerBannerIcon>
      <ServerBannerInfo>
        <ServerBannerName>Server name</ServerBannerName>
        <ServerBannerMeta>
          <ServerBannerMetaItem status="online">
            142 Online
          </ServerBannerMetaItem>
          <ServerBannerMetaItem status="offline">
            1,024 Members
          </ServerBannerMetaItem>
        </ServerBannerMeta>
      </ServerBannerInfo>
      <Button variant="primary">Join</Button>
    </ServerBanner>
  )
}
