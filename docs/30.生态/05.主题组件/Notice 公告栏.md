---
title: Notice 公告栏
date: 2025-04-13 15:56:22
permalink: /ecosystem/components/notice
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

如果您已经引入 Teek 全部功能，则无需执行本内容的步骤。

本内容仅介绍在其他主题或 VitePress 默认主题中单独引入。

## 基础使用

```ts
import DefaultTheme from "vitepress/theme";
import { TkNotice, teekConfigContext } from "vitepress-theme-teek";
import { h } from "vue";

provide(teekConfigContext, {
  notice: {},
});

export default {
  extends: DefaultTheme,
  Layout: () => h("div", null, [h(TkNotice), h(DefaultTheme.Layout)]),
};
```
