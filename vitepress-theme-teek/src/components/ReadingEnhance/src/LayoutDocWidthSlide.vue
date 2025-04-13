<script setup lang="ts" name="LayoutDocWidthSlide">
import { inject, ref, computed, watch } from "vue";
import { useDebounce, useNamespace, useStorage } from "../../../hooks";
import {
  LayoutMode,
  layoutModeStorageKey,
  contentWidthSlideStorageKey,
  readingEnhanceNsSymbol,
} from "./readingEnhance";
import Icon from "../../Icon";
import Title from "./components/Title.vue";
import Helper from "./components/Helper.vue";
import HighlightBorder from "./components/HighlightBorder.vue";
import InputSlide from "./components/InputSlide.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const min = ref(60);
const minScaled = computed(() => min.value * 100);
const max = ref(100);
const maxScaled = computed(() => max.value * 100);

const helperVisible = ref(false);
const disabled = ref(false);
const titleElementRef = ref<HTMLDivElement | null>(null);

const docMaxWidth = useStorage(contentWidthSlideStorageKey, 90);
const layoutMode = useStorage(layoutModeStorageKey, LayoutMode.Original);

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
</script>

<template>
  <div
    :class="ns.e('content-width-slide')"
    v-show="layoutMode === LayoutMode.SidebarWidthAdjustableOnly || layoutMode === LayoutMode.BothWidthAdjustable"
  >
    <div ref="titleElementRef" class="flx-align-center">
      <Title title="文档内容最大宽度" icon="ep:reading" :disabled="disabled" />

      <Helper v-model="helperVisible" :virtual-ref="titleElementRef">
        <div :class="ns.e('helper__body')">
          <h4 :class="ns.em('helper__body', 'title')">文档内容最大宽度</h4>
          <p :class="ns.em('helper__body', 'text')">
            <span>调整 VitePress 布局中文档内容区域的宽度，以适配不同的阅读习惯和屏幕环境。</span>
          </p>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">调整文档内容最大宽度</span>
            </div>
            <span>一个可调整的滑块，用于选择和自定义文档内容最大宽度。</span>
          </div>
        </div>
      </Helper>
    </div>

    <HighlightBorder :active="helperVisible" style="margin-top: 8px">
      <InputSlide
        v-model="docMaxWidth"
        :disabled="disabled"
        :min="minScaled"
        :max="maxScaled"
        :format="val => `${Math.ceil(val / 100)}%`"
        :class="ns.e('slide')"
      />
    </HighlightBorder>
  </div>
</template>
