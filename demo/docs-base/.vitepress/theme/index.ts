import { defineComponent, h, nextTick, watch } from "vue";
import { useData } from "vitepress";
import Teek from "vitepress-theme-teek";
// import "vitepress-theme-teek/index.css";
import NoticeContent from "./components/NoticeContent.vue";
import BannerImgArrow from "./components/BannerImgArrow.vue";
import "vitepress-theme-teek/vp-plus/code-block-mobile.scss"; // 移动端代码块样式加 padding
import "vitepress-theme-teek/vp-plus/sidebar.scss"; // 侧边栏字体样式
import "vitepress-theme-teek/vp-plus/nav.scss"; // 导航栏样式
// import "vitepress-theme-teek/vp-plus/nav-blur.scss"; // 导航栏毛玻璃样式
import "vitepress-theme-teek/vp-plus/aside.scss"; // 文章目录样式
import "vitepress-theme-teek/vp-plus/doc-h1-gradient.scss"; // 文档以及标题样式
import "vitepress-theme-teek/vp-plus/mark.scss"; // 文章 mark 标签样式
import "vitepress-theme-teek/vp-plus/container.scss"; // Markdown 容器样式
// import "vitepress-theme-teek/vp-plus/container-left.scss"; // Markdown 容器左框样式
// import "vitepress-theme-teek/vp-plus/container-flow.scss"; // Markdown 容器流体样式
// import "vitepress-theme-teek/vp-plus/blockquote.scss"; // 引用样式
// import "vitepress-theme-teek/vp-plus/index-rainbow.scss"; // Vitepress 首页彩虹渐变样式
import "vitepress-theme-teek/tk-plus/banner-desc-gradient.scss"; // Banner 描述渐变样式
import "vitepress-theme-teek/tk-plus/banner-full-img-scale.scss"; // Banner 全屏图片放大样式

import "./styles/index.scss";

import { useFooterRuntime } from "./helper/useFooterRuntime"; // 首页底部添加运行时间

export default {
  extends: Teek,
  Layout: defineComponent({
    name: "LayoutProvider",
    setup() {
      const { frontmatter } = useData();
      const { start, stop } = useFooterRuntime();

      watch(
        frontmatter,
        () => {
          nextTick(() => {
            if (frontmatter.value.layout === "home") start();
            else stop();
          });
        },
        { immediate: true }
      );

      return () =>
        h(Teek.Layout, null, {
          "teek-notice-content": () => h(NoticeContent),
          "teek-home-banner-feature-after": () => h(BannerImgArrow),

          // "teek-home-before": () => h("div", null, "teek-home-before"),
          // "teek-home-after": () => h("div", null, "teek-home-after"),
          // "teek-home-banner-before": () => h("div", null, "teek-home-banner-before"),
          // "teek-home-banner-after": () => h("div", null, "teek-home-banner-after"),
          // "teek-home-banner-content-before": () => h("div", null, "teek-home-banner-content-before"),
          // "teek-home-banner-content-after": () => h("div", null, "teek-home-banner-content-after"),
          // "teek-home-banner-feature-after": () => h("div", null, "teek-home-banner-feature-after"),
          // "teek-home-post-before": () => h("div", null, "teek-home-post-before"),
          // "teek-home-post-after": () => h("div", null, "teek-home-post-after"),
          // "teek-home-info-before": () => h("div", null, "teek-home-info-before"),
          // "teek-home-info-after": () => h("div", null, "teek-home-info-after"),
          // "teek-home-my-before": () => h("div", null, "teek-home-my-before"),
          // "teek-home-my-after": () => h("div", null, "teek-home-my-after"),
          // "teek-home-top-article-before": () => h("div", null, "teek-home-top-article-before"),
          // "teek-home-top-article-after": () => h("div", null, "teek-home-top-article-after"),
          // "teek-home-category-before": () => h("div", null, "teek-home-category-before"),
          // "teek-home-category-after": () => h("div", null, "teek-home-category-after"),
          // "teek-home-tag-before": () => h("div", null, "teek-home-tag-before"),
          // "teek-home-tag-after": () => h("div", null, "teek-home-tag-after"),
          // "teek-home-friend-link-before": () => h("div", null, "teek-home-friend-link-before"),
          // "teek-home-friend-link-after": () => h("div", null, "teek-home-friend-link-after"),
          // "teek-home-doc-analysis-before": () => h("div", null, "teek-home-doc-analysis-before"),
          // "teek-home-doc-analysis-after": () => h("div", null, "teek-home-doc-analysis-after"),
          // "teek-footer-before": () => h("div", null, "teek-footer-before"),
          // "teek-footer-after": () => h("div", null, "teek-footer-after"),

          // "teek-article-analyze-before": () => h("div", null, "teek-article-analyze-before"),
          // "teek-article-analyze-after": () => h("div", null, "teek-article-analyze-after"),
          // "teek-comment-before": () => h("div", null, "teek-comment-before"),
          // "teek-comment-after": () => h("div", null, "teek-comment-after"),
          // "teek-page-top-before": () => h("div", null, "teek-page-top-before"),
          // "teek-page-top-after": () => h("div", null, "teek-page-top-after"),

          // "teek-archives-top-before": () => h("div", null, "teek-archives-top-before"),
          // "teek-archives-top-after": () => h("div", null, "teek-archives-top-after"),
          // "teek-catalogue-top-before": () => h("div", null, "teek-catalogue-top-before"),
          // "teek-catalogue-top-after": () => h("div", null, "teek-catalogue-top-after"),

          // "teek-right-bottom-before": () => h("div", null, "teek-right-bottom-before"),
          // "teek-right-bottom-after": () => h("div", null, "teek-right-bottom-after"),
        });
    },
  }),
};
