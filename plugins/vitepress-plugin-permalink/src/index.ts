import type { PluginOption, ViteDevServer } from "vite";
import createPermalinks from "./helper";
import type { PermalinkOption } from "./types";
import chalk from "chalk";
import { join } from "node:path";

export * from "./types";

export const log = (message: string, type = "yellow") => {
  console.log((chalk as any)[type](message));
};

export default function VitePluginVitePressPermalink(option: PermalinkOption = {}): PluginOption {
  let vitepressConfig: any = {};

  return {
    name: "vite-plugin-vitepress-sidebar-permalink",
    config(config: any) {
      const {
        site: { themeConfig, cleanUrls },
        srcDir,
      } = config.vitepress;

      option.base = option.base ? join(process.cwd(), option.base) : srcDir;

      const permalinks = createPermalinks(option, cleanUrls);

      // Key 为 path，Value 为 permalink
      const pathToPermalink: Record<string, string> = {};
      // Key 为 permalink，Value 为 path
      const permalinkToPath: Record<string, string> = {};

      for (const [key, value] of Object.entries(permalinks)) {
        pathToPermalink[key] = value;

        if (permalinkToPath[value]) {
          log(`Permalink「${value}」已存在，其对应的「${permalinkToPath[value]}」将会被 ${key} 覆盖`);
        }

        permalinkToPath[value] = key;
      }

      themeConfig.permalinks = {
        map: pathToPermalink,
        inv: permalinkToPath,
      };

      vitepressConfig = config.vitepress;
    },
    configureServer(server: ViteDevServer) {
      const {
        base,
        themeConfig: { permalinks },
      } = vitepressConfig.site;
      // 重写 URL，这是在服务器环境中执行，此时还未到浏览器环境，因此在浏览器地址栏变化之前执行，即浏览器地址栏无延迟变化
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const reqUrl = decodeURI(req.url)
            .replace(/[?#].*$/, "")
            .replace(/\.md$/, "")
            .slice(base.length);

          // 如果访问链接 reqUrl 为 permalink，则找到对应的文档路由
          const pageUrl = permalinks.inv[reqUrl.startsWith("/") ? reqUrl : `/${reqUrl}`];

          // 如果找到文档路由，则跳转，防止页面 404
          if (pageUrl) {
            req.url = req.url.replace(encodeURI(reqUrl), encodeURI(pageUrl));
          }
        }

        next();
      });
    },
  };
}
