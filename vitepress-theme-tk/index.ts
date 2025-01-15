import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./src/layout/index.vue";
import { configProvider } from "./src/configProvider";
import "./src/styles/index.scss";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {},
} as Theme;
