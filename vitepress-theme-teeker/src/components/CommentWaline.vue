<script setup lang="ts" name="CommentWaline">
import { useUnrefData } from "../configProvider";
import { useRouter } from "vitepress";
import { init, type WalineInstance } from "@waline/client";
import "@waline/client/style";

import { onMounted } from "vue";
import { CommentProvider } from "../config/types";

const { theme } = useUnrefData();
const router = useRouter();

const {
  serverURL,
  jsLink,
  cssLink,
  dark = "html[class='dark']",
  cssIntegrity,
  ...options
}: CommentProvider["waline"] = { ...theme.comment?.options };

let waline: WalineInstance | null = null;

const initWaline = async () => {
  if (jsLink) {
    // 异步加载 js 文件
    const { init } = await import(/* @vite-ignore */ jsLink);
    waline = init({ dark, ...options, serverURL, el: "#waline" });
  } else waline = init({ ...options, serverURL, dark, el: "#waline" });
};

const initRoute = () => {
  const selfOnAfterRouteChange = router.onAfterRouteChange;
  // 路由切换后的回调
  router.onAfterRouteChange = (href: string) => {
    selfOnAfterRouteChange?.(href);
    // 路由切换后更新评论内容
    waline?.update();
  };
};

/**
 * 默认点击个人头像会滚动到页面顶部，因为个人头像由 a 标签包裹，且 href="#"，所以删除 href 属性
 */
const preventJump = () => {
  const loginNickLink = document.querySelector<HTMLAnchorElement>(".wl-login-nick");
  loginNickLink && loginNickLink.removeAttribute("href");
};

onMounted(async () => {
  if (!serverURL && !waline) return;

  await initWaline();
  initRoute();
  preventJump();
});
</script>

<template>
  <div class="waline-container">
    <link v-if="cssLink" rel="stylesheet" :href="cssLink" :integrity="cssIntegrity" crossorigin="anonymous" />
    <div id="waline" />
  </div>
</template>
