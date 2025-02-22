# vitepress-plugin-md-h1

这是一个适用于 `vitepress` 的 Vite 插件，在 `vitepress` 启动后自动生成一级标题到 markdown 文档开头处（假如 markdown 文档没有设置过一级标题）。

> 说明：只在页面加载 markdown 内容时生成一级标题，并不会真正修改 markdown 文档内容。

## ✨ Feature

- 🚀 将 `frontmatter.title` 或「文件名」作为一级标题注入到 markdown 文档开头处

## 🕯️ Install

安装 `vitepress-plugin-md-h1` 插件

```bash
# 推荐使用 pnpm
pnpm i vitepress-plugin-md-h1
# or yarn
yarn add vitepress-plugin-md-h1
# or npm
npm install vitepress-plugin-md-h1
```

添加 `vitepress-plugin-md-h1` 插件到 `.vitepress/config.ts`

```typescript
import MdH1 from "vitepress-plugin-md-h1";

export default defineConfig({
  vite: {
    plugins: [MdH1()],
  },
});
```

> 说明：该插件仅限项目启动时生效，已改动或新添加的 markdown 需要重启项目才能生效。

## 🉑 License

[MIT](../../LICENSE) License © 2025 [Teeker](https://github.com/Kele-Bingtang)
