// 本地 Teek 主题包引用（与 Teek 在线主题包引用 二选一）
import { defineTeekConfig } from "../../packages/config";
import { version } from "../../packages/teek/version";

// Teek 在线主题包引用（需安装 Teek 在线版本）
// import { defineTeekConfig } from "vitepress-theme-teek/config";
// import { version } from "vitepress-theme-teek/es/version";

export const teekConfig = defineTeekConfig({
  sidebarTrigger: true,
  author: { name: "Teeker", link: "https://github.com/Kele-Bingtang" },
  blogger: {
    name: "天客",
    slogan: "朝圣的使徒，正在走向编程的至高殿堂！",
    avatar: "https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
    shape: "circle-rotate",
    circleBgImg: "/blog/bg4.webp",
    color: "#ffffff",
    circleSize: 120,
    status: {
      icon: "😪",
      size: 28,
      title: "困",
    },
  },
  footerInfo: {
    theme: {
      name: `Theme By Teek@${version}`,
    },
    copyright: {
      createYear: 2025,
      suffix: "Teek",
    },
  },
  codeBlock: {
    copiedDone: TkMessage => TkMessage.success("复制成功！"),
  },
  post: {
    showCapture: true,
  },
  articleShare: { enabled: true },
  vitePlugins: {
    autoFrontmatter: true, // 自动生成 frontmatter
    autoFrontmatterOption: {
      recoverTransform: false,
      // 是否开启自动生成 categories
      categories: false,
      // 是否开启添加文档封面图
      enableCoverImg: false,
      // 是否开启强制覆盖封面图
      enableForceCoverImg: false,
      // 封面图列表
      coverImgList: ["1.webp", "2.webp", "3.webp", "4.webp", 'https://vp.teek.top/blog/bg1.webp'],
      // 是否开启生成永久链接
      enablePermalink: false,
      // 处理永久链接的规则
      permalinkRules: [
        { folderName: "01.指南/01.简介/", prefix: "/$path-$uuid2/teek/$uuid1/$uuid", removeLevel: 99 }, // 添加前缀
      ],
			enableHandleTimezone: true,
    },
    sidebarOption: {
      initItems: false,
      ignoreIndexMd: true,
    },
  },
  markdown: {
    demo: {
      githubUrl: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/master/docs",
    },
  },
  siteAnalytics: [
    {
      provider: "baidu",
      options: {
        id: "d5ee872d9aa1ef8021f4a3921b2e9c2a",
      },
    },
    {
      provider: "google",
      options: {
        id: "G-K5GNDW3L7K",
      },
    },
  ],
});
