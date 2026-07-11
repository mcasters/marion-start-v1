import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { runtimeDir as nitroRuntimeDir } from "nitro/meta";
import { resolve as resolvePath } from "node:path";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      srcDirectory: "src",
    }),
    viteReact(),
    nitro({
      preset: "node-server",
      hooks: {
        "build:before"(nitro) {
          nitro.options.handlers.push({
            route: "/images/**",
            handler: resolvePath(nitroRuntimeDir, "internal/vite/ssr-renderer"),
          });
        },
      },
    }),
  ],
});
