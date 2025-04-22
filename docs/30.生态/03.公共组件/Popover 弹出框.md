---
title:
date: 2025-04-22 21:23:28
permalink: /ecosystem/components/popover
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

## 展示位置

Popover 弹出框提供 9 种展示位置。

使用 content 属性来设置悬停时显示的信息。 由 placement 属性决定 Popover 弹出框的位置。 该属性值格式为：[方向]-[对齐位置]，可供选择的四个方向分别是top、left、right、bottom，可供选择的三种对齐方式分别是start、end、null，默认的对齐方式为null。 以 placement="left-end" 为例，Popover 弹出框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。

::: demo
popover/basic
:::
