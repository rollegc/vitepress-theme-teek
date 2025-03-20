<script setup lang="ts" name="NotFoundDelay">
import { useRouter } from "vitepress";
import { onMounted, ref } from "vue";
// @ts-ignore
import option from "virtual:not-found-option";
import type { NotFoundOption } from "..";
import NotFound from "vitepress/dist/client/theme-default/NotFound.vue";

const { notFoundDelayLoad = 400 } = { ...option } as NotFoundOption;

// 禁止加载 404 页面
const disableNotFoundPage = ref(true);

onMounted(() => {
  // 延迟 notFoundDelayLoad 再加载 404 页面。因为 permalink 插件支持自定义 URL，但是 VP 初始化时根据自定义 URL 寻找文档会 404，因此这里延迟来给 permalink 插件寻找正确的文档路径
  setTimeout(() => (disableNotFoundPage.value = false), notFoundDelayLoad);
});

const router = useRouter();

const selfOnBeforeRouteChange = router.onBeforeRouteChange;

router.onBeforeRouteChange = (href: string) => {
  disableNotFoundPage.value = true;
  setTimeout(() => (disableNotFoundPage.value = false), notFoundDelayLoad);

  selfOnBeforeRouteChange?.(href);
};
</script>

<template>
  <template v-if="!disableNotFoundPage">
    <slot name="not-found"><NotFound /></slot>
  </template>
</template>
