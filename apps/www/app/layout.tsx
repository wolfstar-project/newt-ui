import "@/styles/globals.css"
import "@/styles/docs.css"
import type { Metadata } from "next"

import { SiteFooter } from "@/components/docs/site-footer"
import { SiteNav } from "@/components/docs/site-nav"

export const metadata: Metadata = {
  title: "newt/ui — Discord-native components",
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
      <body className="newt-root">
        <div className="layout">
          <SiteNav />
          <div className="main">
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  )
}
