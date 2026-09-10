"use client"

import * as React from "react"

/*
 * Every component is written with logical properties, so a right-to-left tree
 * needs no per-component override — only a `dir` attribute somewhere above it.
 * This is that attribute, plus the context a component reads when it has to
 * make a decision the CSS cannot: which side a popover flips to, which arrow
 * key advances a list.
 */
export type Direction = "ltr" | "rtl"

const DirectionContext = React.createContext<Direction>("ltr")

export interface DirectionProviderProps extends React.ComponentProps<"div"> {
  dir: Direction
}

const DirectionProvider = React.forwardRef<
  HTMLDivElement,
  DirectionProviderProps
>(({ dir, children, ...props }, ref) => (
  <DirectionContext.Provider value={dir}>
    <div ref={ref} dir={dir} {...props}>
      {children}
    </div>
  </DirectionContext.Provider>
))
DirectionProvider.displayName = "DirectionProvider"

/**
 * The direction the nearest provider set, or `"ltr"` when there is none — the
 * same default the document has.
 */
function useDirection(): Direction {
  return React.useContext(DirectionContext)
}

export { DirectionProvider, useDirection }
