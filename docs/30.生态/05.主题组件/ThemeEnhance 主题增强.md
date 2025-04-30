---
title: 主题增强
date: 2025-04-29 02:41:47
permalink: /ecosystem/components/theme-enhance
categories:
  - 生态
  - 主题组件
tags:
  - 生态
  - 主题组件
---

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
::::

使用文章分析组件，可以获取文章的创建时间、字数、阅读时间、访问量等信息。

## 基础使用

```ts
import DefaultTheme from "vitepress/theme";
import { TkThemeEnhance, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  themeEnhance: {
    // ... 更多配置请看配置系列文章
  },
});

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () => h(TkThemeEnhance),
    }),
};
```
