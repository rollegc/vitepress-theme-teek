---
title: ArticlePage 文章页 <Badge type="tip" text="v1.2.0" />
date: 2025-05-13 01:29:21
permalink: /ecosystem/components/article-page
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

当在 Markdown 文档将 `frontmatter.layout` 设置为 `page`，VitePress 不会对该 Markdown 生成的文章页应用任何样式，这对于创建一个完全自定义的页面时很有用。

ArticlePage 文章页是一个用于完全自定义页面快速构建的组件，Teek 提供的 `目录页`、`归档页`、`清单页` 都是基于该组件构建的。

## 基础使用

::: demo
articlePage/basic
:::

## API

### 配置项

| 名称  | 说明                                    | 类型      | 默认值 |
| :---- | :-------------------------------------- | :-------- | :----- |
| doc   | 是否是文档页（使用 VitePress 文档样式） | `boolean` | false  |
| aside | 是否使用大纲栏                          | `boolean` | false  |

使用 `aside` 配置项的前提是要有 `h1` 到 `h6` 标题标签，且标题标签里要有 `a` 标签，如：

```vue
<script setup lang="ts">
import { TkArticlePage } from "vitepress-theme-teek";
</script>

<template>
  <TkArticlePage doc aside>
    <h1 id="一级标题">
      一级标题
      <a class="header-anchor" href="#一级标题" aria-label="Permalink to '一级标题'" />
    </h1>
    <h2 id="二级标题">
      二级标题
      <a class="header-anchor" href="#二级标题" aria-label="Permalink to '二级标题'" />
    </h2>
    <p>Teek 是一个轻量、简洁高效、灵活配置的 VitePress 主题</p>
  </TkArticlePage>
</template>
```
