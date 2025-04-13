<script setup lang="ts" name="SpotlightStyle">
import { computed, inject, ref, watch } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import { readingEnhanceNsSymbol, spotlightStyleStorageKey, SpotlightStyle } from "./readingEnhance";
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
    value: SpotlightStyle.Aside,
    title: "置于侧边",
    helpMessage: "在当前鼠标悬停的元素旁边添加一条固定的纯色线以突出显示当前鼠标悬停的位置。",
    ariaLabel: "置于侧边",
    icon: "material-symbols:fullscreen-exit-rounded",
  },
  {
    value: SpotlightStyle.Under,
    title: "置于底部",
    helpMessage: "在当前鼠标悬停的元素下方添加一个纯色背景以突出显示当前鼠标悬停的位置。",
    ariaLabel: "置于底部",
    icon: "material-symbols:fullscreen-rounded",
  },
]);

const spotlightStyle = useStorage(spotlightStyleStorageKey, SpotlightStyle.Aside);
</script>

<template>
  <div :class="ns.e('spotlight')">
    <div ref="titleElementRef" class="flx-align-center">
      <Title title="聚光灯样式" icon="ep:reading" :disabled="disabled" />

      <Helper v-model="helperVisible" :virtual-ref="titleElementRef">
        <div :class="ns.e('helper__body')">
          <h4 :class="ns.em('helper__body', 'title')">聚光灯样式</h4>
          <p :class="ns.em('helper__body', 'text')">
            <span>调整聚光灯的样式。</span>
          </p>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">置于底部</span>
            </div>
            <span>在当前鼠标悬停的元素下方添加一个纯色背景以突出显示当前鼠标悬停的位置。</span>
          </div>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">置于侧边</span>
            </div>
            <span>在当前鼠标悬停的元素旁边添加一条固定的纯色线以突出显示当前鼠标悬停的位置。</span>
          </div>
        </div>
      </Helper>
    </div>

    <HighlightBorder :active="helperVisible" style="margin-top: 8px">
      <Segmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="disabled" />
    </HighlightBorder>
  </div>
</template>
