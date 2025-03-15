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
          "notice-content": () => h(NoticeContent),
        });
    },
  }),
};
