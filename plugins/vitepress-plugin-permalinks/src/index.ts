import type { PluginOption } from "vite";
import createPermalinks from "./helper";
import { PermalinkOption } from "./types";

export default function VitePluginVitePressPermalinks(option: PermalinkOption = {}): PluginOption {
  return {
    name: "vite-plugin-vitepress-sidebar-permalinks",
    config(config: any) {
      const { site } = config.vitepress;

      site.permalinks = createPermalinks(option, site.cleanUrls);
    },
  };
}
