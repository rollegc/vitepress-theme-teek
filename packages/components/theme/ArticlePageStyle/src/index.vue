<script setup lang="ts" name="ArticlePageStyle">
import type { TeekConfig } from "@teek/config";
import { watch } from "vue";
import { isClient } from "@teek/helper";
import { useNamespace } from "@teek/hooks";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";

const ns = useNamespace("body-bg-image");

const { getTeekConfigRef } = useTeekConfig();

const pageStyle = getTeekConfigRef<TeekConfig["pageStyle"]>("pageStyle", "default");

watch(
  pageStyle,
  () => {
    if (!isClient) return;

    const tkLayoutDom = document.querySelector(`.${ns.joinNamespace("layout")}`);
    // 清除可能已经存在的 pageStyle
    ["default", "card", "card-nav", "segment", "segment-nav"].forEach(item =>
      tkLayoutDom?.classList.remove(ns.joinNamespace(item))
    );

    tkLayoutDom?.classList.add(ns.joinNamespace(pageStyle.value));
  },
  { immediate: true }
);
</script>

<template></template>
