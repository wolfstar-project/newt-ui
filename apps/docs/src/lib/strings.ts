/** `select-menu` → `SelectMenu`. The registry names React exports this way. */
export function pascalCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
