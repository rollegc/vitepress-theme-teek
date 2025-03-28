<script setup lang="ts" name="HomeBannerBgPure">
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import { Banner } from "../../../config/types";
import { unref } from "vue";

defineOptions({ name: "HomeBannerBgPure" });

const ns = useNamespace("bannerBgPure");

const { theme, frontmatter } = useData();

const { pureBgColor = "#28282d" }: Banner = { ...unref(theme).banner, ...unref(frontmatter).tk?.banner };

const getStyle = () => {
  return {
    backgroundColor: pureBgColor,
  };
};
</script>

<template>
  <div :class="ns.b()" :style="getStyle()">
    <slot />
  </div>
</template>
