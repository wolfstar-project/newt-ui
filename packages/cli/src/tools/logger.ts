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

export function handleError(error: unknown): never {
  if (typeof error === "string") {
    logger.error(error)
  } else if (error instanceof Error) {
    logger.error(error.message)
  } else {
    logger.error("Something went wrong. Please try again.")
  }
  process.exit(1)
}
