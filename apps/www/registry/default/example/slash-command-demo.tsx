import { SlashCommand } from "@/registry/default/ui/slash-command"

export default function SlashCommandDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <SlashCommand name="command" />
      <SlashCommand
        name="ban"
        subcommand="member"
        options={[
          { name: "user", value: "@username" },
          {
            name: "reason",
            description: "why they were banned",
            focused: true,
          },
        ]}
      />
    </div>
  )
}
