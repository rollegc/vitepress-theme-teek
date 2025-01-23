import type { PluginOption } from "vite";
import createPermalinks from "./helper";
import { PermalinkOption } from "./types";

export default function VitePluginVitePressPermalinks(option: PermalinkOption = {}): PluginOption {
  let vitepressConfig: any = {};

  return {
    name: "vite-plugin-vitepress-sidebar-permalinks",
    config(config: any) {
      const { site } = config.vitepress;

      // Key 为 path，Value 为 permalink
      const pathToPermalink: Record<string, string> = {};
      // Key 为 permalink，Value 为 path
      const permalinkToPath: Record<string, string> = {};

      const permalinks = createPermalinks(option, site.cleanUrls);

      for (const [key, value] of Object.entries(permalinks)) {
        pathToPermalink[key] = value;
        permalinkToPath[value] = key;
      }

      site.permalinks = {
        map: pathToPermalink,
        inv: permalinkToPath,
      };

      vitepressConfig = config.vitepress;
    },
    configureServer(server) {
      const { base, permalinks } = vitepressConfig.site;
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
