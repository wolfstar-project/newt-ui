import { SlashCommand } from "@/registry/bases/newt/ui/slash-command"

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
      <SlashCommand
        name="conf"
        subcommandGroup="menu"
        subcommand="save"
        options={[{ name: "key", value: "prefix" }]}
      />
      <SlashCommand name="remind" options={[{ name: "in", value: "10m" }]}>
        <span className="text-newt-text-muted">sends in this channel</span>
      </SlashCommand>
    </div>
  )
}
