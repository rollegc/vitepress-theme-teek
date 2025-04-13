<script setup lang="ts" name="LayoutSwitch">
import { computed, inject, onMounted, ref, watch } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import { readingEnhanceNsSymbol, LayoutMode, layoutModeStorageKey } from "./readingEnhance";
import Icon from "../../Icon";
import Title from "./components/Title.vue";
import Helper from "./components/Helper.vue";
import HighlightBorder from "./components/HighlightBorder.vue";
import Segmented from "./components/Segmented.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const titleElementRef = ref<HTMLDivElement | null>(null);
const helperVisible = ref(false);
const disabled = ref(false);

const segmentedOptions = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: "全部展开",
    helpMessage: "调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境。",
    ariaLabel: "全部展开",
    icon: "material-symbols:fullscreen-rounded",
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: "全部展开，但侧边栏宽度可调",
    helpMessage: "侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度。",
    ariaLabel: "全部展开，但侧边栏宽度可调",
    icon: "material-symbols:fullscreen-exit-rounded",
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: "全部展开，且侧边栏和内容区域宽度均可调",
    helpMessage: "侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度。",
    ariaLabel: "全部展开，且侧边栏和内容区域宽度均可调",
    icon: "material-symbols:fullscreen",
  },
  {
    value: LayoutMode.Original,
    title: "原始宽度",
    helpMessage: "原始的 VitePress 默认布局宽度",
    ariaLabel: "原始宽度",
    icon: "material-symbols:fullscreen-exit-rounded",
  },
]);

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
</script>

<template>
  <div :class="ns.e('layout-switch')">
    <div ref="titleElementRef" class="flx-align-center">
      <Title title="布局切换" icon="ep:reading" :disabled="disabled" />

      <Helper v-model="helperVisible" :virtual-ref="titleElementRef">
        <div :class="ns.e('helper__body')">
          <h4 :class="ns.em('helper__body', 'title')">布局切换</h4>
          <p :class="ns.em('helper__body', 'text')">
            <span>调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境。</span>
          </p>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">全部展开</span>
            </div>
            <span>使侧边栏和内容区域占据整个屏幕的全部宽度。</span>
          </div>
        </div>
      </Helper>
    </div>

    <HighlightBorder :active="helperVisible" style="margin-top: 8px">
      <Segmented v-model="layoutMode" :options="segmentedOptions" :disabled="disabled" />
    </HighlightBorder>
  </div>
</template>
