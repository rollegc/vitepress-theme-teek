<script setup lang="ts" name="LayoutDocWidthSlide">
import { inject, ref, computed, watch } from "vue";
import { useDebounce, useNamespace, useStorage } from "../../../hooks";
import { autoWidthIcon, scaleIcon } from "../../../assets/icons";
import {
  LayoutMode,
  layoutModeStorageKey,
  contentWidthSlideStorageKey,
  readingEnhanceNsSymbol,
} from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import InputSlide from "./components/InputSlide.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const disabled = ref(false);

const docMaxWidth = useStorage(contentWidthSlideStorageKey, 100 * 100);
const layoutMode = useStorage<LayoutMode>(layoutModeStorageKey, LayoutMode.Original);

const updateDocMaxWidth = useDebounce(
  (val: number) => {
    document.body.style.setProperty(ns.cssVarName("doc-max-width"), `${Math.ceil(val / 100)}%`);
  },
  1000,
  false
);

watch(docMaxWidth, val => {
  updateDocMaxWidth(val);
});

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const messageList = [
  {
    title: "调整文档内容最大宽度",
    icon: scaleIcon,
    content: "一个可调整的滑块，用于选择和自定义文档内容最大宽度。",
  },
];
</script>

<template>
  <Transition :name="ns.joinNamespace('reading-enhance-slide')">
    <BaseTemplate
      :class="ns.e('content-width-slide')"
      v-show="layoutMode === LayoutMode.BothWidthAdjustable"
      title="文档内容最大宽度"
      :icon="autoWidthIcon"
      desc="调整 VitePress 布局中文档内容区域的宽度，以适配不同的阅读习惯和屏幕环境。"
      :message-list
      :disabled
    >
      <InputSlide v-model="docMaxWidth" :disabled :min :max :format :class="ns.e('slide')" />
    </BaseTemplate>
  </Transition>
</template>
