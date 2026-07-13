import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// SPA-only build: Nitro/Cloudflare SSR disabled. TanStack Start prerenders a
// static index.html shell; the router hydrates entirely on the client. Output
// goes to `dist/` so APK wrappers (Capacitor/Cordova) can consume it directly.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: { enabled: true },
    server: { preset: "static" },
  },
  vite: {
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  },
});
