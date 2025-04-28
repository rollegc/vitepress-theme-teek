import type { TeekConfig } from "@teek/config";
import type { BaiduAnalyticsOptions, GoogleAnalyticsOptions, UmamiAnalytics } from "@teek/helper";
import DefaultTheme from "vitepress/theme";
import { isClient, baiduAnalytics, trackPageview, googleAnalytics, umamiAnalytics } from "@teek/helper";
import { TeekConfigProvider, TkLayout, TkCataloguePage, TkArchivesPage, TkDemoCode } from "@teek/components";

import "@teek/theme-chalk/index.scss";

export type DefaultThemeType = typeof DefaultTheme;
export type * from "@teek/config";

export * from "@teek/static";
export * from "@teek/components";
export * from "@teek/helper";
export * from "@teek/hooks";
export * from "@teek/locale";
export * from "@teek/markdown/helper";
export * from "./version";

export default {
  extends: DefaultTheme,
  Layout: TeekConfigProvider(TkLayout),
  enhanceApp({ app, siteData }) {
    app.component("TkCataloguePage", TkCataloguePage);
    app.component("TkArchivesPage", TkArchivesPage);
    app.component("TkDemoCode", TkDemoCode);

    // 站点分析
    const siteAnalytics = (siteData.value.themeConfig.siteAnalytics as TeekConfig["siteAnalytics"]) || [];
    const siteAnalysis: Record<string, (options: any) => void> = {
      baidu: (options: BaiduAnalyticsOptions) => {
        baiduAnalytics(options);
        if (isClient) trackPageview(options, window.location.href);
      },
      google: (options: GoogleAnalyticsOptions) => googleAnalytics(options),
      umami: (options: UmamiAnalytics) => umamiAnalytics(options),
    };

    siteAnalytics.forEach(item => {
      siteAnalysis[item.provider]?.(item.options);
    });
  },
} as DefaultThemeType & { extends: DefaultThemeType };
