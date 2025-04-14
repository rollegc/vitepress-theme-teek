<script setup lang="ts" name="LayoutPageWidthSlide">
import { inject, ref, computed, watch } from "vue";
import { useDebounce, useNamespace, useStorage } from "../../../hooks";
import { autoWidthIcon, scaleIcon } from "../../../assets/icons";
import { LayoutMode, layoutModeStorageKey, pageWidthSlideStorageKey, readingEnhanceNsSymbol } from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import InputSlide from "./components/InputSlide.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const disabled = ref(false);

const pageMaxWidth = useStorage(pageWidthSlideStorageKey, 80 * 100);

const layoutMode = useStorage<LayoutMode>(layoutModeStorageKey, LayoutMode.Original);

const updatePageMaxWidth = useDebounce(
  (val: number) => {
    document.body.style.setProperty(ns.cssVarName("page-max-width"), `${Math.ceil(val / 100)}%`);
  },
  1000,
  false
);

watch(pageMaxWidth, val => {
  updatePageMaxWidth(val);
});

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const messageList = [
  {
    title: "调整页面最大宽度",
    icon: scaleIcon,
    content: "一个可调整的滑块，用于选择和自定义页面最大宽度。",
  },
];
</script>

<template>
  <Transition :name="ns.joinNamespace('reading-enhance-slide')">
    <BaseTemplate
      :class="ns.e('page-width-slide')"
      v-show="layoutMode === LayoutMode.SidebarWidthAdjustableOnly || layoutMode === LayoutMode.BothWidthAdjustable"
      title="页面最大宽度"
      :icon="autoWidthIcon"
      desc="调整 VitePress 布局中页面的宽度，以适配不同的阅读习惯和屏幕环境。"
      :message-list
      :disabled
    >
      <InputSlide v-model="pageMaxWidth" :disabled :min :max :format :class="ns.e('slide')" />
    </BaseTemplate>
  </Transition>
</template>
