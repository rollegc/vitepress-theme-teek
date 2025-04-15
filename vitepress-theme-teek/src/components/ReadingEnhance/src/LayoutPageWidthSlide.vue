<script setup lang="ts" name="LayoutPageWidthSlide">
import { ref, computed, watch, onMounted } from "vue";
import { useDebounce, useStorage } from "../../../hooks";
import { autoWidthIcon, scaleIcon } from "../../../assets/icons";
import BaseTemplate from "./components/BaseTemplate.vue";
import InputSlide from "./components/InputSlide.vue";
import {
  ns,
  LayoutMode,
  layoutModeStorageKey,
  pageMaxWidthSlideStorageKey,
  transitionName,
  pageMaxWidthVar,
} from "./readingEnhance";

defineOptions({ name: "LayoutPageWidthSlide" });

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const disabled = ref(false);

const pageMaxWidth = useStorage(pageMaxWidthSlideStorageKey, 90 * 100);
const layoutMode = useStorage<LayoutMode>(layoutModeStorageKey, LayoutMode.Original);

const updatePageMaxWidth = (val: number) => {
  document.body.style.setProperty(pageMaxWidthVar, `${Math.ceil(val / 100)}%`);
};

onMounted(() => updatePageMaxWidth(pageMaxWidth.value));

const update = useDebounce(updatePageMaxWidth, 1000);

watch(pageMaxWidth, val => {
  update(val);
});

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
    >
      <InputSlide v-model="pageMaxWidth" :disabled :min :max :format :class="ns.e('slide')" />
    </BaseTemplate>
  </Transition>
</template>
