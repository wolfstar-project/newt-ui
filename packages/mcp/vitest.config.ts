import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // The server runs on Node and only talks HTTP; there is no DOM here.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
