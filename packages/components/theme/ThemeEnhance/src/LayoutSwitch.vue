<script setup lang="ts" name="LayoutSwitch">
import type { ThemeEnhance } from "@teek/config";
import { computed, onMounted, watch } from "vue";
import { useStorage, useMediaQuery, useLocale } from "@teek/hooks";
import { fullscreenIcon, fullScreenOneIcon, fullscreenTwoIcon, layoutIcon, overallReductionIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { LayoutMode, layoutModeAttribute, mobileMaxWidthMedia } from "./themeEnhance";
import { layoutModeStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "LayoutSwitch" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const layoutMode = useStorage(
  layoutModeStorageKey,
  themeEnhanceConfig.value.layoutSwitch?.defaultMode || LayoutMode.Original
);
const isMobile = useMediaQuery(mobileMaxWidthMedia);

const update = (val: string) => {
  const el = document.documentElement;

  if (el.getAttribute(layoutModeAttribute) === val) return;
  el.setAttribute(layoutModeAttribute, val);
};

watch(layoutMode, val => {
  update(val);
});

onMounted(() => {
  update(layoutMode.value);

  if (!themeEnhanceConfig.value.layoutSwitch?.disableAnimation) {
    document.documentElement.setAttribute(`${layoutModeAttribute}-animated`, "true");
  }
});

const content = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: t("tk.themeEnhance.layoutSwitch.fullWidthTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.fullWidthHelpTipContent"),
    icon: fullScreenOneIcon,
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: t("tk.themeEnhance.layoutSwitch.sidebarWidthAdjustableOnlyTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.sidebarWidthAdjustableOnlyHelpTipContent"),
    icon: fullscreenTwoIcon,
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: t("tk.themeEnhance.layoutSwitch.bothWidthAdjustableTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.bothWidthAdjustableHelpTipContent"),
    icon: fullscreenIcon,
  },
  {
    value: LayoutMode.Original,
    title: t("tk.themeEnhance.layoutSwitch.originalWidthTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.originalWidthHelpTipContent"),
    icon: overallReductionIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.title,
    icon: item.icon,
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.tipContent,
  }))
);
</script>

<template>
  <BaseTemplate
    :icon="layoutIcon"
    :title="t('tk.themeEnhance.layoutSwitch.title')"
    :helper="!themeEnhanceConfig.layoutSwitch?.disableHelp"
    :helper-desc="t('tk.themeEnhance.layoutSwitch.helpDesc')"
    :tips
    :disabled="isMobile"
  >
    <TkSegmented v-model="layoutMode" :options="segmentedOptions" :disabled="isMobile" />
  </BaseTemplate>
</template>
