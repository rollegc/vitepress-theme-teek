<script setup lang="ts" name="HomeBannerBgPure">
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useLocale } from "../../../hooks";
import type { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerBgPure" });

const ns = useNamespace("banner-bg-pure");
const { t } = useLocale();
const { getTeekConfig } = useTeekConfig();

const getStyle = () => {
  const { pureBgColor = "#28282d" } = getTeekConfig<Banner>("banner", {});
  return { backgroundColor: pureBgColor };
};
</script>

<template>
  <div :class="ns.b()" :style="getStyle()" :aria-label="t('tk.homeBanner.bgPureLabel')">
    <slot />
  </div>
</template>
