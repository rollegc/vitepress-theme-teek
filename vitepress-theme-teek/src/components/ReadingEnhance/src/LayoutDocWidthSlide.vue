<script setup lang="ts" name="LayoutDocWidthSlide">
import { ref, computed, watch, onMounted } from "vue";
import { useDebounce, useStorage } from "../../../hooks";
import { autoWidthIcon, scaleIcon } from "../../../assets/icons";
import BaseTemplate from "./components/BaseTemplate.vue";
import InputSlide from "./components/InputSlide.vue";
import {
  ns,
  LayoutMode,
  layoutModeStorageKey,
  docMaxWidthSlideStorageKey,
  transitionName,
  docMaxWidthVar,
} from "./readingEnhance";

defineOptions({ name: "LayoutDocWidthSlide" });

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const disabled = ref(false);

const docMaxWidth = useStorage(docMaxWidthSlideStorageKey, 90 * 100);
const layoutMode = useStorage<LayoutMode>(layoutModeStorageKey, LayoutMode.Original);

const updateMaxWidth = (val: number) => {
  document.body.style.setProperty(docMaxWidthVar, `${Math.ceil(val / 100)}%`);
};

onMounted(() => updateMaxWidth(docMaxWidth.value));

const update = useDebounce(updateMaxWidth, 1000);

watch(docMaxWidth, val => {
  update(val);
});

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const tips = [
  { title: "调整文档内容最大宽度", icon: scaleIcon, content: "一个可调整的滑块，用于选择和自定义文档内容最大宽度。" },
];
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-show="layoutMode === LayoutMode.BothWidthAdjustable"
      :icon="autoWidthIcon"
      title="文档内容最大宽度"
      desc="调整 VitePress 布局中文档内容区域的宽度，以适配不同的阅读习惯和屏幕环境。"
      :tips
      :disabled
    >
      <InputSlide v-model="docMaxWidth" :disabled :min :max :format :class="ns.e('slide')" />
    </BaseTemplate>
  </Transition>
</template>
