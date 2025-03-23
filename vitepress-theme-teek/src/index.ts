import DefaultTheme from "vitepress/theme";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import { TkCataloguePage, TkArchivesPage } from "./components";
import "./styles/index.scss";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-image-viewer.css";
import "element-plus/theme-chalk/el-pagination.css";
import "element-plus/theme-chalk/el-input.css";

export type { TkThemeConfig } from "./config/types";
export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export type DefaultThemeType = typeof DefaultTheme;

export * from "./components";

export {
  createContainerThenUse,
  createContainerThenGet,
  createContainersThenUse,
  createContainersThenGet,
} from "./markdown/plugins/container";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {
    app.component("TkCataloguePage", TkCataloguePage);
    app.component("TkArchivesPage", TkArchivesPage);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
