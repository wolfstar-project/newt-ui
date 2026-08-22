import { log } from "@clack/prompts"
import color from "picocolors"
import { z } from "zod"

export const highlighter = {
  error: (value: string): string => color.red(value),
  warn: (value: string): string => color.yellow(value),
  info: (value: string): string => color.cyan(value),
  success: (value: string): string => color.green(value),
  dim: (value: string): string => color.dim(value),
  bold: (value: string): string => color.bold(value),
}

export const logger = {
  error(message: string): void {
    log.error(message)
  },
  warn(message: string): void {
    log.warn(message)
  },
  info(message: string): void {
    log.info(message)
  },
  success(message: string): void {
    log.success(message)
  },
  log(message: string): void {
    log.message(message)
  },
  break(): void {
    console.log("")
  },
}

export function handleError(cause: unknown): never {
  // A rejected promise's reason can be any thrown value, so decode it into a
  // known shape here instead of narrowing it ad hoc at each call site.
  const asString = z.string().safeParse(cause)
  if (asString.success) {
    logger.error(asString.data)
  } else if (cause instanceof Error) {
    logger.error(cause.message)
  } else {
    logger.error("Something went wrong. Please try again.")
  }
  process.exit(1)
}
