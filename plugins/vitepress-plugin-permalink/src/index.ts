import type { Plugin, ViteDevServer } from "vite";
import createPermalinks, { standardLink } from "./helper";
import type { Permalink, PermalinkOption } from "./types";
import picocolors from "picocolors";
import { join } from "node:path";

export * from "./types";

export const log = (message: string, type = "yellow") => {
  console.log((picocolors as any)[type](message));
};

export default function VitePluginVitePressPermalink(option: PermalinkOption = {}): Plugin & { name: string } {
  let vitepressConfig: any = {};

  return {
    name: "vite-plugin-vitepress-sidebar-permalink",
    config(config: any) {
      const {
        site: { themeConfig, cleanUrls, locales },
        srcDir,
        rewrites,
      } = config.vitepress;

      // 防止 vitepress build 时重复执行
      if (themeConfig.permalinks) return;

      const baseDir = option.path ? join(process.cwd(), option.path) : srcDir;

      const permalinks = createPermalinks({ ...option, path: baseDir }, cleanUrls);

      // Key 为 path，Value 为 permalink
      const pathToPermalink: Record<string, string> = {};
      // Key 为 permalink，Value 为 path
      const permalinkToPath: Record<string, string> = {};
      // 国际化多语言 key 数组
      const localesKeys = Object.keys(locales || {});

      for (const [key, value] of Object.entries(permalinks)) {
        // 如果设置了 rewrites，则取 rewrites 后的文件路径
        const rewriteFilePath = rewrites.map[`${key}.md`]?.replace(/\.md/, "") || key;
        // 如果设置了多语言，则 permalink 添加语言前缀
        let newValue = getLocalePermalink(localesKeys, key, value);

        if (permalinkToPath[newValue]) {
          log(`永久链接「${newValue}」已存在，其对应的 '${permalinkToPath[newValue]}' 将会被 「${key}」 覆盖`);
        }

        pathToPermalink[rewriteFilePath] = newValue;
        permalinkToPath[newValue] = rewriteFilePath;
      }

      themeConfig.permalinks = { map: pathToPermalink, inv: permalinkToPath } as Permalink;

      log("Injected Permalinks Data Successfully. 注入永久链接数据成功!", "green");

      vitepressConfig = config.vitepress;

      // 导航栏高亮适配 permalink
      if (!localesKeys.length) {
        return setActiveMatchWhenUsePermalink(
          themeConfig.nav,
          permalinkToPath,
          cleanUrls,
          rewrites,
          "",
          option.activeMatchDir
        );
      }

      localesKeys.forEach(localeKey => {
        setActiveMatchWhenUsePermalink(
          locales[localeKey].themeConfig?.nav,
          permalinkToPath,
          cleanUrls,
          rewrites,
          localeKey,
          option.activeMatchDir
        );
      });
    },
    configureServer(server: ViteDevServer) {
      const {
        site: {
          base,
          themeConfig: { permalinks },
          cleanUrls,
        },
        rewrites,
      } = vitepressConfig;
      // 将 permalink 重写实际文件路径，仅限 dev 环境生效
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.includes(".md")) {
          const reqUrl = decodeURI(req.url)
            .replace(/[?#].*$/, "")
            .replace(/\.md$/, "")
            .slice(base.length);

          const finalReqUrl = reqUrl.startsWith("/") ? reqUrl : `/${reqUrl}`;
          // 如果访问链接 reqUrl 为 permalink，则找到对应的文档路由。当开启 cleanUrls 后，permalinks 内容都是 .html 结尾
          const filePath = permalinks.inv[cleanUrls ? finalReqUrl : `${finalReqUrl}.html`];
          // 如果设置了 rewrites，则取没有 rewrites 前的实际文件地址
          const realFilePath = rewrites.inv[`${filePath}.md`]?.replace(/\.md/, "") || filePath;

          // 如果文档路由 realFilePath 存在，则替换 URL 实现跳转，防止页面 404
          if (realFilePath) req.url = req.url.replace(encodeURI(reqUrl), encodeURI(realFilePath));
        }
        next();
      });
    },
  };
}

/**
 * 给 permalink 添加多语言前缀
 *
 * @param localesKeys 多语言 key 数组，排除 root 根目录
 * @param path 文件路径
 * @param permalink 永久链接
 */
const getLocalePermalink = (localesKeys: string[] = [], path = "", permalink = "") => {
  // 过滤掉 root 根目录
  const localesKey = localesKeys.filter(key => key !== "root").find(key => path.startsWith(key));
  if (localesKey) return `/${localesKey}${permalink.startsWith("/") ? permalink : `/${permalink}`}`;

  return permalink;
};

/**
 * 如果 nav 有 link 且 link 为 permalink，则添加 activeMatch 为 permalink 对应的文件路径
 * 这里的处理是导航栏兼容 permalink 的高亮功能，默认访问 permalink 后，导航栏不会高亮，因为导航栏是根据实际的文件路径进行匹配
 *
 * @param nav 导航栏
 * @param permalinkToPath permalink 和文件路径的映射关系
 * @param cleanUrls cleanUrls
 * @param rewrites 如果设置了 rewrites，则取 rewrites 后的文件路径
 * @param localeKey 多语言名称
 * @param activeMatchDir activeMatch 精确匹配指定目录下的 Markdown 文件
 */
const setActiveMatchWhenUsePermalink = (
  nav: any[] = [],
  permalinkToPath: Record<string, string>,
  cleanUrls = false,
  rewrites: Record<string, any> = {},
  localeKey = "",
  activeMatchDir = [""]
) => {
  if (!nav.length) return;

  nav.forEach(item => {
    if (item.link === "/") return;

    const link = standardLink(item.link);
    // cleanUrls 为 false 时，permalinkToPath 的 key 都会带上 .html
    const path = permalinkToPath[cleanUrls ? link : `${link.replace(/\.html/, "")}.html`];

    if (path && !item.activeMatch) {
      const finalPath = rewrites.map[`${path}.md`]?.replace(/\.md/, "") || path;
      // 如果设置了 rewrites，则取 rewrites 后的文件路径
      const finalPathArr = (rewrites.map[`${path}.md`]?.replace(/\.md/, "") || path).split("/");

      // 访问一级目录里面的 Markdown 文件，对应导航都可以高亮，同时兼容国际化目录（官方规定 activeMatch 是一个正则表达式字符串）
      const activeMatch =
        finalPathArr[0] === localeKey
          ? `${finalPathArr[0]}${finalPathArr[1] ? `/${finalPathArr[1]}` : ""}`
          : finalPathArr[0];

      // 精确匹配指定目录下的 Markdown 文件
      if (activeMatchDir.includes(activeMatch)) item.activeMatch = finalPath;
      else item.activeMatch = activeMatch;
    }

    if (item.items?.length) setActiveMatchWhenUsePermalink(item.items, permalinkToPath, cleanUrls, rewrites);
  });
};
