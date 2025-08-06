# TODO

- sidebar 插件不扫描 index.md 修复
- 推送 Github 自动推送 Gitee

## 1.3.6 版本

### 代办

- 修复浏览器报错：`Hydration completed but contains mismatches.`，官方解决方案：`https://cn.vuejs.org/guide/scaling-up/ssr#hydration-mismatch`
- 在功能页配置文档时，面包屑的 `配置` 鼠标悬停不是点击形状，但是可以点击进入目录页（当前强制面包屑的最后一个节点不会是点击形状，需要判断是否有链接来决定）
- 支持 `frontmatter.sideBarSort` 对代替文件名数字排序（url 带有数字）
- `frontmatter.inCatalogue` 配置无效
- `demo` 容器，隐藏源代码栏固定位置失效
- 主题面板支持隐藏
- 当 `frontmatter.permalink` 和文件名一样，点击跳转 `RangeError: Maximum call stack size exceeded`

### issue

- [articleAnalyze的teleport配置不生效 · Issue #90 · Kele-Bingtang/vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/90)
- [关于命名约定 · Issue #86 · Kele-Bingtang/vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek/issues/86)

### 已完成

- 修复首页卡片栏插槽失效问题

## 模板

创建空的 Markdown 文档时，可以使用如下模板填充，提升友好度

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
::::
