---
title: ArticleImagePreview 文章页图片预览
date: 2025-04-13 15:53:44
permalink: /ecosystem/components/article-image-preview
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
import { TkArticleImagePreview, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  appreciation: {
    article: {
      imageViewer: {
        hideOnClickModal: true, // 点击图片时隐藏预览
        // ...
      },
    },
  },
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-before": () => h(TkArticleImagePreview),
    }),
};
```

更多 `imageViewer` 配置项请看 [ImageViewer 图片预览](/ecosystem/components/image-viewer)。
