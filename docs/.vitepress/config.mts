import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { version } from "vitepress-theme-teek/es/version";

const description = ["vitepress-theme-teek 使用文档", "vitepress 主题框架"].toString();

const tkConfig = defineTeekConfig({
  author: { name: "Teeker", link: "https://github.com/Kele-Bingtang" },
  footerInfo: {
    copyright: {
      createYear: 2025,
      suffix: "Teek",
    },
    icpRecord: {
      name: "桂ICP备2021009994号",
      link: "http://beian.miit.gov.cn/",
    },
  },
  themeSetting: {
    themeSize: "large",
  },
  vitePlugins: {
    sidebarOption: {
      initItems: false,
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: tkConfig,
  title: "vitepress-theme-teek",
  description: description,
  cleanUrls: true,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/teek-logo-mini.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "Teek | Vitepress Theme" }],
    ["meta", { property: "og:site_name", content: "Teek" }],
    ["meta", { property: "og:image", content: "" }],
    ["meta", { property: "og:url", content: "" }],
    ["meta", { name: "author", content: "Teek" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    [
      "meta",
      {
        name: "description",
        description,
      },
    ],
    ["meta", { name: "keywords", description }],
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/teek-logo-mini.svg",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guild/intro", activeMatch: "/01.指南/" },
      { text: "配置", link: "/reference/config", activeMatch: "/10.配置/" },
      { text: "开发", link: "/develop/intro", activeMatch: "/15.主题开发/" },
      { text: "常见问题", link: "/theme/qa", activeMatch: "/20.常见问题/" },
      {
        text: "生态",
        items: [
          { text: "Helper", link: "/ecosystem/helper" },
          { text: "Hooks", link: "/ecosystem/hooks" },
          { text: "Markdown 插件工具", link: "/ecosystem/md-plugin-utils" },
        ],
      },
      {
        text: version,
        items: [
          { text: "历史版本", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/release" },
          { text: "更新日志", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/dev/CHANGELOG.md" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek" }],

    search: {
      provider: "local",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/Kele-Bingtang/vitepress-theme-teek/edit/master/docs/:path",
    },
  },
});
