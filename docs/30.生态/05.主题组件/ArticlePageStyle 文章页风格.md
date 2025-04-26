---
title: ArticlePageStyle 文章页风格
date: 2025-04-13 15:54:25
permalink: /ecosystem/components/article-page-style
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
import { TkArticlePageStyle, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  pageStyle: "default", // 可选 "default" | "card" | "segment" | "card-nav" | "segment-nav"，默认为 "default"
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-before": () => h(TkArticlePageStyle),
    }),
};
```
