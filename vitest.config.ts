import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 25000,
    hookTimeout: 25000,
    exclude: [...configDefaults.exclude, ".claude/worktrees/**"],
    fileParallelism: false,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
