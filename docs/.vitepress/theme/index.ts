import Teek from "vitepress-theme-teek";
// import "vitepress-theme-teek/index.css";
import "vitepress-theme-teek/vp-plus/code-block-mobile.scss";
import "vitepress-theme-teek/vp-plus/sidebar.scss";
import "vitepress-theme-teek/vp-plus/nav.scss";
import "vitepress-theme-teek/vp-plus/aside.scss";
import "vitepress-theme-teek/vp-plus/doc-h1-gradient.scss";
import "vitepress-theme-teek/vp-plus/table.scss";
import "vitepress-theme-teek/vp-plus/mark.scss";
import "vitepress-theme-teek/vp-plus/blockquote.scss";
import "vitepress-theme-teek/vp-plus/index-rainbow.scss";

import "./styles/code-bg.scss";

export default {
  extends: Teek,
  enhanceApp({ app, router }) {},
};
