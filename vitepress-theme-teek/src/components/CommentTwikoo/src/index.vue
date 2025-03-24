<script setup lang="ts" name="CommentTwikoo">
import { ref, onMounted, unref } from "vue";
import { useUnrefData } from "../../../configProvider";
import { CommentProvider } from "../../../config/types";
import { useNamespace, useVpRouter } from "../../../hooks";

defineOptions({ name: "CommentTwikoo" });

const ns = useNamespace("");
const vpRouter = useVpRouter();

const { theme } = useUnrefData();

const {
  envId,
  link = "https://cdn.jsdelivr.net/npm/twikoo@{version}/dist/twikoo.min.js",
  version = "1.6.41",
  katex,
  timeout = 700,
  ...options
}: CommentProvider["twikoo"] = { ...theme.comment?.options };

const initTwikoo = () => {
  if (!envId) return;
  try {
    (window as any).twikoo.init({ ...options, envId, el: "#twikoo" });
  } catch (e) {}
};

const twikooJs = ref<HTMLScriptElement | null>(null);

const initJs = () => {
  const t = unref(twikooJs);
  if (t) t.onload = initTwikoo;
};

const reloadTwikoo = (to: string) => {
  if (to) setTimeout(initTwikoo, timeout);
};

onMounted(() => {
  if (!envId) return;

  initJs();
  // 路由切换后更新评论内容
  vpRouter.bindAfterRouteChange(ns.joinNamespace("twikoo"), href => reloadTwikoo(href));
});
</script>

<template>
  <div class="twikoo-container">
    <!-- KaTeX -->
    <template v-if="katex">
      <link rel="stylesheet" :href="katex.cssLink" :integrity="katex.cssIntegrity" crossorigin="anonymous" />
      <component
        :is="'script'"
        defer
        :src="katex.coreJsLink"
        :integrity="katex.coreJsIntegrity"
        crossorigin="anonymous"
      />
      <component
        :is="'script'"
        defer
        :src="katex.renderJsLink"
        :integrity="katex.renderJsIntegrity"
        crossorigin="anonymous"
      />
    </template>

    <div id="twikoo" />

    <component :is="'script'" :src="link.replace('{version}', version)" crossorigin="anonymous" ref="twikooJs" />
  </div>
</template>
