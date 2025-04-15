<script setup lang="ts" name="LayoutPageWidthSlide">
import { computed, watch, onMounted } from "vue";
import { useDebounce, useStorage, useMediaQuery } from "../../../hooks";
import { autoWidthIcon, scaleIcon } from "../../../assets/icons";
import BaseTemplate from "./components/BaseTemplate.vue";
import InputSlide from "./components/InputSlide.vue";
import { useTeekConfig } from "../../../configProvider";
import { LayoutMode } from "./layoutEnhance";
import { ns, layoutModeStorageKey, pageMaxWidthSlideStorageKey, transitionName, pageMaxWidthVar } from "./namespace";

defineOptions({ name: "LayoutPageWidthSlide" });

const { getTeekConfigRef } = useTeekConfig();
const layoutEnhanceConfig = getTeekConfigRef("layoutEnhance", {});

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const pageMaxWidth = useStorage(
  pageMaxWidthSlideStorageKey,
  layoutEnhanceConfig.value.layoutSwitch?.pageLayoutMaxWidth?.defaultMaxWidth || 90 * 100
);
const layoutMode = useStorage<LayoutMode>(
  layoutModeStorageKey,
  layoutEnhanceConfig.value.layoutSwitch?.defaultMode || LayoutMode.Original
);

const updatePageMaxWidth = (val: number) => {
  document.body.style.setProperty(pageMaxWidthVar, `${Math.ceil(val / 100)}%`);
};

onMounted(() => updatePageMaxWidth(pageMaxWidth.value));

const disabled = useMediaQuery("(max-width: 768px)");
const shouldActivateMaxWidth = useMediaQuery("(min-width: 1440px)");

watch(shouldActivateMaxWidth, () => {
  updatePageMaxWidth(pageMaxWidth.value);
});

const update = useDebounce(updatePageMaxWidth, 1000);
watch(pageMaxWidth, update);

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const tips = [
  { title: "调整页面最大宽度", icon: scaleIcon, content: "一个可调整的滑块，用于选择和自定义页面最大宽度。" },
];
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-show="layoutMode === LayoutMode.SidebarWidthAdjustableOnly || layoutMode === LayoutMode.BothWidthAdjustable"
      :icon="autoWidthIcon"
      title="页面最大宽度"
      desc="调整 VitePress 布局中页面的宽度，以适配不同的阅读习惯和屏幕环境。"
      :tips
      :disabled
      :helper="!layoutEnhanceConfig.layoutSwitch?.pageLayoutMaxWidth?.disableHelp"
    >
      <InputSlide v-model="pageMaxWidth" :disabled :min :max :format :class="ns.e('slide')" />
    </BaseTemplate>
  </Transition>
</template>
