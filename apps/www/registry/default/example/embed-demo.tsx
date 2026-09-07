import {
  Embed,
  EmbedAuthor,
  EmbedAuthorIcon,
  EmbedAuthorName,
  EmbedDescription,
  EmbedEyebrow,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFields,
  EmbedFooter,
  EmbedFooterIcon,
  EmbedFooterSeparator,
  EmbedTimestamp,
  EmbedTitle,
} from "@/registry/default/ui/embed"

/* Inline so the demo never reaches out to the network for a placeholder. */
const ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%2323a55a'/%3E%3C/svg%3E"

export default function EmbedDemo() {
  return (
    <Embed color="#23a55a">
      <EmbedAuthor>
        <EmbedAuthorIcon src={ICON} />
        <EmbedAuthorName>Author name</EmbedAuthorName>
      </EmbedAuthor>
      <EmbedEyebrow>Source · category</EmbedEyebrow>
      <EmbedTitle>Embed title</EmbedTitle>
      <EmbedDescription>Embed description text goes here.</EmbedDescription>
      <EmbedFields>
        <EmbedField>
          <EmbedFieldName>Field</EmbedFieldName>
          <EmbedFieldValue>Value</EmbedFieldValue>
        </EmbedField>
      </EmbedFields>
      <EmbedFooter>
        <EmbedFooterIcon src={ICON} />
        <span>
          Footer text
          <EmbedFooterSeparator />
          <EmbedTimestamp date="2026-09-04T12:00:00.000Z" />
        </span>
      </EmbedFooter>
    </Embed>
  )
}
