import {
  Embed,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFields,
  EmbedFooter,
  EmbedTimestamp,
  EmbedTitle,
} from "@/registry/bases/newt/ui/embed"

const STATS = [
  { name: "Members", value: "1,204" },
  { name: "Online", value: "312" },
  { name: "Channels", value: "28" },
  { name: "Roles", value: "16" },
  { name: "Created", value: "March 2024" },
  { name: "Region", value: "Europe" },
]

/* The grid fits as many columns as the width allows and wraps the rest. */
export default function EmbedFieldsDemo() {
  return (
    <Embed>
      <EmbedTitle>Server overview</EmbedTitle>
      <EmbedFields>
        {STATS.map((stat) => (
          <EmbedField key={stat.name}>
            <EmbedFieldName>{stat.name}</EmbedFieldName>
            <EmbedFieldValue>{stat.value}</EmbedFieldValue>
          </EmbedField>
        ))}
      </EmbedFields>
      <EmbedFooter>
        <EmbedTimestamp date="2026-09-04T12:00:00.000Z" />
      </EmbedFooter>
    </Embed>
  )
}
