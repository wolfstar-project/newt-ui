/** `status-indicator` -> `StatusIndicator` (registry name -> Vue component name). */
export function pascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
