# TODO

- sidebar 插件不扫描 index.md 修复
- 推送 Github 自动推送 Gitee

## 1.4.0 版本

### 代办

- 修复浏览器报错：`Hydration completed but contains mismatches.`，官方解决方案：`https://cn.vuejs.org/guide/scaling-up/ssr#hydration-mismatch`
- 添加常用 icon 库

### issue

### 已完成

- 修复首页卡片栏插槽失效问题
- 面包屑 `Item` 为支持跳转时，鼠标悬停未变成 `cursor: pointer` 修复
- 主题面板支持配置隐藏
- `demo` 容器，隐藏源代码栏固定位置失效修复
- 代码块缩进时样式丢失修复
- 代码块折叠支持遮罩层显示
- 支持 `frontmatter.sidebarSort` 对代替文件名序号进行排序
- 目录页如果目录下的 `Markdown` 文件为空，则不添加到目录页
- 当 `frontmatter.permalink` 和文件名一样，点击跳转报错 `RangeError: Maximum call stack size exceeded` 修复
- [关于命名约定](https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/86)
- [articleAnalyze 的 teleport 配置不生效](https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/90)
- [不蒜子经常502，能否增加其他统计](https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/91)

## 模板

创建空的 Markdown 文档时，可以使用如下模板填充，提升友好度

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
::::
