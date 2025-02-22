import { defineConfig } from "vitepress";

const description = ["Hd Security Documentation", "Authentication Framework"].toString();

export default defineConfig({
  lang: "en-US",
  description: description,
  head: [
    ["meta", { name: "description", description }],
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
      tipLabel: "Tip",
      warningLabel: "Warning",
      dangerLabel: "Danger",
      infoLabel: "Info",
      detailsLabel: "Details",
    },
  },
  themeConfig: {
    darkModeSwitchLabel: "Theme",
    sidebarMenuLabel: "Menu",
    returnToTopLabel: "To Top",
    lastUpdatedText: "LastUpdated",
    outline: {
      level: [2, 4],
      label: "Page Navigation",
    },
    docFooter: {
      prev: "prev",
      next: "next",
    },
    nav: [
      { text: "index", link: "/en" },
      { text: "guide", link: "/en/guide" },
      { text: "design", link: "/en/design/login-overview" },
      { text: "API", link: "/en/07.API/01.API - 登录" },
      {
        text: "API Dropdown",
        items: [
          { text: "Session", link: "/en/07.API/04.API - Session 会话" },
          { text: "Token", link: "/en/api/token" },
        ],
      },
      { text: "archives", link: "/en/archives" },
    ],
    editLink: {
      text: "Edit this page on GitHub",
      pattern: "https://github.com/Kele-Bingtang/hd-security/edit/master/hd-security-docs/docs/:path",
    },
  },
});
