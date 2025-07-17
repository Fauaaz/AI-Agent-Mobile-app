// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// --- ADD THESE LOGS ---
console.log('--- Vite Config Paths Debugging ---');
console.log('__dirname:', __dirname);
console.log('path.resolve(__dirname, "src"):', path.resolve(__dirname, "src"));
console.log('path.resolve(__dirname, "../shared"):', path.resolve(__dirname, "../shared"));
console.log('path.resolve(__dirname, "../attached_assets"):', path.resolve(__dirname, "../attached_assets"));
console.log('--- End Vite Config Paths Debugging ---');
// --- END LOGS ---

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "../../dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});