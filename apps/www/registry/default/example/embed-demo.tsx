import {
  Embed,
  EmbedDescription,
  EmbedEyebrow,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFields,
  EmbedFooter,
  EmbedTitle,
} from "@/registry/default/ui/embed"

export default function EmbedDemo() {
  return (
    <Embed>
      <EmbedEyebrow>Source · category</EmbedEyebrow>
      <EmbedTitle>Embed title</EmbedTitle>
      <EmbedDescription>Embed description text goes here.</EmbedDescription>
      <EmbedFields>
        <EmbedField>
          <EmbedFieldName>Field</EmbedFieldName>
          <EmbedFieldValue>Value</EmbedFieldValue>
        </EmbedField>
      </EmbedFields>
      <EmbedFooter>Footer text · Just now</EmbedFooter>
    </Embed>
  )
}
