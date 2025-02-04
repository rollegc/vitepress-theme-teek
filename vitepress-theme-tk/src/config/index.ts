import { KtThemeConfig } from "./types";
import Sidebar from "vitepress-plugin-sidebar-resolve";
import Permalink from "vitepress-plugin-permalink";
import MdH1 from "vitepress-plugin-md-h1";
import Catalogue from "vitepress-plugin-catalogue";
import SiteInfo from "vitepress-plugin-doc-analysis";
import { UserConfig } from "vitepress";
import { PluginOption } from "vite";

export default function themeConfig(config: KtThemeConfig = {}): UserConfig {
  const { plugins: pluginsOption, ...c } = config;
  const {
    sidebar = true,
    sidebarOption = {},
    permalink = true,
    permalinkOption,
    mdH1 = true,
    catalogueOption,
    siteInfo = true,
    siteInfoOption = {},
  } = pluginsOption || {};

  const plugins: PluginOption[] = [Catalogue(catalogueOption)];

  if (sidebar) {
    sidebarOption.ignoreList = [...(sidebarOption?.ignoreList || []), "@pages", "_posts"];
    plugins.push(Sidebar(sidebarOption));
  }
  if (permalink) plugins.push(Permalink(permalinkOption));
  if (mdH1) plugins.push(MdH1());
  if (siteInfo) {
    siteInfoOption.ignoreList = [...(sidebarOption?.ignoreList || []), "@pages", "目录页"];
    plugins.push(SiteInfo(siteInfoOption));
  }

  return {
    vite: { plugins },
    themeConfig: {
      ...c,
    },
  };
}
