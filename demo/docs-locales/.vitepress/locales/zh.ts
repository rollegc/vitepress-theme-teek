import { defineConfig } from "vitepress";

const description = ["Hd Security 使用文档", "认证框架"].toString();

export default defineConfig({
  lang: "zh-CN",
  description: description,
  head: [
    ["meta", { name: "description", description }],
    ["meta", { name: "keywords", description }],
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载
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
      { text: "指南", link: "/guide" },
      { text: "设计", link: "/design/login-overview" },
      { text: "API", link: "/07.API/01.API - 登录" },
      {
        text: "API 下拉",
        items: [
          { text: "Session 会话", link: "/07.API/04.API - Session 会话" },
          { text: "Token 密钥", link: "/api/token" },
        ],
      },
      { text: "归档", link: "/archives" },
    ],
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/Kele-Bingtang/hd-security/edit/master/hd-security-docs/docs/:path",
    },
  },
});
