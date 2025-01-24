import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import "./styles/index.scss";

export type { ThemeConfig } from "./config/types";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {},
} as Theme;
