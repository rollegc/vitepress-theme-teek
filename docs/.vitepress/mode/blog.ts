import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

const tkConfig = defineTeekConfig({
  themeSetting: {
    themeSize: "default",
  },
  blogger: {
    avatar: "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
    avatarStyle: "full",
    name: "天客",
    slogan: "朝圣的使徒，正在走向编程的至高殿堂！",
  },
  docAnalysis: {
    createTime: "2025-03-23",
    statistics: {
      provider: "busuanzi",
    },
  },
  banner: {
    bgStyle: "fullImg",
    imgSrc: ["/blog/banner-bg1.jpg", "/blog/banner-bg2.png"],
    descStyle: "types",
  },

  wallpaper: {
    enabled: true,
  },

  friendLink: {
    list: [
      {
        avatar: "https://doc.xugaoyi.com/img/logo.png",
        name: "vuepress-theme-vdoing",
        desc: "🚀一款简洁高效的VuePress 知识管理&博客 主题",
        link: "https://doc.xugaoyi.com/",
      },
      {
        avatar: "https://onedayxyy.cn/img/xyy-touxiang.png",
        name: "One",
        desc: "明心静性，爱自己",
        link: "https://onedayxyy.cn/",
      },
      {
        avatar: "https://hyde.seasir.top/img/hyde-logo.ico",
        name: "Hyde Blog",
        desc: "人心中的成见是一座大山",
        link: "https://hyde.seasir.top/",
      },
      {
        avatar: "https://wiki.eryajf.net/img/logo.png",
        name: "二丫讲梵",
        desc: "💻学习📝记录🔗分享",
        link: " https://wiki.eryajf.net/",
      },
      {
        avatar: "https://theme.sugarat.top/logo.png",
        name: "粥里有勺糖",
        desc: "简约风的 Vitepress 博客主题",
        link: "https://theme.sugarat.top/",
      },
      {
        avatar: "https://avatars.githubusercontent.com/u/90893790?v=4",
        name: "VitePress 快速上手中文教程",
        desc: "如果你也想搭建它，那跟我一起做吧",
        link: "https://vitepress.yiov.top/",
      },
      {
        avatar: "http://niubin.site/logo.jpg",
        name: "友人A",
        desc: "おとといは兎をみたの，昨日は鹿，今日はあなた",
        link: "http://niubin.site/",
      },
    ],
  },

  social: [
    {
      icon: "icon-github",
      iconType: "iconfont",
      name: "GitHub",
      link: "https://github.com/kele-bingtang",
    },
    {
      icon: "icon-gitee2",
      iconType: "iconfont",
      name: "Gitee",
      link: "https://gitee.com/kele-bingtang",
    },
  ],

  comment: {
    provider: "giscus",
    options: {
      repo: "Kele-Bingtang/vitepress-theme-teek",
      repoId: "R_kgDONpVfBA",
      category: "Announcements",
      categoryId: "DIC_kwDONpVfBM4Cm3v9",
    },
  },
});

export default defineConfig({
  head: [
    ["link", { rel: "stylesheet", href: "//at.alicdn.com/t/font_2989306_w303erbip9.css" }], // 阿里在线矢量库
  ],
  themeConfig: {
    ...tkConfig.themeConfig,
    logo: "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
    nav: [
      { text: "首页", link: "/blog/" },
      { text: "指南", link: "/blog/guide" },
      { text: "设计", link: "/blog/design" },
      {
        text: "API",
        items: [
          { text: "API - 登录", link: "/blog/api/login" },
          { text: "API - Session 会话", link: "/blog/api/session" },
          { text: "API - Token", link: "/blog/api/token" },
        ],
      },
      { text: "归档", link: "/blog/archives" },
    ],
  },
});
