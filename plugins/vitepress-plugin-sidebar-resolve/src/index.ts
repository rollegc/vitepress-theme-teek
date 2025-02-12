import type { Plugin, ViteDevServer } from "vite";
import type { SidebarOption } from "./types";
import chalk from "chalk";
import createSidebar from "./helper";
import { join } from "node:path";
import { DefaultTheme } from "vitepress";

export * from "./types";
export * from "./util";

const log = console.log;

export default function VitePluginVitePressSidebarResolve(option: SidebarOption = {}): Plugin {
  return {
    name: "vite-plugin-vitepress-sidebar-resolve",
    configureServer({ watcher, restart }: ViteDevServer) {
      const fsWatcher = watcher.add("*.md");
      // 监听文件系统事件
      fsWatcher.on("add", async path => {
        // 过滤非 .md 文件
        if (!path.endsWith(".md")) return;

        // 重启服务器并来更新侧边栏
        await restart();
      });

      fsWatcher.on("unlink", async path => {
        // 过滤非 .md 文件
        if (!path.endsWith(".md")) return;

        // 重启服务器并来更新侧边栏
        await restart();
      });
    },
    config(config: any) {
      const {
        site: { themeConfig, locales },
        srcDir,
      } = config.vitepress;

      option.base = option.base ? join(process.cwd(), option.base) : srcDir;

      // 多语言 key 数组
      const localesKeys = Object.keys(locales || {}).filter(key => key !== "root");

      // 如果不是多语言，直接自动生成结构化侧边栏
      if (!localesKeys.length) return setSideBar(themeConfig, createSidebar(option));

      // 多语言处理，针对每个语言的目录进行单独的扫描（除了 root）
      localesKeys.forEach(localesKey => {
        let sidebar: DefaultTheme.SidebarMulti = {};
        sidebar = createSidebar({ ...option, base: `${option.base}/${localesKey}` }, localesKey);

        setSideBar(locales[localesKey].themeConfig, sidebar);
      });

      // 对 root 根目录的 sidebar 进行单独的扫描，且不扫描其他语言目录
      setSideBar(
        locales.root.themeConfig,
        createSidebar({ ...option, ignoreList: [...(option.ignoreList || []), ...localesKeys] })
      );
    },
  };
}

const setSideBar = (themeConfig: any, sidebar: DefaultTheme.SidebarMulti) => {
  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};
  themeConfig.sidebar = {
    ...sidebar,
    ...(Array.isArray(themeConfig.sidebar)
      ? log(chalk.yellow("Warning: 自定义 Sidebar 必须是对象形式"))
      : themeConfig.sidebar),
  };
};
