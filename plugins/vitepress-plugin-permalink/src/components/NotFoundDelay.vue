<script setup lang="ts" name="NotFoundDelay">
import { useRouter, useData } from "vitepress";
import { onBeforeMount, ref } from "vue";
import NotFound from "vitepress/dist/client/theme-default/NotFound.vue";
import usePermalink from "../usePermalink";

const router = useRouter();
const { site, theme, title } = useData();
const { teyGetFilePathByPermalink } = usePermalink();

// 禁止加载 404 页面
const disableNotFoundPage = ref(true);

const unDisableNotFoundPage = () => {
  disableNotFoundPage.value = false;
  // 还原浏览器标题
  document.title = title.value;
};

onBeforeMount(() => {
  // 清除浏览器标题，防止出现 404 文字
  document.title = "";
  const { permalinks } = theme.value;
  if (!permalinks && !Object.keys(permalinks || {}).length) unDisableNotFoundPage();

  const { pathname, search, hash } = new URL(window.location.href);
  const filePath = teyGetFilePathByPermalink(pathname);

  if (filePath) {
    // 尝试获取文件路径（当 pathname 为 permalink 时才获取成功）
    const targetUrl = site.value.base + filePath + search + hash;
    router.go(targetUrl);

    // 1s 后如果为成功跳转文件地址，则打开 404 页面
    setTimeout(unDisableNotFoundPage, 1000);
  } else unDisableNotFoundPage();
});
</script>

<template>
  <template v-if="!disableNotFoundPage">
    <slot name="not-found"><NotFound /></slot>
  </template>
</template>
