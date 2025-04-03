import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

const tkConfig = defineTeekConfig({
  themeSetting: {
    themeSize: "large",
  },
});

export default defineConfig({
  themeConfig: tkConfig.themeConfig,
});
