import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import "./styles/index.scss";
import { CataloguePage, ArchivesPage } from "./components";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-image-viewer.css";
import "element-plus/theme-chalk/el-pagination.css";
import "element-plus/theme-chalk/el-input.css";

export type { TkThemeConfig } from "./config/types";
export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {
    app.component("cataloguePage", CataloguePage);
    app.component("archivesPage", ArchivesPage);
  },
} as Theme;
