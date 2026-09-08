import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // The CLI runs on Node and touches the file system; there is no DOM here.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
