---
title: ImageViewer 图片预览
date: 2025-04-13 15:50:49
permalink: /ecosystem/components/image-viewer
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

## 图片预览

通过 `createImageViewer` 函数来打开图片预览

::: demo
imageViewer/basic
:::

## API

### 配置项

| 事件名                | 说明                                                                                     | Type                | 默认值 |
| :-------------------- | :--------------------------------------------------------------------------------------- | :------------------ | :----- |
| url-list              | 用于预览的图片链接列表                                                                   | `string[]`          | []     |
| z-index               | 预览时遮罩层的 z-index                                                                   | `number` / `string` | —      |
| initial-index         | 初始预览图像索引，小于 `url-list` 的长度                                                 | `number`            | 0      |
| infinite              | 是否可以无限循环预览                                                                     | `boolean`           | true   |
| hide-on-click-modal   | 是否可以通过点击遮罩层关闭预览                                                           | `boolean`           | false  |
| teleported            | image 自身是否插入至 body 元素上。 嵌套的父元素属性会发生修改时应该将此属性设置为 `true` | `boolean`           | false  |
| zoom-rate             | 图像查看器缩放事件的缩放速率。                                                           | `number`            | 1.2    |
| min-scale             | 图像查看器缩放事件的最小缩放比例                                                         | `number`            | 0.2    |
| max-scale             | 图像查看器缩放事件的最大缩放比例                                                         | `number`            | 7      |
| close-on-press-escape | 是否可以通过按下 ESC 关闭                                                                | `boolean`           | true   |
| show-progress         | 是否显示预览图片的进度条内容                                                             | `boolean`           | false  |

### 方法

| Name   | 说明           | 类型         |
| :----- | :------------- | :----------- |
| switch | 切换图像时触发 | `() => void` |
| rotate | 旋转图像时触发 | `() => void` |

这样使用：

```vue
<script setup lang="ts">
import { createImageViewer } from "vitepress-theme-teek";

const handleClick = () => {
  createImageViewer({ onSwitch: () => {}, onRotate: () => {} });
};
</script>

<template>
  <button @click="handleClick">点击打开图片预览</button>
</template>
```
