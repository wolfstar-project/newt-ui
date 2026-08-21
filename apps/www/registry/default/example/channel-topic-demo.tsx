import {
  ChannelTopic,
  ChannelTopicDescription,
  ChannelTopicDivider,
  ChannelTopicIcon,
  ChannelTopicName,
} from "@/registry/default/ui/channel-topic"

export default function ChannelTopicDemo() {
  return (
    <ChannelTopic className="w-full max-w-md">
      <ChannelTopicIcon />
      <ChannelTopicName>channel-name</ChannelTopicName>
      <ChannelTopicDivider />
      <ChannelTopicDescription>
        Channel topic description goes here
      </ChannelTopicDescription>
    </ChannelTopic>
  )
}
