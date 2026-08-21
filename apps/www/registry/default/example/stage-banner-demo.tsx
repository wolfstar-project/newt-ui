import {
  StageBanner,
  StageBannerAction,
  StageBannerClose,
  StageBannerDot,
} from "@/registry/default/ui/stage-banner"

export default function StageBannerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <StageBanner>
        <StageBannerDot />
        Announcement text goes here.
        <StageBannerAction>Action</StageBannerAction>
      </StageBanner>

      <StageBanner variant="neutral">
        <StageBannerDot status="online" />
        Status message goes here.
        <StageBannerClose className="text-newt-text-muted hover:text-newt-text-primary" />
      </StageBanner>
    </div>
  )
}
