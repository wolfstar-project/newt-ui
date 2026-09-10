import { examples } from "./registry-examples"
import { lib } from "./registry-lib"
import { themes } from "./registry-themes"
import { ui } from "./registry-ui"
import type { Registry } from "./schema"

export const registry: Registry = [...ui, ...examples, ...lib, ...themes]
