import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import "./styles/index.scss";
import "./styles/md-plugin/index.scss";
// import "./styles/external/rainbow.css";
// import "./styles/external/container.css";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-icon.css";
import "element-plus/theme-chalk/el-image-viewer.css";
import "element-plus/theme-chalk/el-pagination.css";
import "element-plus/theme-chalk/el-input.css";
import "element-plus/theme-chalk/el-breadcrumb.css";
import "element-plus/theme-chalk/el-breadcrumb-item.css";

export type { TkThemeConfig } from "./config/types";
export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {},
} as Theme;
