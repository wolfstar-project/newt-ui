import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/registry/bases/newt/ui/toast"

/*
 * `variant` only changes the icon: its colour and its glyph. `duration={0}`
 * keeps both on screen, and without a `ToastClose` nothing dismisses them.
 */
export default function ToastVariantsDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toast variant="success" duration={0}>
        <ToastIcon />
        <ToastContent>
          <ToastTitle>Changes saved</ToastTitle>
          <ToastDescription>
            Your server settings are up to date.
          </ToastDescription>
        </ToastContent>
      </Toast>
      <Toast variant="error" duration={0}>
        <ToastIcon />
        <ToastContent>
          <ToastTitle>Message not sent</ToastTitle>
          <ToastDescription>
            You are offline. It will send when you reconnect.
          </ToastDescription>
        </ToastContent>
      </Toast>
    </div>
  )
}
