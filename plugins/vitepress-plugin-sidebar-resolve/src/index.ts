import type { PluginOption, ViteDevServer } from "vite";
import path from "node:path";
import type { UserConfig } from "vitepress";
import type { SidebarOption } from "./types";
import chalk from "chalk";
import createSidebarAndRewrites from "./helper";

const log = console.log;

export default function VitePluginVitePressSidebarPermalink(option: SidebarOption = {}): PluginOption {
  return {
    name: "vite-plugin-vitepress-sidebar-permalink",
    configureServer({ watcher, restart }: ViteDevServer) {
      // 监听所有 markdown 文件变化
      const fsWatcher = watcher.add("*.md");
      // 监听所有类型的文件系统事件
      fsWatcher.on("all", async (event, path) => {
        // 文件被创建或者删除时候触发
        if (event !== "change") {
          log(`${event} ${path}`);
          try {
            // 重启服务器并来更新侧边栏
            await restart();
            log("update sidebar...");
          } catch {
            log(`${event} ${path}`);
            log("update sidebar failed");
          }
        }
      });
    },
    config(config) {
      const { path: rootPath = "/docs" } = option;
      // 项目绝对路径
      const sourceDir = path.join(process.cwd(), rootPath);
      const vitepressConfig = (config as { vitepress: { site: UserConfig } }).vitepress;
      const { themeConfig, rewrites } = vitepressConfig.site;

      // 自动生成结构化侧边栏
      const { sidebar, rewrites: permalinkRewrites } = createSidebarAndRewrites(sourceDir, option);

      if (sidebar) {
        themeConfig.sidebar = {
          ...sidebar,
          ...(Array.isArray(themeConfig.sidebar)
            ? log(chalk.yellow("warning: custom sidebar must be in object form. 自定义 sidebar 必须是对象形式"))
            : themeConfig.sidebar),
        };
        log(chalk.blue("tip ") + chalk.green("add sidebar data. 成功生成侧边栏数据"));
      } else {
        log(
          chalk.yellow(
            "warning: fail to add sidebar data. Please use the official sidebar configuration option. 未能添加侧边栏数据，请使用官方 sidebar 配置项"
          )
        );
      }

      if (permalinkRewrites) {
        vitepressConfig.site.rewrites = { ...permalinkRewrites, ...rewrites };
      }

      return config;
    },
  };
}
