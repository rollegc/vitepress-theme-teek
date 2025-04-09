import DefaultTheme from "vitepress/theme";
import { defineClientComponent, inBrowser } from "vitepress";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import { TkCataloguePage, TkArchivesPage, TkDemoCode } from "./components";
import {
  baiduAnalytics,
  trackPageview,
  googleAnalytics,
  umamiAnalytics,
  type BaiduAnalyticsOptions,
  type GoogleAnalyticsOptions,
  type UmamiAnalytics,
} from "./helper";
import "./styles/index.scss";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-input.css";
import "element-plus/theme-chalk/el-popper.css";
import "element-plus/theme-chalk/el-message.css";

export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export type DefaultThemeType = typeof DefaultTheme;

export type * from "./config/types";
export * from "./configProvider";
export * from "./components";
export * from "./helper";
export * from "./hooks";
export * from "./markdown/helper";
export * from "./version";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, siteData }) {
    app.component("TkCataloguePage", TkCataloguePage);
    app.component("TkArchivesPage", TkArchivesPage);

    // TkDemoCode 组件用到 DOM API，因此需要防止 SSR 构建报错
    const ClientTkDemoCode = defineClientComponent(async () => TkDemoCode);
    app.component("TkDemoCode", ClientTkDemoCode);

    // 站点分析
    const { provider, options } = siteData.value.themeConfig.siteAnalytics || {};
    const siteAnalysis: Record<string, (options: any) => void> = {
      baidu: (options: BaiduAnalyticsOptions) => {
        baiduAnalytics(options);
        if (inBrowser) trackPageview(options, window.location.href);
      },
      google: (options: GoogleAnalyticsOptions) => googleAnalytics(options),
      umami: (options: UmamiAnalytics) => umamiAnalytics(options),
    };

    siteAnalysis[provider]?.(options);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
