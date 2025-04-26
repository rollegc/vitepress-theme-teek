---
title: CommentTwikoo
date: 2025-04-13 15:52:45
permalink: /ecosystem/components/twikoo
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
import { TkCommentArtalk, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  comment: {
    options: {
      // twikoo 配置，官网：https://twikoo.js.org/
      envId: "https://vp.teek.top/",
      link: "https://gcore.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js",
    },
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-after": () => h(TkCommentArtalk),
    }),
};
```
