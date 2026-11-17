import {
  AppLauncher,
  AppLauncherBack,
  AppLauncherBody,
  AppLauncherHeader,
  AppLauncherHeaderTitle,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherList,
  AppLauncherPromoCard,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
} from "@/registry/bases/newt/ui/app-launcher"

const ART =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5865f2"/><stop offset="1" stop-color="#eb459e"/>
      </linearGradient></defs>
      <rect width="160" height="90" fill="url(#g)"/>
      <path d="M80 22 56 31v21c0 15 10 25 24 30 14-5 24-15 24-30V31l-24-9Z" fill="#fff" fill-opacity=".85"/>
    </svg>`
  )

/* A wide logo: `fit="contain"` shows all of it in the square icon. */
const WIDE_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
      <rect width="120" height="40" rx="8" fill="#23a55a"/>
      <circle cx="20" cy="20" r="10" fill="#fff"/>
      <rect x="38" y="15" width="70" height="10" rx="5" fill="#fff"/>
    </svg>`
  )

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z" />
  </svg>
)

const Chevron = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="rtl:-scale-x-100">
    <path d="m7.3 4.3 5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3 1.4-1.4Z" />
  </svg>
)

export default function AppLauncherDrillInDemo() {
  return (
    <AppLauncher inline label="Moderation" className="h-[560px]">
      <AppLauncherHeader>
        <AppLauncherBack aria-label="Back">
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5 rtl:-scale-x-100"
            fill="currentColor"
          >
            <path d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z" />
          </svg>
        </AppLauncherBack>
        <AppLauncherHeaderTitle>Moderation</AppLauncherHeaderTitle>
        {/* As wide as the back control, so the title sits in the centre. */}
        <span aria-hidden="true" className="w-8 shrink-0" />
      </AppLauncherHeader>

      <AppLauncherBody>
        <AppLauncherPromoCard
          art={<img src={ART} alt="" />}
          footer={
            <>
              <AppLauncherItemIcon round>
                <ShieldIcon />
              </AppLauncherItemIcon>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-base font-medium">
                  Moderation
                </span>
                <span className="truncate text-sm text-newt-text-muted">
                  Keep every channel calm.
                </span>
              </span>
            </>
          }
        />

        <AppLauncherSection aria-label="Commands">
          <AppLauncherSectionHeader>
            <AppLauncherSectionTitle>Commands</AppLauncherSectionTitle>
          </AppLauncherSectionHeader>
          <AppLauncherList>
            <AppLauncherItem
              name="/ban"
              description="Remove a member from the server."
              trailing={<Chevron />}
            />
            <AppLauncherItem
              name="/timeout"
              description="Mute a member for a while."
              trailing={<Chevron />}
            />
          </AppLauncherList>
        </AppLauncherSection>

        <AppLauncherSection aria-label="More from this developer">
          <AppLauncherSectionHeader>
            <AppLauncherSectionTitle>
              More from this developer
            </AppLauncherSectionTitle>
          </AppLauncherSectionHeader>
          <AppLauncherList variant="grid">
            <AppLauncherItem
              variant="tile"
              name="Audit Log"
              icon={
                <AppLauncherItemIcon fit="contain">
                  <img src={WIDE_LOGO} alt="" />
                </AppLauncherItemIcon>
              }
            />
            <AppLauncherItem
              variant="tile"
              name="Shield"
              icon={
                <AppLauncherItemIcon round>
                  <ShieldIcon />
                </AppLauncherItemIcon>
              }
            />
            <AppLauncherItem
              variant="tile"
              name="Reminders"
              icon={
                <AppLauncherItemIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 4v5l4 2-1 1.7-5-2.7V7h2Z" />
                  </svg>
                </AppLauncherItemIcon>
              }
            />
          </AppLauncherList>
        </AppLauncherSection>
      </AppLauncherBody>
    </AppLauncher>
  )
}
