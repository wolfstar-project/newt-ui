import { Avatar } from "@/registry/default/ui/avatar"
import {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMember,
  VoiceChannelMemberIcons,
  VoiceChannelMembers,
} from "@/registry/default/ui/voice-channel"

export default function VoiceChannelDemo() {
  return (
    <VoiceChannel className="w-60">
      <VoiceChannelHeader>
        <VoiceChannelIcon>🔊</VoiceChannelIcon>
        Channel name
      </VoiceChannelHeader>
      <VoiceChannelMembers>
        <VoiceChannelMember>
          <Avatar size="sm">A</Avatar>
          username
          <VoiceChannelMemberIcons>🎙️</VoiceChannelMemberIcons>
        </VoiceChannelMember>
      </VoiceChannelMembers>
    </VoiceChannel>
  )
}
