import DefaultTheme from "vitepress/theme";
import { defineClientComponent } from "vitepress";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import { TkCataloguePage, TkArchivesPage, TkDemoCode } from "./components";
import "./styles/index.scss";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-image-viewer.css";
import "element-plus/theme-chalk/el-pagination.css";
import "element-plus/theme-chalk/el-input.css";
import "element-plus/theme-chalk/el-popper.css";
import "element-plus/theme-chalk/el-message.css";

export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export type DefaultThemeType = typeof DefaultTheme;

export type * from "./config/types";
export * from "./components";
export * from "./helper";
export * from "./hooks";
export * from "./markdown/helper";
export * from "./version";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {
    app.component("TkCataloguePage", TkCataloguePage);
    app.component("TkArchivesPage", TkArchivesPage);

    // TkDemoCode 组件用到 DOM API，因此需要防止 SSR 构建报错
    const ClientTkDemoCode = defineClientComponent(async () => TkDemoCode);
    app.component("TkDemoCode", ClientTkDemoCode);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
