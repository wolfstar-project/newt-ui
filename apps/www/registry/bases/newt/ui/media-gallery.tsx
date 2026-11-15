import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * One to ten images in a mosaic. The layout is decided by how many there are,
 * not by what each one is: two side by side, three as one large and two
 * stacked, more than that in a grid. The count drives it because that is the
 * only thing the gallery knows before the images load.
 */
function layoutFor(count: number): string {
  if (count <= 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  /* Three: the first takes the full height beside a stacked pair. */
  if (count === 3) return "grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2"
  if (count === 4) return "grid-cols-2"
  return "grid-cols-3"
}

export interface MediaGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * How many items the grid holds. Counted from the children when it is not
   * given, which is what a static list wants.
   */
  count?: number
}

const MediaGallery = React.forwardRef<HTMLDivElement, MediaGalleryProps>(
  ({ className, count, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid max-w-[550px] auto-rows-[1fr] gap-1 overflow-hidden rounded-[var(--newt-radius-lg)]",
        layoutFor(count ?? React.Children.count(children)),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
MediaGallery.displayName = "MediaGallery"

/*
 * The props of the element or component `as` names, so a custom image
 * component's own props type-check.
 */
export type MediaGalleryItemProps<E extends React.ElementType = "img"> = {
  /**
   * The image element or component to render. Defaults to `img`; pass your
   * framework's image component for optimised sources. It receives `src`,
   * `alt`, `className` and the spoiler attributes and handlers.
   */
  as?: E
  /** Blurs the image until it is clicked. */
  spoiler?: boolean
} & Omit<React.ComponentPropsWithRef<E>, "as" | "spoiler">

type MediaGalleryItemComponent = {
  <E extends React.ElementType = "img">(
    props: MediaGalleryItemProps<E>
  ): React.ReactNode
  displayName?: string
}

/*
 * SAFETY: `forwardRef` drops the generic signature. The render hands every
 * prop it does not set itself to `as` unchanged, so the props of `as` are
 * the props the part receives.
 */
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- see SAFETY
const MediaGalleryItem = React.forwardRef<
  HTMLImageElement,
  MediaGalleryItemProps
>(
  (
    { as: Tag = "img", className, spoiler = false, alt = "", ...props },
    ref
  ) => {
    const [revealed, setRevealed] = React.useState(false)
    const hidden = spoiler && !revealed

    return (
      <Tag
        ref={ref}
        alt={alt}
        data-spoiler={hidden || undefined}
        role={hidden ? "button" : undefined}
        tabIndex={hidden ? 0 : undefined}
        aria-label={hidden ? "Spoiler, click to reveal" : undefined}
        onClick={() => setRevealed(true)}
        onKeyDown={(event: React.KeyboardEvent<HTMLImageElement>) => {
          if (!hidden) return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setRevealed(true)
          }
        }}
        /*
         * `object-cover` on a stretched cell: the mosaic keeps its shape whatever
         * aspect ratio arrives, which is the point of a mosaic.
         */
        className={cn(
          "h-full w-full object-cover",
          hidden && "cursor-pointer blur-lg",
          className
        )}
        {...props}
      />
    )
  }
) as MediaGalleryItemComponent
MediaGalleryItem.displayName = "MediaGalleryItem"

export { MediaGallery, MediaGalleryItem }
