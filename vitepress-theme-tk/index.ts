import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import MyLayout from "./layout/index.vue";
import "./styles/index.scss";

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {},
} as Theme;
