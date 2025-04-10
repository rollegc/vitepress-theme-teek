import type { TeekConfig } from "vitepress-theme-teek/config";

// 文档配置
export const teekDocConfig: TeekConfig = {
  themeSetting: {
    themeSize: "large",
  },
};

// 博客配置
export const teekBlogConfig: TeekConfig = {
  teekHome: true,
  vpHome: false,
  themeSetting: {
    themeSize: "default",
  },
  wallpaper: {
    enabled: true,
  },
  post: {
    imageViewer: {
      hideOnClickModal: true,
    },
  },
  banner: {
    name: "🎉 Teek Blog",
    bgStyle: "fullImg",
    imgSrc: ["/blog/banner-bg1.jpg", "/blog/banner-bg2.png"],
    description: [
      "故事由我书写，旅程由你见证，传奇由她聆听 —— 来自 Young Kbt",
      "积跬步以至千里，致敬每个爱学习的你 —— 来自 Evan Xu",
      "这一生波澜壮阔或是不惊都没问题 —— 来自 Weibw",
    ],
    descStyle: "types",
  },
  blogger: {
    avatar: "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
    shape: "square",
    name: "天客",
    slogan: "朝圣的使徒，正在走向编程的至高殿堂！",
  },
  docAnalysis: {
    createTime: "2025-03-23",
    statistics: {
      provider: "busuanzi",
    },
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
        desc: "简约风的 VitePress 博客主题",
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
};
