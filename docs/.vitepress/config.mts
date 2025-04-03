import { defineConfig } from "vitepress";
import shared from "./mode/shared";
import doc from "./mode/doc";
import blog from "./mode/blog";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "文档风", ...doc },
    blog: { label: "博客风(回到首页再点击)", ...blog },
  },
});
