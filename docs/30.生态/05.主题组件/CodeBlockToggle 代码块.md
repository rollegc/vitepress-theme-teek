---
title: CodeBlockToggle 代码块
date: 2025-04-13 15:55:03
permalink: /ecosystem/components/code-block-toggle
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
import { TkCodeBlockToggle } from "vitepress-theme-teek";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-before": () => h(TkCodeBlockToggle),
    }),
};
```
