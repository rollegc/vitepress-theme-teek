import type { Plugin, ViteDevServer } from "vite";
import type { SidebarOption } from "./types";
import chalk from "chalk";
import createSidebar from "./helper";
import { join } from "node:path";

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
        site: { themeConfig },
        srcDir,
      } = config.vitepress;

      option.base = option.base ? join(process.cwd(), option.base) : srcDir;

      // 自动生成结构化侧边栏
      const sidebar = createSidebar(option);

      themeConfig.sidebar = {
        ...sidebar,
        ...(Array.isArray(themeConfig.sidebar)
          ? log(chalk.yellow("Warning: 自定义 Sidebar 必须是对象形式"))
          : themeConfig.sidebar),
      };
    },
  };
}
