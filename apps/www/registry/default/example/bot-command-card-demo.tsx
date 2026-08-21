import { Badge } from "@/registry/default/ui/badge"
import {
  BotCommandCard,
  BotCommandCardDescription,
  BotCommandCardHeader,
  BotCommandCardName,
  BotCommandCardOption,
  BotCommandCardOptions,
} from "@/registry/default/ui/bot-command-card"

export default function BotCommandCardDemo() {
  return (
    <BotCommandCard className="w-full">
      <BotCommandCardHeader>
        <BotCommandCardName>command</BotCommandCardName>
        <Badge variant="brand">bot-name</Badge>
      </BotCommandCardHeader>
      <BotCommandCardDescription>
        Command description goes here.
      </BotCommandCardDescription>
      <BotCommandCardOptions>
        <BotCommandCardOption
          name="option"
          type="STRING"
          required
          description="Option description"
        />
        <BotCommandCardOption
          name="user"
          type="USER"
          description="Member to target"
        />
      </BotCommandCardOptions>
    </BotCommandCard>
  )
}
