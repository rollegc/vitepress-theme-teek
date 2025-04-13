<script setup lang="ts" name="Spotlight">
import { computed, inject, ref, watch } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import { readingEnhanceNsSymbol, spotlightStorageKey } from "./readingEnhance";
import Icon from "../../Icon";
import Title from "./components/Title.vue";
import Helper from "./components/Helper.vue";
import HighlightBorder from "./components/HighlightBorder.vue";
import Segmented from "./components/Segmented.vue";
import SpotlightHover from "./components/SpotlightHover.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const titleElementRef = ref<HTMLDivElement | null>(null);
const helperVisible = ref(false);
const disabled = ref(false);

const segmentedOptions = computed(() => [
  {
    value: true,
    title: "开启",
    helpMessage: "开启聚光灯。",
    ariaLabel: "开启",
    icon: "material-symbols:fullscreen-rounded",
  },
  {
    value: false,
    title: "关闭",
    helpMessage: "关闭聚光灯。",
    ariaLabel: "关闭",
    icon: "material-symbols:fullscreen-exit-rounded",
  },
]);

const spotlight = useStorage(spotlightStorageKey, true);
</script>

<template>
  <div :class="ns.e('spotlight')">
    <div ref="titleElementRef" class="flx-align-center">
      <Title title="聚光灯" icon="ep:reading" :disabled="disabled" />

      <Helper v-model="helperVisible" :virtual-ref="titleElementRef">
        <div :class="ns.e('helper__body')">
          <h4 :class="ns.em('helper__body', 'title')">聚光灯</h4>
          <p :class="ns.em('helper__body', 'text')">
            <span>支持在正文中高亮当前鼠标悬停的行和元素，以优化阅读和专注困难的用户的阅读体验。</span>
          </p>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">ON 开启</span>
            </div>
            <span>开启聚光灯。</span>
          </div>

          <div :class="ns.e('helper__body__content')">
            <div>
              <Icon icon="i-icon-park-outline:full-screen-one" />
              <span style="font-weight: 600">OFF 关闭</span>
            </div>
            <span>关闭聚光灯。</span>
          </div>
        </div>
      </Helper>
    </div>

    <HighlightBorder :active="helperVisible" style="margin-top: 8px">
      <Segmented v-model="spotlight" :options="segmentedOptions" :disabled="disabled" />
    </HighlightBorder>

    <SpotlightHover v-if="spotlight && !disabled" :enabled="spotlight && !disabled" />
  </div>
</template>
