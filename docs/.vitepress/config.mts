import { defineConfig } from "vitepress";
import themeConfig from "vitepress-theme-tk/config";

const description = ["Hd Security 使用文档", "认证框架"].toString();

const tkConfig = themeConfig({
  author: { name: "Tianke", link: "https://github.com/Kele-Bingtang" },
  blogger: {
    // 博主信息，显示在首页侧边栏
    avatar: "https://cdn.jsdmirror.com/gh/xugaoyi/image_store/blog/20200103123203.jpg",
    name: "天客",
    slogan: "朝圣的使徒，正在走向编程的至高殿堂！", // 个性签名
  },
  docAnalysis: {
    createTime: "2021-10-19",
    siteView: true,
    pageView: true,
    wordsCount: true,
    readingTime: true,
    siteIteration: 2500,
    pageIteration: 2500,
  },
  banner: {
    bgStyle: "bigImg",
    bigImgSrc: "/img/bg1.jpg",
    descStyle: "types",
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: tkConfig,
  base: "/",
  title: "Hd Security",
  description: description,
  cleanUrls: true,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["meta", { name: "author", content: "Tianke" }],
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
    logo: "/logo.svg",
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
      { text: "指南", link: "/01.指南/" },
      { text: "设计", link: "/design" },
      { text: "API", link: "/07.API/01.API - 登录" },
      { text: "归档", link: "/archives" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Kele-Bingtang/hd-security" }],

    search: {
      provider: "local",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/Kele-Bingtang/hd-security/edit/master/hd-security-docs/docs/:path",
    },
  },
});
