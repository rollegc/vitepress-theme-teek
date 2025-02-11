<script setup lang="ts" name="CommentTwikoo">
import { ref, onMounted } from "vue";
import { useRouter } from "vitepress";
import { useUnrefData } from "../configProvider";

const { theme } = useUnrefData();

const {
  envId,
  link = "https://cdn.jsdelivr.net/npm/twikoo@{version}/dist/twikoo.min.js",
  version = "1.6.41",
  katex = {},
  timeout = 700,
  ...options
} = { ...theme.comment?.options };

const initTwikoo = () => {
  if (!envId) return;
  try {
    (window as any).twikoo.init({ ...options, envId, el: "#twikoo" });
  } catch (e) {}
};

const twikooJs = ref(null);
const router = useRouter();

const initJs = () => {
  if (twikooJs.value) {
    twikooJs.value.onload = initTwikoo;

    const selfOnAfterRouteChange = router.onAfterRouteChange;
    // 路由切换后的回调
    router.onAfterRouteChange = async (href: string) => {
      selfOnAfterRouteChange?.(href);
      // 路由切换后更新评论内容
      reloadTwikoo(href);
    };
  }
};

const reloadTwikoo = (to: string) => {
  if (to) setTimeout(initTwikoo, timeout);
};

onMounted(() => {
  if (!envId) return;

  initTwikoo();
  initJs();
});
</script>

<template>
  <div class="twikoo-container">
    <!-- KaTeX -->
    <template v-if="katex">
      <link rel="stylesheet" :href="katex.cssLink" :integrity="katex.cssIntegrity" crossorigin="anonymous" />
      <component :is="'script'" defer :src="katex.coreLink" :integrity="katex.coreIntegrity" crossorigin="anonymous" />
      <component
        :is="'script'"
        defer
        :src="katex.renderLink"
        :integrity="katex.renderIntegrity"
        crossorigin="anonymous"
      />
    </template>

    <div id="twikoo" />

    <component :is="'script'" :src="link.replace('{version}', version)" crossorigin="anonymous" ref="twikooJs" />
  </div>
</template>
