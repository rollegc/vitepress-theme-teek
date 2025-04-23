<script setup lang="ts" name="Spotlight">
import type { ThemeEnhance } from "@teek/config";
import { computed } from "vue";
import { useStorage, useMediaQuery, useLocale } from "@teek/hooks";
import { clickIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { touchMedia } from "./themeEnhance";
import { spotlightStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import SpotlightHover from "./components/SpotlightHover.vue";

defineOptions({ name: "Spotlight" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const isMobile = useMediaQuery(touchMedia);
const spotlight = useStorage(spotlightStorageKey, themeEnhanceConfig.value.spotlight?.defaultToggle || true);

const segmentedOptions = computed(() => [
  {
    value: true,
    text: "ON",
    title: t("tk.themeEnhance.spotlight.onTipTitle"),
    ariaLabel: t("tk.themeEnhance.spotlight.onTipTitle"),
  },
  {
    value: false,
    text: "OFF",
    title: t("tk.themeEnhance.spotlight.offTipTitle"),
    ariaLabel: t("tk.themeEnhance.spotlight.offTipTitle"),
  },
]);

const tips = [
  {
    title: `ON ${t("tk.themeEnhance.spotlight.onTipTitle")}`,
    content: t("tk.themeEnhance.spotlight.onHelpTipContent"),
  },
  {
    title: `OFF ${t("tk.themeEnhance.spotlight.offTipTitle")}`,
    content: t("tk.themeEnhance.spotlight.offHelpTipContent"),
  },
];
</script>

<template>
  <BaseTemplate
    :icon="clickIcon"
    :title="t('tk.themeEnhance.spotlight.title')"
    :helper="!themeEnhanceConfig.spotlight?.disableHelp"
    :helper-desc="t('tk.themeEnhance.spotlight.helpDesc')"
    :tips
    :disabled="isMobile"
  >
    <TkSegmented v-model="spotlight" :options="segmentedOptions" :disabled="isMobile" />
  </BaseTemplate>

  <SpotlightHover v-if="spotlight && !isMobile" :enabled="spotlight && !isMobile" />
</template>
