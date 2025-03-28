<script setup lang="ts" name="CommentGiscus">
import { ref, nextTick, onMounted, computed, unref, inject } from "vue";
import { useData } from "vitepress";
import { isFunction } from "../../../helper";
import type { CommentProvider } from "../../../config/types";
import { useNamespace, useVpRouter } from "../../../hooks";
import { giscusSymbol } from "./giscus";

defineOptions({ name: "CommentGiscus" });

const ns = useNamespace("");
const vpRouter = useVpRouter();

const { theme, isDark } = useData();

const {
  repo,
  repoId,
  category,
  categoryId,
  mapping = "pathname",
  strict = "0",
  reactionsEnabled = "1",
  emitMetadata = "0",
  inputPosition = "top",
  lang = "zh-CN",
  theme: giscusThemeConfig,
  loading = "eager",
  useOnline = false,
  link = "https://giscus.app/client.js",
  integrity,
  ...options
}: CommentProvider["giscus"] = { ...unref(theme).comment?.options };

const giscusTheme = computed(() => {
  if (isFunction(giscusThemeConfig)) return giscusThemeConfig(unref(isDark));
  return giscusThemeConfig || (unref(isDark) ? "dark" : "light");
});

// 尝试从上下文获取 giscus 组件
const giscusComponentFn = inject(giscusSymbol);
const giscusComponent = giscusComponentFn?.(unref(theme).comment?.options);

const isShow = ref(false);

const reloadGiscus = () => {
  isShow.value = false;
  nextTick(() => {
    isShow.value = true;
  });
};

onMounted(() => {
  if (!useOnline && !giscusComponent) {
    return console.error(
      "[Teek Error] Giscus initialization failed. Please configure the 'useOnline' to 'true' or provide the giscus component"
    );
  }
  reloadGiscus();
  // 路由切换后更新评论内容
  vpRouter.bindAfterRouteChange(ns.joinNamespace("giscus"), () => {
    reloadGiscus();
  });
});
</script>

<template>
  <div v-if="isShow" class="giscus-container">
    <component
      v-if="useOnline"
      :is="'script'"
      defer
      :src="link"
      :integrity
      :data-repo="repo"
      :data-repo-id="repoId"
      :data-category="category"
      :data-category-id="categoryId"
      :data-mapping="mapping"
      :data-strict="strict"
      :data-reactions-enabled="reactionsEnabled"
      :data-emit-metadata="emitMetadata"
      :data-input-position="inputPosition"
      :data-theme="giscusTheme"
      :data-lang="lang"
      v-bind="options"
      crossorigin="anonymous"
    />
    <component
      v-else-if="giscusComponent"
      :is="giscusComponent"
      :repo
      :repo-id
      :category
      :category-id
      :mapping
      :reactions-enabled
      :emit-metadata
      :input-position
      :lang
      :theme="giscusTheme"
      :loading
      v-bind="options"
    />
  </div>
</template>
