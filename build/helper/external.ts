// 打 umd 包时针对 external 外部依赖指定全局变量名称
export const globals = {
  vue: "Vue",
  vite: "Vite",
  vitepress: "VitePress",
  "vitepress/theme": "VitePressTheme",
  "node:path": "node:path",
  "node:fs": "node:fs",
  fs: "fs",
  "gray-matter": "GrayMatter",
  "element-plus": "ElementPlus",
  "@element-plus/icons-vue": "ElementPlusIconsVue",
  "@giscus/vue": "Giscus",
  "@waline/client": "Waline",
  fsevents: "fsevents",
  "markdown-it": "MarkdownIt",
  "markdown-it-container": "MarkdownItContainer",
};

// 指定外部依赖，rollup 不会将这些依赖代码打包进去
export const external = [...Object.keys(globals), "@types/markdown-it", "@types/markdown-it-container"];
