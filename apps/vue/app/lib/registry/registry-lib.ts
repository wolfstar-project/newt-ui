import type { Registry } from "./schema"

export const lib: Registry = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["cn"],
    files: [{ path: "lib/utils.ts", type: "registry:lib" }],
  },
]
