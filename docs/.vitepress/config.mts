import { defineConfig } from "vitepress";
import tkThemeConfig from "vitepress-theme-teeker/config";

const description = ["vitepress-theme-teeker 使用文档", "vitepress 主题框架"].toString();

const tkConfig = tkThemeConfig({
  author: { name: "Tianke", link: "https://github.com/Kele-Bingtang" },
  blogger: {
    // 博主信息，显示在首页侧边栏
    avatar: " https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
    avatarStyle: "full",
    name: "天客",
    slogan: "朝圣的使徒，正在走向编程的至高殿堂！",
  },
  docAnalysis: {
    createTime: "2021-10-19",
    siteView: true,
    pageView: true,
    wordCount: true,
    readingTime: true,
    siteIteration: 2500,
    pageIteration: 2500,
  },
  banner: {
    bgStyle: "default",
    descStyle: "types",
  },

  footerInfo: {
    copyright: {
      createYear: 2021,
      suffix: "天客 Blog",
    },
    icpRecord: {
      name: "桂ICP备2021009994号",
      link: "http://beian.miit.gov.cn/",
    },
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
    {
      icon: "icon-qq",
      iconType: "iconfont",
      name: "QQ",
      link: "http://wpa.qq.com/msgrd?v=3&uin=28761025&site=qq&menu=yes",
    },
    {
      icon: "icon-mobile",
      iconType: "iconfont",
      name: "联系我",
      link: "https://www.youngkbt.cn/?contact=true",
    },
  ],
  comment: {
    provider: "giscus",
    options: {
      // twikoo 配置，官网：https://twikoo.js.org/
      // envId: "https://twikoo.youngkbt.cn/",
      // link: "https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.min.js",

      // waline 配置，官网：https://waline.js.org/
      // serverURL: "https://tk.waline.youngkbt.cn/",
      // jsLink: "https://unpkg.com/@waline/client@v3/dist/waline.js",
      // cssLink: "https://unpkg.com/@waline/client@v3/dist/waline.css",

      // giscus 配置，官网：https://giscus.app/zh-CN
      repo: "Kele-Bingtang/vitepress-theme-kt",
      repoId: "R_kgDONpVfBA",
      category: "Announcements",
      categoryId: "DIC_kwDONpVfBM4Cm3v9",

      // artalk 配置，官网：https://artalk.js.org/
      // server: "",
      // site: "",
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: tkConfig,
  base: "/",
  title: "vitepress-theme-teeker",
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
    ["link", { rel: "icon", href: "/favicon.ico", type: "image/png" }],
    ["link", { rel: "stylesheet", href: "//at.alicdn.com/t/font_2989306_w303erbip9.css" }], // 阿里在线矢量库
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
    logo: " https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
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
      { text: "指南", link: "/guild/intro" },
      { text: "配置", link: "/config/theme" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Kele-Bingtang/vitepress-theme-teeker" }],

    search: {
      provider: "local",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/Kele-Bingtang/vitepress-theme-teeker/edit/master/hd-security-docs/docs/:path",
    },
  },
});
