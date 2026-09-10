import {
  Section,
  SectionAccessory,
  SectionContent,
  SectionHeading,
  SectionThumbnail,
} from "@/registry/bases/newt/ui/section"

/*
 * Drawn as a data URI rather than fetched: a demo that needs the network is a
 * demo that fails offline, and the thumbnail only has to be a thumbnail.
 */
const COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 86">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5865f2"/><stop offset="1" stop-color="#eb459e"/>
      </linearGradient></defs>
      <rect width="86" height="86" fill="url(#g)"/>
    </svg>`
  )

export default function SectionDemo() {
  return (
    <Section className="max-w-[520px]">
      <SectionContent>
        <SectionHeading>Release 7.3</SectionHeading>
        <p>
          The update is out. Chests open on the first try, the servers hold at
          peak hours, and gravity only changes on Thursdays.
        </p>
      </SectionContent>
      <SectionAccessory>
        <SectionThumbnail src={COVER} alt="Release artwork" />
      </SectionAccessory>
    </Section>
  )
}
