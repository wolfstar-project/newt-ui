"use client"

import { Select as SelectPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface SelectMenuOption {
  value: string
  label: string
  /** Secondary line under the label. */
  description?: string
  /**
   * Rendered before the label, in the row and on the trigger once chosen —
   * what the client's device pickers use to tell a microphone from a monitor
   * at a glance. Sized by the menu, so pass the glyph and nothing else.
   */
  icon?: React.ReactNode
  /**
   * A unicode emoji drawn in the place of `icon`, for an option that has no
   * node to pass. `icon` wins when an option carries both.
   */
  emoji?: string
  /**
   * A muted aside after the label on the trigger, for what the option resolves
   * to. It is the first thing allowed to truncate.
   */
  note?: string
  disabled?: boolean
}

/**
 * What a select attached to a message may carry. The platform rejects a
 * payload with more, so a menu that rendered them would be showing something
 * that cannot exist.
 */
export const SELECT_MENU_MAX_OPTIONS = 25

/**
 * Where the menu is: in a message, or in a settings panel. The two are not the
 * same control — a message select caps its list, shows the scrollbar it needs
 * to say the list continues, and marks nothing as chosen, because the choice
 * is submitted rather than kept. A settings select has no cap and keeps a tick
 * against the row that is in force.
 */
export type SelectMenuVariant = "settings" | "message"

/**
 * The side of the trigger the panel opens on. The panel flips to the opposite
 * side when the preferred one has no room.
 */
export type SelectMenuSide = "top" | "right" | "bottom" | "left"

/** How the panel lines up with the trigger along its side. */
export type SelectMenuAlign = "start" | "center" | "end"

/** What a row render prop is told about the option it draws. */
export interface SelectMenuItemState {
  index: number
  selected: boolean
}

export interface SelectMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue"
> {
  options: readonly SelectMenuOption[]
  variant?: SelectMenuVariant
  /** Controlled selection. Leave undefined to let the menu own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** Accessible name of the trigger and the listbox. */
  label?: string
  /**
   * The element the panel is portalled into. Defaults to `document.body`;
   * pass the enclosing native `<dialog>` or a themed wrapper to keep it there.
   */
  container?: React.ComponentProps<typeof SelectPrimitive.Portal>["container"]
  /**
   * The side of the trigger the panel opens on. It flips to the opposite side
   * when the preferred one has no room.
   */
  side?: SelectMenuSide
  /** How the panel lines up with the trigger along that side. */
  align?: SelectMenuAlign
  /** Classes merged onto the trigger button, to size or restyle it. */
  triggerClassName?: string
  /** Classes merged onto the panel. */
  contentClassName?: string
  /**
   * Replaces what a row draws: the icon or emoji, the label and the
   * description. The row itself and its tick stay the menu's. The Vue port
   * takes the same content through its `#item` slot.
   */
  renderItem?: (
    option: SelectMenuOption,
    state: SelectMenuItemState
  ) => React.ReactNode
  /**
   * Replaces the text of the description of an option that has one. The Vue
   * port takes the same content through its `#item-description` slot.
   */
  renderItemDescription?: (
    option: SelectMenuOption,
    state: SelectMenuItemState
  ) => React.ReactNode
}

/*
 * Radix Select owns the behaviour: open state, Escape and outside press, focus
 * moving through the rows and back to the trigger, typeahead, and
 * collision-aware placement. Only the look, the option model and the cap are
 * newt/ui's.
 */
const SelectMenu = React.forwardRef<HTMLDivElement, SelectMenuProps>(
  (
    {
      className,
      options: given,
      variant = "settings",
      value,
      defaultValue,
      onValueChange,
      placeholder = "Make a selection",
      disabled = false,
      label = "Select an option",
      container,
      side = "bottom",
      align = "start",
      triggerClassName,
      contentClassName,
      renderItem,
      renderItemDescription,
      ...props
    },
    ref
  ) => {
    /*
     * The cap is applied here rather than left to the caller: a row the
     * platform would reject should not be one the keyboard can reach.
     */
    const options = React.useMemo(
      () =>
        variant === "message" ? given.slice(0, SELECT_MENU_MAX_OPTIONS) : given,
      [given, variant]
    )

    const id = React.useId()

    /*
     * The selection is mirrored here because the trigger draws more than the
     * label of the chosen row: its icon and its note come from the option.
     */
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const selected = value ?? uncontrolled
    const selectedOption = options.find((option) => option.value === selected)

    /*
     * While the list is open, Radix hides everything outside it from assistive
     * technology, the trigger included. A hidden element that still takes Tab
     * is what an accessibility audit reports, so the trigger leaves the tab
     * order until the list closes. Focus is held in the list meanwhile, and it
     * returns to the trigger by script, which a negative tabindex allows.
     */
    const [open, setOpen] = React.useState(false)

    return (
      <SelectPrimitive.Root
        /* An empty string is how Radix spells "nothing chosen". */
        value={selected ?? ""}
        onValueChange={(next) => {
          if (value === undefined) setUncontrolled(next)
          onValueChange?.(next)
        }}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <div
          ref={ref}
          className={cn("relative w-full max-w-[400px]", className)}
          {...props}
        >
          <SelectPrimitive.Trigger
            data-slot="select-menu-trigger"
            aria-label={label}
            tabIndex={open ? -1 : undefined}
            className={cn(
              "group flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-[var(--newt-radius-sm)] border border-newt-border bg-newt-bg-input px-2 font-[family-name:var(--newt-font-sans)] text-sm font-medium text-newt-text-primary hover:border-newt-bg-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50",
              triggerClassName
            )}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              {/* An icon wins over an emoji when an option carries both. */}
              {selectedOption?.icon || selectedOption?.emoji ? (
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-base leading-none text-newt-text-secondary"
                >
                  {selectedOption.icon || selectedOption.emoji}
                </span>
              ) : null}
              <span
                className={cn(
                  "truncate",
                  !selectedOption && "text-newt-text-muted"
                )}
              >
                {selectedOption?.label ?? placeholder}
              </span>
              {selectedOption?.note ? (
                <span className="truncate font-normal text-newt-text-muted">
                  {selectedOption.note}
                </span>
              ) : null}
            </span>
            {/* Points down when closed, flips when the listbox opens. */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="h-[18px] w-[18px] shrink-0 group-data-[state=open]:rotate-180"
            >
              <path
                fill="currentColor"
                d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
              />
            </svg>
          </SelectPrimitive.Trigger>
        </div>

        <SelectPrimitive.Portal container={container}>
          <SelectPrimitive.Content
            data-slot="select-menu-content"
            position="popper"
            side={side}
            align={align}
            sideOffset={4}
            aria-label={label}
            className={cn(
              "z-[110] w-[var(--radix-select-trigger-width)] rounded-[var(--newt-radius-md)] border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high",
              contentClassName
            )}
          >
            <SelectPrimitive.Viewport
              className={cn(
                /*
                 * A message select shows its scrollbar: the list is capped, so
                 * the bar is what says there is more of it below the fold.
                 * Radix hides the viewport's scrollbar with an attribute
                 * selector, so the two rules that bring it back repeat that
                 * attribute to outrank it.
                 */
                variant === "message"
                  ? cn(
                      "max-h-[300px]",
                      "[&[data-radix-select-viewport]]:[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]",
                      "[&[data-radix-select-viewport]::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2",
                      "[&::-webkit-scrollbar-track]:bg-transparent",
                      "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding",
                      "[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding"
                    )
                  : "max-h-80"
              )}
            >
              {options.map((option, index) => {
                const descriptionId = `${id}-description-${index}`
                const state = { index, selected: option.value === selected }
                return (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    /* Typeahead matches the label, not the description. */
                    textValue={option.label}
                    aria-describedby={
                      option.description && !renderItem
                        ? descriptionId
                        : undefined
                    }
                    className={cn(
                      "group/item flex cursor-pointer select-none items-center gap-2.5 rounded-[var(--newt-radius-sm)] px-2.5 py-2 text-sm text-newt-text-secondary outline-none",
                      "data-[state=checked]:text-newt-text-primary",
                      "data-[highlighted]:bg-newt-brand data-[highlighted]:data-[state=unchecked]:text-newt-on-accent",
                      "data-[disabled]:cursor-not-allowed data-[disabled]:text-newt-text-muted data-[disabled]:opacity-50"
                    )}
                  >
                    {renderItem ? (
                      /*
                       * A row drawn by the caller is the option's name as a
                       * whole: the text of everything in it, with no
                       * description id left dangling.
                       */
                      <SelectPrimitive.ItemText asChild>
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          {renderItem(option, state)}
                        </div>
                      </SelectPrimitive.ItemText>
                    ) : (
                      <>
                        {option.icon || option.emoji ? (
                          <span
                            aria-hidden="true"
                            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-base leading-none text-newt-text-secondary group-data-[highlighted]/item:text-newt-on-accent"
                          >
                            {option.icon || option.emoji}
                          </span>
                        ) : null}
                        <span className="flex min-w-0 flex-col">
                          <SelectPrimitive.ItemText className="truncate">
                            {option.label}
                          </SelectPrimitive.ItemText>
                          {option.description ? (
                            <span
                              id={descriptionId}
                              className="truncate text-xs text-newt-text-muted group-data-[highlighted]/item:text-newt-on-accent"
                            >
                              {renderItemDescription
                                ? renderItemDescription(option, state)
                                : option.description}
                            </span>
                          ) : null}
                        </span>
                      </>
                    )}
                    {/*
                     * Only the settings menu ticks a row. In a message the
                     * choice is submitted rather than kept, so there is no
                     * standing selection for a tick to be about.
                     */}
                    {variant === "settings" ? (
                      <SelectPrimitive.ItemIndicator
                        className={cn(
                          "ms-auto flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-newt-brand text-newt-on-accent",
                          // On the highlighted row the disc would dissolve into
                          // the background, so it swaps with the tick.
                          "group-data-[highlighted]/item:bg-newt-on-accent group-data-[highlighted]/item:text-newt-brand"
                        )}
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6 12.5 4 4 8-9"
                          />
                        </svg>
                      </SelectPrimitive.ItemIndicator>
                    ) : null}
                  </SelectPrimitive.Item>
                )
              })}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  }
)
SelectMenu.displayName = "SelectMenu"

export { SelectMenu }
