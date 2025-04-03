<script setup lang="ts" name="ArticlePageStyle">
import { computed, unref, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";

const ns = useNamespace("body-bg-image");

const { theme, frontmatter } = useData();

const pageStyle = computed(() => unref(frontmatter).pageStyle || unref(theme).pageStyle || "default");

watch(
  pageStyle,
  () => {
    const tkLayoutDom = document.querySelector(`.${ns.joinNamespace("layout")}`);
    // 清除可能已经存在的 pageStyle
    ["default", "card", "card-nav", "segment", "segment-nav"].forEach(item =>
      tkLayoutDom?.classList.remove(ns.joinNamespace(item))
    );

    tkLayoutDom?.classList.add(ns.joinNamespace(unref(pageStyle)));
  },
  { immediate: true }
);
</script>

<template></template>
