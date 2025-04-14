<script setup lang="ts" name="LayoutSwitch">
import { computed, inject, onMounted, ref, watch } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import {
  fullscreenIcon,
  fullScreenOneIcon,
  fullscreenTwoIcon,
  layoutIcon,
  overallReductionIcon,
} from "../../../assets/icons";
import { readingEnhanceNsSymbol, LayoutMode, layoutModeStorageKey } from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const disabled = ref(false);

const attribute = "layout-mode";
const layoutMode = useStorage(layoutModeStorageKey, LayoutMode.Original);

const updateLayoutMode = (value: string) => {
  if ([document.documentElement.getAttribute(attribute)].includes(value)) return;

  document.documentElement.setAttribute(attribute, value);
};

watch(layoutMode, val => {
  updateLayoutMode(val);
});

onMounted(() => {
  updateLayoutMode(layoutMode.value);

  document.documentElement.setAttribute(`${attribute}-animated`, "true");
});

const content = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: "全部展开",
    helpMessage: "调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境。",
    ariaLabel: "全部展开",
    icon: fullScreenOneIcon,
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: "全部展开，但侧边栏宽度可调",
    helpMessage: "侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度。",
    ariaLabel: "全部展开，但侧边栏宽度可调",
    icon: fullscreenTwoIcon,
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: "全部展开，且侧边栏和内容区域宽度均可调",
    helpMessage: "侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度。",
    ariaLabel: "全部展开，且侧边栏和内容区域宽度均可调",
    icon: fullscreenIcon,
  },
  {
    value: LayoutMode.Original,
    title: "原始宽度",
    helpMessage: "原始的 VitePress 默认布局宽度",
    ariaLabel: "原始宽度",
    icon: overallReductionIcon,
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

const messageList = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <BaseTemplate
    :class="ns.e('layout-switch')"
    title="布局切换"
    :icon="layoutIcon"
    desc="调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境。"
    :message-list
    :disabled
  >
    <Segmented v-model="layoutMode" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>
</template>
