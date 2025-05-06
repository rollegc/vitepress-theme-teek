<script setup lang="ts" name="CommentTwikoo">
import type { CommentProvider } from "@teek/config";
import { ref, onMounted } from "vue";
import { isClient } from "@teek/helper";
import { useNamespace, useVpRouter } from "@teek/hooks";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";

defineOptions({ name: "CommentTwikoo" });

const ns = useNamespace("");
const vpRouter = useVpRouter();

const { getTeekConfig } = useTeekConfig();
const twikooOptions = getTeekConfig<CommentProvider["twikoo"]>("comment", {}).options;

const {
  envId,
  link = "https://gcore.jsdelivr.net/npm/twikoo@{version}/dist/twikoo.min.js",
  version = "1.6.41",
  katex,
  timeout = 700,
  ...options
} = twikooOptions;

const initTwikoo = () => {
  if (!isClient) return console.error("[Teek Error] Not in the client");
  if (!envId) return console.error("[Teek Error] Twikoo initialization failed. Please configure the 'envId'");

  if ((window as any).twikoo) (window as any).twikoo.init({ ...options, envId, el: "#twikoo" });
};

const twikooJs = ref<HTMLScriptElement | null>(null);

const initJs = () => {
  const t = twikooJs.value;
  if (t) t.onload = initTwikoo;
};

const reloadTwikoo = (to: string) => {
  if (to) setTimeout(initTwikoo, timeout);
};

onMounted(() => {
  initJs();
  // 路由切换后更新评论内容
  twikooJs.value && vpRouter.bindAfterRouteChange(ns.joinNamespace("twikoo"), href => reloadTwikoo(href));
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
