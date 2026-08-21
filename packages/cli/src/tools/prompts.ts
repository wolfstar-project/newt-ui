import {
  cancel,
  confirm,
  isCancel,
  multiselect,
  select,
  text,
} from "@clack/prompts"

/** Exit cleanly when the user cancels a prompt (ctrl+c / esc). */
function unwrap<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Operation cancelled.")
    process.exit(1)
  }
  return value
}

export async function promptConfirm(
  message: string,
  initialValue = true
): Promise<boolean> {
  return unwrap(await confirm({ message, initialValue }))
}

export async function promptText(
  message: string,
  initialValue: string
): Promise<string> {
  return unwrap(
    await text({
      message,
      placeholder: initialValue,
      defaultValue: initialValue,
    })
  )
}

export interface PromptOption {
  value: string
  label: string
}

export async function promptSelect(
  message: string,
  options: PromptOption[],
  initialValue: string
): Promise<string> {
  return unwrap(await select<string>({ message, options, initialValue }))
}

export async function promptMultiselect(
  message: string,
  options: PromptOption[]
): Promise<string[]> {
  return unwrap(
    await multiselect<string>({ message, options, required: false })
  )
}
