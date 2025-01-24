import { PermalinkOption } from "vitepress-plugin-permalink";
import { SidebarOption } from "vitepress-plugin-sidebar-resolve";

export interface ThemeConfig {
  plugins?: {
    // 是否禁用 sidebar 插件，默认 false
    sidebar?: boolean;
    // sidebar 插件配置项
    sidebarOptions?: SidebarOption;
    // 是否禁用 permalink 插件，默认 false
    permalink?: boolean;
    // permalinks 插件配置项
    permalinkOptions?: PermalinkOption;

    // 是否禁用 mdH1 插件，默认 false
    mdH1: boolean;
  };
}
