import {
  ChannelWelcome,
  ChannelWelcomeAction,
  ChannelWelcomeDate,
  ChannelWelcomeDescription,
  ChannelWelcomeIcon,
  ChannelWelcomeTitle,
} from "@/registry/default/ui/channel-welcome"

export default function ChannelWelcomeDemo() {
  return (
    <ChannelWelcome>
      <ChannelWelcomeIcon />
      <ChannelWelcomeTitle>Welcome to #general!</ChannelWelcomeTitle>
      <ChannelWelcomeDescription>
        This is the start of the #general channel. Say hello and tell us what
        you are building.
      </ChannelWelcomeDescription>
      <ChannelWelcomeAction>
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
          <path d="m11.3 1.7 3 3-8.4 8.4-3.6.6.6-3.6 8.4-8.4Z" />
        </svg>
        Edit Channel
      </ChannelWelcomeAction>
      <ChannelWelcomeDate dateTime="2026-01-14">
        14 January 2026
      </ChannelWelcomeDate>
    </ChannelWelcome>
  )
}
