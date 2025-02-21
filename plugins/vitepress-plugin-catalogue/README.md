# vitepress-plugin-catalogue

这是一个适用于 `vitepress` 的 Vite 插件，`vitepress` 启动会扫描 markdown 文档，获取 `frontmatter` 存在 `catalogue: true` 的文档路径。

## ✨ Feature

- 🚀 自动生成目录页数据，挂载到 `themeConfig.catalogues` 下

## 🕯️ Install

安装 `vitepress-plugin-catalogue` 插件

```bash
# 推荐使用 pnpm
pnpm i vitepress-plugin-catalogue
# or yarn
yarn add vitepress-plugin-catalogue
# or npm
npm install vitepress-plugin-catalogue
```

添加 `vitepress-plugin-catalogue` 插件到 `.vitepress/config.ts`

```typescript
import Catalogue from "vitepress-plugin-catalogue";

export default defineConfig({
  vite: {
    plugins: [
      Catalogue(/* options */)
    ]
  },
})
```

> 说明：该插件仅限项目启动时生效，如果给 markdown 添加 `catalogue` 功能，需要重启项目生效。

插件默认忽略 `["node_modules", "dist", ".vitepress", "public"]` 目录下的文件。

## 🛠️ Options

| name          | description                              | type       | default                        |
| ------------- | ---------------------------------------- | ---------- | ------------------------------ |
| ignoreList    | 忽略的文件/文件夹列表，支持正则表达式    | `string[]` | `[]`                           |
| path          | 指定扫描的根目录                         | `string`   | `vitepress` 的 `srcDir` 配置项 |

## 📖 Usage

假设该 markdown 文件内容如下：

```markdown
---
catalogue: true
path: guide
---
```

此时在浏览器地址栏访问该文件地址，进来的页面将会按照层级渲染 `guide` 目录下的所有子目录和 markdown 文件，这个页面叫做 **目录页**。

## License

[MIT](../../LICENSE) License © 2025 [Teeker](https://github.com/Kele-Bingtang)