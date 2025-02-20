import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import autoprefixer from "autoprefixer";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { target } from "../helper";
import vuePlugin from "@vitejs/plugin-vue";
// import vue from "rollup-plugin-vue";

// rollup 插件。rollup 本身只支持原生 JavaScript 文件打包，如果项目包含 vue、json 等非原生 JavaScript 文件，则利用插件来支持打包
export const plugins = [
  vuePlugin({ isProduction: true }),
  // vue({}),
  json(),
  // 解析和处理 Node.js 风格的模块导入语句（如 `import something from 'my-package'`），因为 Rollup 本身默认仅支持 ES 模块导入（即通过相对或绝对路径导入本地文件）
  nodeResolve({ extensions: [".mjs", ".js", ".json", ".ts"] }),
  commonjs(),
  postcss({
    extract: true,
    plugins: [autoprefixer()],
  }),
  // 利用 esbuild 打包，能提高打包速度
  esbuild({
    sourceMap: false,
    target,
    treeShaking: true,
    loaders: {
      ".vue": "ts",
    },
  }),
];
