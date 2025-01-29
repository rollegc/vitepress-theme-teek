import type { PluginOption, ViteDevServer } from "vite";
import type { SidebarOption } from "./types";
import chalk from "chalk";
import createSidebar from "./helper";

export type { SidebarOption };
export * from "./util";

const log = console.log;

export default function VitePluginVitePressSidebarResolve(option: SidebarOption = {}): PluginOption {
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
      const { themeConfig, srcDir } = config.vitepress.site;
      option.base = option.base || srcDir || ".";

      console.log(option);

      // 自动生成结构化侧边栏
      const sidebar = createSidebar(option);

      themeConfig.sidebar = {
        ...sidebar,
        ...(Array.isArray(themeConfig.sidebar)
          ? log(chalk.yellow("warning: Custom sidebar must be in object form. 自定义 sidebar 必须是对象形式"))
          : themeConfig.sidebar),
      };

      log(chalk.blue("tip ") + chalk.green("Create sidebar success. 成功生成侧边栏数据"));
    },
  };
}
