import { log } from "@clack/prompts"
import color from "picocolors"

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
  if (Object.prototype.toString.call(cause) === "[object String]") {
    // SAFETY: `Object.prototype.toString` returned "[object String]", the
    // same evidence `typeof cause === "string"` would have narrowed on.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- narrowed by the toString check above.
    const message = cause as string
    logger.error(message)
  } else if (cause instanceof Error) {
    logger.error(cause.message)
  } else {
    logger.error("Something went wrong. Please try again.")
  }
  process.exit(1)
}
