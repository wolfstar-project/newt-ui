import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A block of text with one thing beside it: a thumbnail, or a button. That
 * pairing is the whole component — the text column takes the space that is
 * left, and the accessory keeps its own width whatever the text does.
 */
const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full items-start gap-4", className)}
    {...props}
  />
))
Section.displayName = "Section"

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 flex-1 flex-col gap-2 text-[15px] leading-[1.375] text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
SectionContent.displayName = "SectionContent"

const SectionHeading = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-display text-xl font-bold leading-tight text-newt-text-primary",
      className
    )}
    {...props}
  />
))
SectionHeading.displayName = "SectionHeading"

/*
 * The accessory never shrinks and never stretches: it is the fixed side of
 * the pair, which is what keeps a long paragraph from squeezing a thumbnail
 * into a sliver.
 */
const SectionAccessory = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 items-start", className)}
    {...props}
  />
))
SectionAccessory.displayName = "SectionAccessory"

export interface SectionThumbnailProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Marks the image as a spoiler: blurred until clicked, the same treatment
   * a spoilered attachment gets.
   */
  spoiler?: boolean
}

const SectionThumbnail = React.forwardRef<
  HTMLImageElement,
  SectionThumbnailProps
>(({ className, spoiler = false, alt = "", ...props }, ref) => {
  const [revealed, setRevealed] = React.useState(false)
  const hidden = spoiler && !revealed

  return (
    <img
      ref={ref}
      alt={alt}
      data-spoiler={hidden || undefined}
      /*
       * A spoilered thumbnail is a button until it is opened: it takes a
       * click and a key, and says what it is to a screen reader.
       */
      role={hidden ? "button" : undefined}
      tabIndex={hidden ? 0 : undefined}
      aria-label={hidden ? "Spoiler, click to reveal" : undefined}
      onClick={() => setRevealed(true)}
      onKeyDown={(event) => {
        if (!hidden) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          setRevealed(true)
        }
      }}
      className={cn(
        "h-[86px] w-[86px] rounded-lg object-cover",
        hidden && "cursor-pointer blur-lg",
        className
      )}
      {...props}
    />
  )
})
SectionThumbnail.displayName = "SectionThumbnail"

export {
  Section,
  SectionAccessory,
  SectionContent,
  SectionHeading,
  SectionThumbnail,
}
