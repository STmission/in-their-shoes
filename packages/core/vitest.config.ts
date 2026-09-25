import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@game/content": fileURLToPath(new URL("../content/src/index.ts", import.meta.url)),
    },
  },
});
