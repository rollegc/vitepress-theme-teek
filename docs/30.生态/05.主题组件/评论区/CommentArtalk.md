---
title: CommentArtalk
date: 2025-04-13 15:52:27
permalink: /ecosystem/components/artalk
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
      // artalk 配置，官网：https://artalk.js.org/
      server: "https://vp.teek.top",
      site: "Teek Site",
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
