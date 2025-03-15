import type { DefaultTheme, HeadConfig, UserConfig } from "vitepress";
import type { PluginOption } from "vite";
import type { TkThemeConfig } from "./types";
import type { Post, TkContentData } from "../post/types";
import Sidebar from "vitepress-plugin-sidebar-resolve";
import Permalink from "vitepress-plugin-permalink";
import MdH1 from "vitepress-plugin-md-h1";
import Catalogue from "vitepress-plugin-catalogue";
import DocAnalysis from "vitepress-plugin-doc-analysis";
import FileContentLoader, { FileContentLoaderOptions } from "vitepress-plugin-file-content-loader";
import AutoFrontmatter from "vitepress-plugin-auto-frontmatter";
import { transformData, transformRaw } from "../post";
import { todoPlugin, shareCardPlugin, imgCardPlugin, navCardPlugin, codeArrowPlugin } from "../markdown";
import { createCategory, createPermalink } from "./addFrontmatter";
import { containerPlugins, createContainersThenUse } from "../markdown/plugins/container";

export default function tkThemeConfig(config: TkThemeConfig & UserConfig<DefaultTheme.Config> = {}): UserConfig {
  const { vitePlugins, markdownPlugins = [], markdownContainers = [], ...tkThemeConfig } = config;
  const {
    sidebar = true,
    sidebarOption = {},
    permalink = true,
    permalinkOption = {},
    mdH1 = true,
    mdH1Option = {},
    catalogueOption = {},
    docAnalysis = true,
    docAnalysisOption = {},
    fileContentLoaderIgnore = [],
    autoFrontmatter = false,
    autoFrontmatterOption = {},
  } = vitePlugins || {};

  const plugins: PluginOption[] = [];

  // 定义各插件扫描时忽略的目录
  const ignoreDir = {
    autoFrontmatter: ["**/@pages/**"],
    sidebar: ["@pages", "@fragment"],
    mdH1: ["@pages"],
    docAnalysis: ["@pages", /目录页/],
    fileContentLoader: ["**/components/**", "**/.vitepress/**", "**/public/**", "**/*目录页*/**"],
    permalinkActiveMatch: ["@pages"],
  };

  // 自动生成 frontmatter 插件，必须放在第一位
  if (autoFrontmatter) {
    const {
      pattern,
      globOptions = {},
      transform,
      permalinkPrefix = "pages",
      categories = true,
    } = autoFrontmatterOption;

    // 默认扫描全部 MD 文件
    if (!pattern) autoFrontmatterOption.pattern = "**/*.md";

    autoFrontmatterOption.globOptions = {
      ...autoFrontmatterOption.globOptions,
      ignore: [...ignoreDir.autoFrontmatter, ...(globOptions.ignore || [])],
    };

    // 自定义 frontmatter 内容，添加永久链接和分类
    autoFrontmatterOption.transform = (frontmatter, fileInfo) => {
      let transformResult = transform?.(frontmatter, fileInfo) || {};

      if (permalink && !frontmatter.permalink) {
        transformResult = { ...transformResult, ...createPermalink(permalinkPrefix) };
      }
      if (categories && !frontmatter.categories) {
        transformResult = { ...transformResult, ...createCategory(fileInfo, ["@fragment"]) };
      }

      return Object.keys(transformResult).length ? { ...frontmatter, ...transformResult } : undefined;
    };

    plugins.push(AutoFrontmatter(autoFrontmatterOption));
  }

  // 自动添加侧边栏插件
  if (sidebar) {
    sidebarOption.ignoreList = [...(sidebarOption?.ignoreList || []), ...ignoreDir.sidebar];
    plugins.push(Sidebar(sidebarOption));
  }
  // 自动生成永久链接插件
  if (permalink) {
    permalinkOption.activeMatchDir = [...(permalinkOption?.activeMatchDir || []), ...ignoreDir.permalinkActiveMatch];
    plugins.push(Permalink(permalinkOption));
  }
  // 自动给 MD 添加一级标题插件
  if (mdH1) {
    mdH1Option.ignoreList = [...(mdH1Option?.ignoreList || []), ...ignoreDir.sidebar];
    plugins.push(MdH1(mdH1Option));
  }
  // 文档内容分析插件
  if (docAnalysis) {
    docAnalysisOption.ignoreList = [...(sidebarOption?.ignoreList || []), ...ignoreDir.docAnalysis];
    plugins.push(DocAnalysis(docAnalysisOption));
  }

  // 主题强内置插件
  if (config.tkTheme !== false) {
    // 目录页插件
    plugins.push(Catalogue(catalogueOption));

    const fileContentLoaderOptions: FileContentLoaderOptions<TkContentData, Post> = {
      pattern: ["**/*.md"],
      // 指定摘录格式
      excerpt: "<!-- more -->",
      includeSrc: true,
      transformData,
      transformRaw,
      themeConfigKey: "posts",
      globOptions: {
        ignore: [...ignoreDir.fileContentLoader, ...fileContentLoaderIgnore],
      },
    };

    // Post 数据处理插件
    plugins.push(FileContentLoader<TkContentData, Post>(fileContentLoaderOptions));
  }

  const head: HeadConfig[] = [];

  if (tkThemeConfig.docAnalysis?.statistics?.provider === "busuanzi") {
    // 不蒜子 API 统计需要
    head.push(["meta", { name: "referrer", content: "no-referrer-when-downgrade" }]);
  }

  return {
    // 使用永久链接插件需要忽略死链提醒
    ignoreDeadLinks: true,
    metaChunk: true,
    head,
    vite: {
      plugins: plugins as any,
      // 解决项目启动后终端打印 Scss 的废弃警告：The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
      css: { preprocessorOptions: { scss: { api: "modern" } } },
      optimizeDeps: {
        include: ["element-plus", "@giscus/vue", "@waline/client"],
      },
    },
    markdown: {
      config: md => {
        [todoPlugin, shareCardPlugin, imgCardPlugin, navCardPlugin, codeArrowPlugin, containerPlugins].forEach(plugin =>
          md.use(plugin)
        );
        createContainersThenUse(md, markdownContainers);

        // 用户配置的 markdown 插件
        markdownPlugins.forEach(plugin => md.use(plugin));
      },
    },
    themeConfig: tkThemeConfig,
  };
}
