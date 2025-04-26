<script setup lang="ts" name="ThemeColor">
import type { ThemeEnhance } from "@teek/config";
import type { SegmentedOption } from "@teek/components/common/Segmented";
import { computed, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { useStorage, useMediaQuery, useLocale, useThemeColor, varNameList } from "@teek/hooks";
import { clickIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { ThemeColor, mobileMaxWidthMedia, themeColorAttribute, themeColorList } from "./themeEnhance";
import { ns, themeColorStorageKey, themeBgColorStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import Switch from "./components/Switch.vue";

defineOptions({ name: "ThemeColor" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();
const { frontmatter } = useData();
const isMobile = useMediaQuery(mobileMaxWidthMedia);

const themeColor = useStorage<string>(
  themeColorStorageKey,
  themeEnhanceConfig.value.themeColor?.defaultColor || ThemeColor.vpDefault
);
const isSpread = useStorage(themeBgColorStorageKey, themeEnhanceConfig.value.themeColor?.defaultSpread || false);

// 主题色
const primaryColor = ref("");
// 根据 primaryColor 计算其他 var 变量需要的颜色，并直接覆盖这些 var 变量的颜色
const { start, stop, clear } = useThemeColor(primaryColor, () => {
  // 内置的 VP、EP 主题色需要忽略部分 var 变量，因为这些 var 变量已经固定，无需自动计算新的值替换（具体看 packages/theme-chalk/var/theme-color.scss 文件）
  if (themeColorList.includes(themeColor.value)) {
    return [varNameList.vpIndigo1, varNameList.vpIndigo2, varNameList.vpIndigo3, varNameList.vpIndigoSoft];
  }
});

/**
 * 更新主题模式
 */
const update = (val?: string) => {
  if (!val) return;
  const el = document.documentElement;

  if (themeColor.value !== val) themeColor.value = val;

  if (el.getAttribute(themeColorAttribute) === val) return;
  el.setAttribute(themeColorAttribute, val);

  // 先清除旧属性再获取新属性，否则一直获取的是旧属性
  clear();
  primaryColor.value = getComputedStyle(el).getPropertyValue(varNameList.vpIndigo1);
};

watch(themeColor, update);

// 文章单独设置主题模式
watch(() => frontmatter.value.themeColor, update);

// 扩散到其他 var 变量（useThemeColor hooks）
watch(
  isSpread,
  newVal => {
    if (newVal) start();
    else stop();
  },
  { immediate: true, flush: "post" }
);

onMounted(() => {
  if (frontmatter.value.themeColor) update(frontmatter.value.themeColor);
  else update(themeColor.value);
});

const themeColorSelectList = computed(() => {
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
    :class="ns.e('theme-color')"
    :icon="clickIcon"
    :helper="!themeEnhanceConfig.themeColor?.disableHelp"
    :helper-desc="t('tk.themeEnhance.themeColor.helpDesc')"
    :tips
    :disabled="isMobile"
  >
    <template #title>
      <div class="flx-justify-between flx-1">
        {{ t("tk.themeEnhance.themeColor.title") }}
        <div class="flx-align-center">
          <span class="label">{{ t("tk.themeEnhance.themeColor.speedLabel") }}</span>
          <Switch v-model="isSpread" />
        </div>
      </div>
    </template>
    <template v-for="item in themeColorSelectList" :key="item.label">
      <h3 :title="item.tip" :aria-label="item.label">{{ item.label }}</h3>
      <TkSegmented v-model="themeColor" :options="item.options" :disabled="isMobile" />
    </template>
  </BaseTemplate>
</template>
