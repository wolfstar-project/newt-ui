import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: "newt/ui — Next.js template",
  description:
    "Next.js 15 starter with Discord-native newt/ui components. Not affiliated with Discord Inc.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="newt-root min-h-screen bg-newt-bg-base text-newt-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
