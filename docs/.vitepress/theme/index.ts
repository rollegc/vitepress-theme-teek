import Teek from "vitepress-theme-teek";
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue";

// Teek 本地主题包引用（与 Teek 在线主题包引用 二选一）
import "@teek/theme-chalk/vp-plus/code-block-mobile.scss"; // 移动端代码块样式优化
import "@teek/theme-chalk/vp-plus/sidebar.scss"; // 侧边栏优化
import "@teek/theme-chalk/vp-plus/nav.scss"; // 导航栏优化
import "@teek/theme-chalk/vp-plus/aside.scss"; // 右侧目栏录文字悬停和激活样式
import "@teek/theme-chalk/vp-plus/doc-h1-gradient.scss"; // 一级标题渐变色
import "@teek/theme-chalk/vp-plus/table.scss"; // 表格样式调整，去掉单元格之间的线条
import "@teek/theme-chalk/vp-plus/mark.scss"; // <mark></mark> 样式
import "@teek/theme-chalk/vp-plus/blockquote.scss"; // > 引用块样式
import "@teek/theme-chalk/vp-plus/index-rainbow.scss"; // 首页图片彩虹动画
import "@teek/theme-chalk/vp-plus/doc-fade-in.scss"; // 进入文档页淡入效果
import "@teek/theme-chalk/tk-plus/banner-desc-gradient.scss"; // 博客风格 Banner 描述渐变样式

// Teek 在线主题包引用（需安装 Teek 在线版本）
// import "vitepress-theme-teek/index.css";
// import "vitepress-theme-teek/theme-chalk/vp-plus/code-block-mobile.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/sidebar.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/nav.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/aside.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/doc-h1-gradient.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/table.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/mark.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/blockquote.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/index-rainbow.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/doc-fade-in.scss";
// import "vitepress-theme-teek/theme-chalk/tk-plus/banner-desc-gradient.scss";

import "./styles/code-bg.scss";
import "./styles/iframe.scss";

export default {
  extends: Teek,
  Layout: TeekLayoutProvider,
};
