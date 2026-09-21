import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@modules": path.join(import.meta.dirname, "src/modules"),
      "@": path.join(import.meta.dirname, "src"),
    },
  },
});
