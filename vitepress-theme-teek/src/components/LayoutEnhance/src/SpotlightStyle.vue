<script setup lang="ts" name="SpotlightStyle">
import { computed } from "vue";
import { useStorage, useMediaQuery, useLocale } from "@teek/hooks";
import { useTeekConfig } from "@teek/configProvider";
import { clickIcon, alignLeftIcon, alignTextLeftIcon } from "@teek/assets";
import { SpotlightStyle, touchMedia } from "./layoutEnhance";
import { spotlightStyleStorageKey, spotlightStorageKey, transitionName } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";

defineOptions({ name: "SpotlightStyle" });

const { getTeekConfigRef } = useTeekConfig();
const layoutEnhanceConfig = getTeekConfigRef("layoutEnhance", {});
const { t } = useLocale();

const spotlightStyle = useStorage(
  spotlightStyleStorageKey,
  layoutEnhanceConfig.value.spotlight?.defaultStyle || SpotlightStyle.Aside
);
const spotlightToggledOn = useStorage(spotlightStorageKey, layoutEnhanceConfig.value.spotlight?.defaultToggle || false);
const disabled = useMediaQuery(touchMedia);

const content = computed(() => [
  {
    value: SpotlightStyle.Aside,
    title: t("tk.layoutEnhance.spotlightStyles.asideTipTitle"),
    helpMessage: t("tk.layoutEnhance.spotlightStyles.asideHelpTipContent"),
    ariaLabel: t("tk.layoutEnhance.spotlightStyles.asideTipTitle"),
    icon: alignTextLeftIcon,
  },
  {
    value: SpotlightStyle.Under,
    title: t("tk.layoutEnhance.spotlightStyles.underTipTitle"),
    helpMessage: t("tk.layoutEnhance.spotlightStyles.underHelpTipContent"),
    ariaLabel: t("tk.layoutEnhance.spotlightStyles.underTipTitle"),
    icon: alignLeftIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.ariaLabel,
    icon: item.icon,
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-if="spotlightToggledOn"
      :icon="clickIcon"
      :title="t('tk.layoutEnhance.spotlightStyles.title')"
      :helper="!layoutEnhanceConfig.spotlight?.disableHelp"
      :helper-desc="t('tk.layoutEnhance.spotlightStyles.helpDesc')"
      :tips
      :disabled
    >
      <Segmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="disabled" />
    </BaseTemplate>
  </Transition>
</template>
