"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The drop zone a modal asks for a file with. Two ways in, because a drop is
 * not available to everyone: dragging files onto it, and a `browse` control
 * that opens the same picker from the keyboard.
 *
 * The file input stays in the DOM rather than being replaced by a button —
 * it is the accessible name, the keyboard path and the picker all at once.
 */
export interface FileUploadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrop" | "onChange"
> {
  /** Accepted types, passed straight to the input. */
  accept?: string
  /** Whether more than one file can be chosen at a time. */
  multiple?: boolean
  disabled?: boolean
  /** The line under the prompt: how many, how large. */
  hint?: React.ReactNode
  /** Called with whatever was dropped or picked. */
  onFiles?: (files: readonly File[]) => void
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      accept,
      multiple = false,
      disabled = false,
      hint,
      onFiles,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = React.useState(false)

    function accept_(list: FileList | null) {
      if (list === null || list.length === 0) return
      onFiles?.(Array.from(list))
    }

    return (
      <div
        ref={ref}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onDragOver={(event) => {
          if (disabled) return
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          if (disabled) return
          event.preventDefault()
          setDragging(false)
          accept_(event.dataTransfer.files)
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-newt-border bg-newt-bg-base px-4 py-6 text-center",
          "transition-colors duration-fast ease-newt",
          "data-[dragging]:border-newt-brand data-[dragging]:bg-newt-bg-surface",
          "focus-within:border-newt-brand",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 text-newt-text-muted"
        >
          <path
            fill="currentColor"
            d="M12 3a1 1 0 0 1 .7.3l4 4a1 1 0 1 1-1.4 1.4L13 6.42V15a1 1 0 1 1-2 0V6.41L8.71 8.71a1 1 0 0 1-1.42-1.42l4-4A1 1 0 0 1 12 3ZM5 15a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1Z"
          />
        </svg>

        <p className="text-sm text-newt-text-secondary">
          Drop files here or {/*
           * The label is the control: clicking the word opens the picker, and
           * the input keeps the focus ring and the keyboard behaviour it was
           * born with.
           */}
          <label className="cursor-pointer text-newt-text-link underline-offset-2 hover:underline">
            browse
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              className="sr-only"
              onChange={(event) => accept_(event.target.files)}
            />
          </label>
        </p>

        {hint === undefined ? null : (
          <p className="text-xs text-newt-text-muted">{hint}</p>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
