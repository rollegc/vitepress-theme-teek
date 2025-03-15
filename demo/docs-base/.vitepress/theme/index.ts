import Teeker from "vitepress-theme-teeker";
import NoticeContent from "./components/NoticeContent.vue";
import { defineComponent, h, onMounted } from "vue";
// import "vitepress-theme-teeker/index.css";
import "vitepress-theme-teeker/vp-plus/code-block-mobile.scss";
import "vitepress-theme-teeker/vp-plus/sidebar.scss";
import "vitepress-theme-teeker/vp-plus/nav.scss";
import "vitepress-theme-teeker/vp-plus/aside.scss";
import "vitepress-theme-teeker/vp-plus/doc-h1.scss";
// import "vitepress-theme-teeker/vp-plus/container.scss";
// import "vitepress-theme-teeker/vp-plus/blockquote.scss";
// import "vitepress-theme-teeker/vp-plus/rainbow.scss";

import { useFooterRuntime } from "./helper/useFooterRuntime";

export default {
  extends: Teeker,
  Layout: defineComponent({
    name: "LayoutProvider",
    setup() {
      onMounted(() => useFooterRuntime().start());

      return () =>
        h(Teeker.Layout, null, {
          "teeker-notice-content": () => h(NoticeContent),
          "teeker-home-before": () => h("div", null, "teeker-home-before"),
          "teeker-home-after": () => h("div", null, "teeker-home-after"),
          "teeker-home-banner-before": () => h("div", null, "teeker-home-banner-before"),
          "teeker-home-banner-after": () => h("div", null, "teeker-home-banner-after"),
          "teeker-home-post-before": () => h("div", null, "teeker-home-post-before"),
          "teeker-home-post-after": () => h("div", null, "teeker-home-post-after"),
          "teeker-footer-before": () => h("div", null, "teeker-footer-before"),
          "teeker-footer-after": () => h("div", null, "teeker-footer-after"),
          "teeker-article-analyze-before": () => h("div", null, "teeker-article-analyze-before"),
          "teeker-article-analyze-after": () => h("div", null, "teeker-article-analyze-after"),
          "teeker-comment-before": () => h("div", null, "teeker-comment-before"),
          "teeker-comment-after": () => h("div", null, "teeker-comment-after"),
          "teeker-page-top-before": () => h("div", null, "teeker-page-top-before"),
          "teeker-page-top-after": () => h("div", null, "teeker-page-top-after"),
          "teeker-archives-top-before": () => h("div", null, "teeker-archives-top-before"),
          "teeker-archives-top-after": () => h("div", null, "teeker-archives-top-after"),
          "teeker-catalogue-top-before": () => h("div", null, "teeker-catalogue-top-before"),
          "teeker-catalogue-top-after": () => h("div", null, "teeker-catalogue-top-after"),
          "teeker-right-bottom-before": () => h("div", null, "teeker-right-bottom-before"),
          "teeker-right-bottom-after": () => h("div", null, "teeker-right-bottom-after"),

          "teeker-home-info-before": () => h("div", null, "teeker-home-info-before"),
          "teeker-home-info-after": () => h("div", null, "teeker-home-info-after"),
          "teeker-home-my-before": () => h("div", null, "teeker-home-my-before"),
          "teeker-home-my-after": () => h("div", null, "teeker-home-my-after"),
          "teeker-home-top-article-before": () => h("div", null, "teeker-home-top-article-before"),
          "teeker-home-top-article-after": () => h("div", null, "teeker-home-top-article-after"),
          "teeker-home-category-before": () => h("div", null, "teeker-home-category-before"),
          "teeker-home-category-after": () => h("div", null, "teeker-home-category-after"),
          "teeker-home-tag-before": () => h("div", null, "teeker-home-tag-before"),
          "teeker-home-tag-after": () => h("div", null, "teeker-home-tag-after"),
          "teeker-home-friend-link-before": () => h("div", null, "teeker-home-friend-link-before"),
          "teeker-home-friend-link-after": () => h("div", null, "teeker-home-friend-link-after"),
          "teeker-home-doc-analysis-before": () => h("div", null, "teeker-home-doc-analysis-before"),
          "teeker-home-doc-analysis-after": () => h("div", null, "teeker-home-doc-analysis-after"),
        });
    },
  }),
};
