---
title: ArchivesPage 归档页
date: 2025-04-13 15:53:05
permalink: /ecosystem/components/archives
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

将归档页注册到全局里：

```ts
import DefaultTheme from "vitepress/theme";
import { TkArchivesPage } from "vitepress-theme-teek";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, siteData }) {
    app.component("TkArchivesPage", TkArchivesPage);
  },
};
```

创建一个 Markdown 文件，在 `frontmatter` 添加如下内容：

```yaml
---
layout: TkArchivesPage
---
```

此时访问该 Markdown 文件，即可看到效果。
