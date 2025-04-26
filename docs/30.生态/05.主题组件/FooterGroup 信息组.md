---
title: FooterGroup 信息组
date: 2025-04-13 15:55:25
permalink: /ecosystem/components/footer-group
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
import { TkFooterGroup, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  footerGroup: [
    {
      title: "外部链接",
      links: [
        { name: "示例 1", link: "https://vp.teek.top" },
        { name: "示例 2", link: "https://vp.teek.top" },
        { name: "示例 3", link: "https://vp.teek.top" },
      ],
    },
    {
      title: "内部链接",
      links: [
        { name: "快速开始", link: "/guide/quickstart" },
        { name: "配置简介", link: "/reference/config" },
      ],
    },
  ],
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-bottom": () => h(TkFooterGroup),
    }),
};
```
