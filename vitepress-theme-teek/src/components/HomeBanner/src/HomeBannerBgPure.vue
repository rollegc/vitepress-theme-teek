<script setup lang="ts" name="HomeBannerBgPure">
import { useUnrefData } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerBgPure" });

const ns = useNamespace("bannerBgPure");

const { theme, frontmatter } = useUnrefData();

const { pureBgColor = "#28282d" }: Banner = { ...theme.banner, ...frontmatter.tk?.banner };

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
