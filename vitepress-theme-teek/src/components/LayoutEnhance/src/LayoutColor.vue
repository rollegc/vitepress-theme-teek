<script setup lang="ts" name="LayoutColor">
import { computed, onMounted, watch } from "vue";
import { clickIcon } from "../../../assets/icons";
import { useStorage, useMediaQuery } from "../../../hooks";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";
import { LayoutColor } from "./layoutEnhance";
import { ns, layoutColorSlideStorageKey } from "./namespace";
import { useTeekConfig } from "../../../configProvider";

defineOptions({ name: "LayoutColor" });

const { getTeekConfigRef } = useTeekConfig();
const layoutEnhanceConfig = getTeekConfigRef("layoutEnhance", {});

const attribute = "layout-color";
const layoutColor = useStorage(
  layoutColorSlideStorageKey,
  layoutEnhanceConfig.value.layoutColor?.defaultColor || LayoutColor.vpDefault
);
const disabled = useMediaQuery("(max-width: 768px)");

const update = (val: string) => {
  const el = document.documentElement;

  if (el.getAttribute(attribute) === val) return;
  el.setAttribute(attribute, val);
};

watch(layoutColor, val => {
  update(val);
});

onMounted(() => {
  update(layoutColor.value);
});

const vitePressContent = computed(() => [
  {
    value: LayoutColor.vpDefault,
    text: "VP 蓝",
    title: "VitePress 默认色",
    helpMessage: "VitePress 的默认颜色板。",
    ariaLabel: "VitePress 默认色",
  },
  {
    value: LayoutColor.vpGreen,
    text: "VP 绿",
    title: "VitePress 绿",
    helpMessage: "VitePress 的绿色板。",
    ariaLabel: "VitePress 绿",
  },
  {
    value: LayoutColor.vpYellow,
    text: "VP 黄",
    title: "VitePress 黄",
    helpMessage: "VitePress 的黄色板。",
    ariaLabel: "VitePress 黄",
  },
  {
    value: LayoutColor.vpRed,
    text: "VP 红",
    title: "VitePress 红",
    helpMessage: "VitePress 的红色板。",
    ariaLabel: "VitePress 红",
  },
]);

const vitePressSegmentedOptions = computed(() =>
  vitePressContent.value.map(item => ({
    value: item.value,
    text: item.text,
    title: item.title,
    ariaLabel: item.ariaLabel,
  }))
);

const elementPlusContent = computed(() => [
  {
    value: LayoutColor.epBlue,
    text: "EP 蓝",
    title: "Element Plus 蓝",
    helpMessage: "Element Plus 的蓝色板主题。",
    ariaLabel: "Element Plus 蓝",
  },
  {
    value: LayoutColor.epGreen,
    text: "EP 绿",
    title: "Element Plus 绿",
    helpMessage: "Element Plus 的绿色主题。",
    ariaLabel: "Element Plus 绿",
  },
  {
    value: LayoutColor.epYellow,
    text: "EP 黄",
    title: "Element Plus 黄",
    helpMessage: "Element Plus 的黄色主题。",
    ariaLabel: "Element Plus 黄",
  },
  {
    value: LayoutColor.epRed,
    text: "EP 红",
    title: "Element Plus 红",
    helpMessage: "Element Plus 的红色主题。",
    ariaLabel: "Element Plus 红",
  },
]);

const elementPluSegmentedOptions = computed(() =>
  elementPlusContent.value.map(item => ({
    value: item.value,
    text: item.text,
    title: item.title,
    ariaLabel: item.ariaLabel,
  }))
);

const tips = [
  { text: "VitePress 基础色板", content: "提供蓝、绿、黄、红 4 种 VitePress 主题色板" },
  { text: "Element Plus 基础色板", content: "提供蓝、绿、黄、红 4 种 Element Plus 主题色板" },
];
</script>

<template>
  <BaseTemplate
    :class="ns.e('layout-color')"
    :icon="clickIcon"
    title="主题色切换"
    desc="提供 VitePress 基础的所有色板和 Element Plus 的基础色板选择"
    :tips
    :disabled
    :helper="!layoutEnhanceConfig.layoutColor?.disableHelp"
  >
    <Segmented v-model="layoutColor" :options="vitePressSegmentedOptions" :disabled="disabled" />
    <Segmented v-model="layoutColor" :options="elementPluSegmentedOptions" :disabled="disabled" />
  </BaseTemplate>
</template>
