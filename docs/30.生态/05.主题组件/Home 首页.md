---
title: Home 首页
date: 2025-04-13 15:55:54
permalink: /ecosystem/components/home
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
import { TkHome, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  // ... 更多配置请看配置系列文章
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "home-hero-before": () => h(TkHome),
    }),
};
```
