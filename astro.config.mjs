// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import { SITE } from "./src/config/site.mjs";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'compile',
  }),
  site: SITE.url,
  integrations: [
    react(),
    icon(),
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["react", "react-dom"],
    },
    build: {
      rollupOptions: {
        output: {
          banner: `
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = class MessageChannel {
                constructor() {
                  this.port1 = { onmessage: null, postMessage: (msg) => this.port2.onmessage?.({ data: msg }) };
                  this.port2 = { onmessage: null, postMessage: (msg) => this.port1.onmessage?.({ data: msg }) };
                }
              };
            }
          `,
        },
      },
    },
  },
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
  compressHTML: true,
  image: {
    domains: ["unavatar.io"],
    remotePatterns: [],
  },
});
