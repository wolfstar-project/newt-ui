import {
  AppLauncher,
  AppLauncherBody,
  AppLauncherHandle,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherList,
  AppLauncherRecent,
  AppLauncherRecents,
  AppLauncherSearch,
  AppLauncherSearchInput,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
  AppLauncherViewMore,
} from "@/registry/bases/newt/ui/app-launcher"

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z" />
  </svg>
)

const BoardIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v12H8l-4 4V4Z" />
  </svg>
)

export default function AppLauncherDemo() {
  return (
    <AppLauncher aria-label="Apps" className="h-[420px]">
      <AppLauncherHandle />

      <AppLauncherSearch>
        <AppLauncherSearchInput
          placeholder="Search Apps & Commands"
          aria-label="Search apps and commands"
        />
      </AppLauncherSearch>

      <AppLauncherBody>
        <AppLauncherSection aria-label="Recents">
          <AppLauncherSectionHeader>
            <AppLauncherSectionTitle>Recents</AppLauncherSectionTitle>
            <AppLauncherViewMore>View More</AppLauncherViewMore>
          </AppLauncherSectionHeader>
          <AppLauncherRecents>
            <AppLauncherRecent aria-label="Moderation">
              <ShieldIcon />
            </AppLauncherRecent>
            <AppLauncherRecent aria-label="Poll Night">
              <BoardIcon />
            </AppLauncherRecent>
          </AppLauncherRecents>
        </AppLauncherSection>

        <AppLauncherSection aria-label="Apps in this server">
          <AppLauncherSectionHeader>
            <AppLauncherSectionTitle>
              Apps in this Server
            </AppLauncherSectionTitle>
            <AppLauncherViewMore>View More</AppLauncherViewMore>
          </AppLauncherSectionHeader>
          <AppLauncherList>
            <AppLauncherItem
              name="Moderation"
              description="Bans, timeouts and audit logs."
              icon={
                <AppLauncherItemIcon round>
                  <ShieldIcon />
                </AppLauncherItemIcon>
              }
            />
            <AppLauncherItem
              promoted
              name="Poll Night"
              description="Run a quick poll in any channel."
              icon={
                <AppLauncherItemIcon>
                  <BoardIcon />
                </AppLauncherItemIcon>
              }
            />
          </AppLauncherList>
        </AppLauncherSection>
      </AppLauncherBody>
    </AppLauncher>
  )
}
