import {
  AppInvite,
  AppInviteBanner,
  AppInviteBody,
  AppInviteDescription,
  AppInviteHeader,
  AppInviteIcon,
  AppInviteInfo,
  AppInviteName,
} from "@/registry/bases/newt/ui/app-invite"
import { Button } from "@/registry/bases/newt/ui/button"

/* Inline so the demo never reaches out to the network for a placeholder. */
const APP_BANNER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 432 144'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%235865f2'/%3E%3Cstop offset='1' stop-color='%2323a55a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='432' height='144' fill='url(%23g)'/%3E%3C/svg%3E"
const APP_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='16' fill='%2323a55a'/%3E%3Ccircle cx='40' cy='40' r='18' fill='%23ffffff' fill-opacity='.85'/%3E%3C/svg%3E"

export default function AppInviteDemo() {
  return (
    <AppInvite aria-labelledby="app-invite-demo-name">
      <AppInviteBanner src={APP_BANNER} />
      <AppInviteBody>
        <AppInviteHeader>
          <AppInviteIcon src={APP_ICON} />
          <AppInviteInfo>
            <AppInviteName id="app-invite-demo-name" href="#">
              Newt Helper
            </AppInviteName>
            <AppInviteDescription>
              Moderation, reminders and slash commands for your server.
            </AppInviteDescription>
          </AppInviteInfo>
        </AppInviteHeader>
        <Button variant="secondary" href="#" className="w-full">
          Learn More
        </Button>
      </AppInviteBody>
    </AppInvite>
  )
}
