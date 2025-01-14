<script setup lang="ts">
import { useData, useRoute, useRouter } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { nextTick, provide, watch, onMounted } from "vue";
import { data as posts } from "../data/posts.data";

defineOptions({
  name: "TkLayout",
});

const { isDark, theme, site } = useData();

const route = useRoute();
const router = useRouter();

watch(
  () => route.path,
  async newVal => {
    const { permalinks = {} } = site.value;
    const path = decodeURIComponent(newVal);
    const permalink = permalinks[path];

    const { searchParams, hash } = new URL(window.location.href!);

    const last = `${hash ? hash : ""}${searchParams.size ? "?" + searchParams.toString() : ""}`;

    if (permalink) {
      await nextTick();
      history.replaceState({}, "", `${permalink}${last}`);
    } else {
      for (const [key, value] of Object.entries(permalinks)) {
        if (value === path) {
          history.replaceState({}, "", `${key}?${last}`);
          location.reload();
        }
      }
    }
  },
  {
    immediate: true,
  }
);

const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
