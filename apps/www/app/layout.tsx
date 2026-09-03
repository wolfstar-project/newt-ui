import "@/styles/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "newt/ui — Discord-inspired components",
  description:
    "Copy-paste Discord-inspired UI components for React. Not affiliated with Discord Inc.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="newt-root">{children}</body>
    </html>
  )
}
