---
title: FooterInfo 页脚
date: 2025-04-13 15:55:38
permalink: /ecosystem/components/footer-info
categories:
  - 生态
  - 主题组件
tags:
  - 生态
  - 主题组件
---

如果您已经引入 Teek 全部功能，则无需执行本内容的步骤。

本内容仅介绍在其他主题或 VitePress 默认主题中单独引入。

## 基础使用

```ts
import DefaultTheme from "vitepress/theme";
import { TkFooterInfo, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  footerInfo: {
    topMessage: ["下面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    bottomMessage: ["上面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    copyright: {
      createYear: 2021,
      suffix: "天客 Blog",
    },
    icpRecord: {
      name: "桂ICP备2021009994号",
      link: "http://beian.miit.gov.cn/",
    },
    customHtml: `<span style="color: var(--tk-theme-color)">自定义标签内容</span>`,
  },
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-bottom": () => h(TkFooterInfo),
    }),
};
```
