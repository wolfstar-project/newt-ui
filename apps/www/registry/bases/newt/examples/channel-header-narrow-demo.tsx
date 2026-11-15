import {
  ChannelHeader,
  ChannelHeaderBack,
  ChannelHeaderIcon,
  ChannelHeaderInfo,
  ChannelHeaderName,
  ChannelHeaderOnline,
  ChannelHeaderSearch,
  ChannelHeaderTitle,
  ChannelHeaderToolbar,
} from "@/registry/bases/newt/ui/channel-header"

export default function ChannelHeaderNarrowDemo() {
  return (
    <ChannelHeader className="w-full max-w-[360px]">
      <ChannelHeaderInfo>
        <ChannelHeaderBack aria-label="Back to channels, 3 unread" badge={3} />
        <ChannelHeaderTitle>
          <ChannelHeaderIcon />
          <ChannelHeaderName>general</ChannelHeaderName>
        </ChannelHeaderTitle>
      </ChannelHeaderInfo>

      <ChannelHeaderToolbar className="gap-3">
        <ChannelHeaderOnline>128 Online</ChannelHeaderOnline>
        <ChannelHeaderSearch compact />
      </ChannelHeaderToolbar>
    </ChannelHeader>
  )
}
