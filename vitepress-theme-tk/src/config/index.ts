import { ThemeConfig } from "./types";
import Sidebar from "vitepress-plugin-sidebar-resolve";
import Permalink from "vitepress-plugin-permalink";
import MdH1 from "vitepress-plugin-md-h1";
import { UserConfig } from "vitepress";
import { PluginOption } from "vite";

export default function themeConfig(config: ThemeConfig = {}): UserConfig {
  const { plugins: pluginsOption } = config;
  const { sidebar = true, sidebarOptions, permalink = true, permalinkOptions, mdH1 = true } = pluginsOption || {};

  const plugins: PluginOption[] = [];

  if (sidebar) plugins.push(Sidebar(sidebarOptions));
  if (permalink) plugins.push(Permalink(permalinkOptions));
  if (mdH1) plugins.push(MdH1());

  return {
    vite: { plugins },
  };
}
