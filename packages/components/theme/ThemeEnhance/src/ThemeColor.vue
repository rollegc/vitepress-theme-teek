<script setup lang="ts" name="ThemeColor">
import type { ThemeEnhance } from "@teek/config";
import type { SegmentedOption } from "@teek/components/common/Segmented";
import { computed, onMounted, watch } from "vue";
import { useData } from "vitepress";
import { useStorage, useMediaQuery, useLocale } from "@teek/hooks";
import { clickIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { ThemeColor, mobileMaxWidthMedia, themeColorAttribute } from "./themeEnhance";
import { ns, themeColorStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "ThemeColor" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();
const { frontmatter } = useData();

const themeColor = useStorage(
  themeColorStorageKey,
  themeEnhanceConfig.value.themeColor?.defaultColor || ThemeColor.vpDefault
);
const isMobile = useMediaQuery(mobileMaxWidthMedia);

const update = (val: string) => {
  const el = document.documentElement;

  if (el.getAttribute(themeColorAttribute) === val) return;
  el.setAttribute(themeColorAttribute, val);
};

watch(themeColor, val => {
  update(val);
});

/**
 * 支持文章单独设置主题色
 */
watch(
  () => frontmatter.value.themeColor,
  newVal => {
    if (newVal) update(newVal);
  }
);

onMounted(() => {
  if (frontmatter.value.themeColor) update(frontmatter.value.themeColor);
  else update(themeColor.value);
});

const themeColorList = computed(() => {
  const { append = [] } = themeEnhanceConfig.value.themeColor || {};
  return [
    {
      label: t("tk.themeEnhance.themeColor.vpLabel"),
      tip: t("tk.themeEnhance.themeColor.vpTip"),
      options: [
        {
          value: ThemeColor.vpDefault,
          text: t("tk.themeEnhance.themeColor.defaultLabel"),
          title: `VitePress ${t("tk.themeEnhance.themeColor.defaultLabel")}`,
          ariaLabel: `VitePress ${t("tk.themeEnhance.themeColor.defaultLabel")}`,
        },
        {
          value: ThemeColor.vpGreen,
          text: t("tk.themeEnhance.themeColor.greenLabel"),
          title: `VitePress ${t("tk.themeEnhance.themeColor.greenLabel")}`,
          ariaLabel: `VitePress ${t("tk.themeEnhance.themeColor.greenLabel")}`,
        },
        {
          value: ThemeColor.vpYellow,
          text: t("tk.themeEnhance.themeColor.yellowLabel"),
          title: `VitePress ${t("tk.themeEnhance.themeColor.yellowLabel")}`,
          ariaLabel: `VitePress ${t("tk.themeEnhance.themeColor.yellowLabel")}`,
        },
        {
          value: ThemeColor.vpRed,
          text: t("tk.themeEnhance.themeColor.redLabel"),
          title: `VitePress ${t("tk.themeEnhance.themeColor.redLabel")}`,
          ariaLabel: `VitePress ${t("tk.themeEnhance.themeColor.redLabel")}`,
        },
      ],
    },
    {
      label: t("tk.themeEnhance.themeColor.epLabel"),
      tip: t("tk.themeEnhance.themeColor.epTip"),
      options: [
        {
          value: ThemeColor.epBlue,
          text: `${t("tk.themeEnhance.themeColor.blueLabel")}`,
          title: `ElementPlus ${t("tk.themeEnhance.themeColor.blueLabel")}`,
          ariaLabel: `ElementPlus ${t("tk.themeEnhance.themeColor.blueLabel")}`,
        },
        {
          value: ThemeColor.epGreen,
          text: `${t("tk.themeEnhance.themeColor.greenLabel")}`,
          title: `ElementPlus ${t("tk.themeEnhance.themeColor.greenLabel")}`,
          ariaLabel: `ElementPlus ${t("tk.themeEnhance.themeColor.greenLabel")}`,
        },
        {
          value: ThemeColor.epYellow,
          text: `${t("tk.themeEnhance.themeColor.yellowLabel")}`,
          title: `ElementPlus ${t("tk.themeEnhance.themeColor.yellowLabel")}`,
          ariaLabel: `ElementPlus ${t("tk.themeEnhance.themeColor.yellowLabel")}`,
        },
        {
          value: ThemeColor.epRed,
          text: `${t("tk.themeEnhance.themeColor.redLabel")}`,
          title: `ElementPlus ${t("tk.themeEnhance.themeColor.redLabel")}`,
          ariaLabel: `ElementPlus ${t("tk.themeEnhance.themeColor.redLabel")}`,
        },
      ],
    },
    ...append,
  ] as { label: string; tip: string; options: SegmentedOption[] }[];
});

const tips = [
  { title: t("tk.themeEnhance.themeColor.vpHelpTipTitle"), content: t("tk.themeEnhance.themeColor.vpHelpTipContent") },
  { title: t("tk.themeEnhance.themeColor.epHelpTipTitle"), content: t("tk.themeEnhance.themeColor.epHelpTipContent") },
];
</script>

<template>
  <BaseTemplate
    :class="ns.e('layout-color')"
    :icon="clickIcon"
    :title="t('tk.themeEnhance.themeColor.title')"
    :helper="!themeEnhanceConfig.themeColor?.disableHelp"
    :helper-desc="t('tk.themeEnhance.themeColor.helpDesc')"
    :tips
    :disabled="isMobile"
  >
    <template v-for="item in themeColorList" :key="item.label">
      <h3 :title="item.tip" :aria-label="item.label">{{ item.label }}</h3>
      <TkSegmented v-model="themeColor" :options="item.options" :disabled="isMobile" />
    </template>
  </BaseTemplate>
</template>
