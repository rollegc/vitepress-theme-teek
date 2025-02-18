<script setup lang="ts" name="CommentGiscus">
import { useUnrefData } from "../configProvider";
import Giscus from "@giscus/vue";
import { useRouter, useData } from "vitepress";
import { ref, nextTick, onMounted, computed, unref } from "vue";
import { isFunction } from "../helper";
import { CommentProvider } from "../config/types";

const { isDark } = useData();
const { theme } = useUnrefData();

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
}: CommentProvider["giscus"] = { ...theme.comment?.options };

const giscusTheme = computed(() => {
  if (isFunction(giscusThemeConfig)) return giscusThemeConfig(unref(isDark));
  return giscusThemeConfig || (unref(isDark) ? "dark" : "light");
});

const router = useRouter();
const isShow = ref(false);

const reloadGiscus = () => {
  isShow.value = false;
  nextTick(() => {
    isShow.value = true;
  });
};

const initRoute = () => {
  const selfOnAfterRouteChange = router.onAfterRouteChange;
  // 路由切换后的回调
  router.onAfterRouteChange = (href: string) => {
    selfOnAfterRouteChange?.(href);
    // 路由切换后更新评论内容
    reloadGiscus();
  };
};

onMounted(() => {
  initRoute();
  reloadGiscus();
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
    <Giscus
      v-else
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
