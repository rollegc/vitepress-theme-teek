import Teeker from "vitepress-theme-teeker";
import NoticeContent from "./components/NoticeContent.vue";
import { defineComponent, h, nextTick, watch } from "vue";
import { useData } from "vitepress";
// import "vitepress-theme-teeker/index.css";
import "vitepress-theme-teeker/vp-plus/code-block-mobile.scss"; // 移动端代码块样式加 padding
import "vitepress-theme-teeker/vp-plus/sidebar.scss"; // 侧边栏字体样式
import "vitepress-theme-teeker/vp-plus/nav.scss"; // 导航栏样式
// import "vitepress-theme-teeker/vp-plus/nav-blur.scss"; // 导航栏毛玻璃样式
import "vitepress-theme-teeker/vp-plus/aside.scss"; // 文章目录样式
import "vitepress-theme-teeker/vp-plus/doc-h1.scss"; // 文档以及标题样式
import "vitepress-theme-teeker/vp-plus/mark.scss"; // 文章 mark 标签样式
import "vitepress-theme-teeker/vp-plus/container.scss"; // Markdown 容器样式
// import "vitepress-theme-teeker/vp-plus/container-left.scss"; // Markdown 容器左框样式
// import "vitepress-theme-teeker/vp-plus/container-flow.scss"; // Markdown 容器流体样式
// import "vitepress-theme-teeker/vp-plus/blockquote.scss"; // 引用样式
// import "vitepress-theme-teeker/vp-plus/rainbow.scss"; // Vitepress 首页彩虹渐变样式
import "vitepress-theme-teeker/vp-plus/banner-desc.scss"; // Banner 描述渐变样式

import { useFooterRuntime } from "./helper/useFooterRuntime"; // 首页底部添加运行时间

export default {
  extends: Teeker,
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
        h(Teeker.Layout, null, {
          "teeker-notice-content": () => h(NoticeContent),

          // "teeker-home-before": () => h("div", null, "teeker-home-before"),
          // "teeker-home-after": () => h("div", null, "teeker-home-after"),
          // "teeker-home-banner-before": () => h("div", null, "teeker-home-banner-before"),
          // "teeker-home-banner-after": () => h("div", null, "teeker-home-banner-after"),
          // "teeker-home-post-before": () => h("div", null, "teeker-home-post-before"),
          // "teeker-home-post-after": () => h("div", null, "teeker-home-post-after"),
          // "teeker-home-info-before": () => h("div", null, "teeker-home-info-before"),
          // "teeker-home-info-after": () => h("div", null, "teeker-home-info-after"),
          // "teeker-home-my-before": () => h("div", null, "teeker-home-my-before"),
          // "teeker-home-my-after": () => h("div", null, "teeker-home-my-after"),
          // "teeker-home-top-article-before": () => h("div", null, "teeker-home-top-article-before"),
          // "teeker-home-top-article-after": () => h("div", null, "teeker-home-top-article-after"),
          // "teeker-home-category-before": () => h("div", null, "teeker-home-category-before"),
          // "teeker-home-category-after": () => h("div", null, "teeker-home-category-after"),
          // "teeker-home-tag-before": () => h("div", null, "teeker-home-tag-before"),
          // "teeker-home-tag-after": () => h("div", null, "teeker-home-tag-after"),
          // "teeker-home-friend-link-before": () => h("div", null, "teeker-home-friend-link-before"),
          // "teeker-home-friend-link-after": () => h("div", null, "teeker-home-friend-link-after"),
          // "teeker-home-doc-analysis-before": () => h("div", null, "teeker-home-doc-analysis-before"),
          // "teeker-home-doc-analysis-after": () => h("div", null, "teeker-home-doc-analysis-after"),
          // "teeker-footer-before": () => h("div", null, "teeker-footer-before"),
          // "teeker-footer-after": () => h("div", null, "teeker-footer-after"),

          // "teeker-article-analyze-before": () => h("div", null, "teeker-article-analyze-before"),
          // "teeker-article-analyze-after": () => h("div", null, "teeker-article-analyze-after"),
          // "teeker-comment-before": () => h("div", null, "teeker-comment-before"),
          // "teeker-comment-after": () => h("div", null, "teeker-comment-after"),
          // "teeker-page-top-before": () => h("div", null, "teeker-page-top-before"),
          // "teeker-page-top-after": () => h("div", null, "teeker-page-top-after"),

          // "teeker-archives-top-before": () => h("div", null, "teeker-archives-top-before"),
          // "teeker-archives-top-after": () => h("div", null, "teeker-archives-top-after"),
          // "teeker-catalogue-top-before": () => h("div", null, "teeker-catalogue-top-before"),
          // "teeker-catalogue-top-after": () => h("div", null, "teeker-catalogue-top-after"),

          // "teeker-right-bottom-before": () => h("div", null, "teeker-right-bottom-before"),
          // "teeker-right-bottom-after": () => h("div", null, "teeker-right-bottom-after"),
        });
    },
  }),
};
