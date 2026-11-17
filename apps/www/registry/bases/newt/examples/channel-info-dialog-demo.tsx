"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  ChannelInfo,
  ChannelInfoAction,
  ChannelInfoEmpty,
  ChannelInfoEmptyBody,
  ChannelInfoEmptyTitle,
  ChannelInfoIcon,
  ChannelInfoIdentity,
  ChannelInfoName,
  ChannelInfoPanel,
  ChannelInfoToolbar,
  ChannelInfoType,
} from "@/registry/bases/newt/ui/channel-info"

export default function ChannelInfoDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative flex h-[320px] w-full max-w-sm items-center justify-center overflow-hidden rounded-md bg-newt-bg-elevated">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Channel details
      </Button>

      {open ? (
        <ChannelInfo
          modal
          label="Channel information for #general"
          onClose={() => setOpen(false)}
          className="absolute inset-0"
        >
          <ChannelInfoToolbar>
            <ChannelInfoAction
              aria-label="Back to channel"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                <path d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z" />
              </svg>
            </ChannelInfoAction>
          </ChannelInfoToolbar>

          <ChannelInfoIdentity>
            <ChannelInfoIcon />
            <div className="min-w-0">
              <ChannelInfoName>general</ChannelInfoName>
              <ChannelInfoType>Text Channel</ChannelInfoType>
            </div>
          </ChannelInfoIdentity>

          <ChannelInfoPanel>
            <ChannelInfoEmpty>
              <ChannelInfoEmptyTitle>
                No pinned messages yet.
              </ChannelInfoEmptyTitle>
              <ChannelInfoEmptyBody>
                Press Escape or the back arrow to return to the channel.
              </ChannelInfoEmptyBody>
            </ChannelInfoEmpty>
          </ChannelInfoPanel>
        </ChannelInfo>
      ) : null}
    </div>
  )
}
