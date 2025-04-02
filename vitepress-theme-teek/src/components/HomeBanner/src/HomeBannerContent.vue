<script setup lang="ts" name="HomeBannerContent">
import { computed, onMounted, onUnmounted, unref } from "vue";
import { useData } from "vitepress";
import { useNamespace, useTextTypes, useSwitchData } from "../../../hooks";
import type { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerContent" });

const ns = useNamespace("bannerContent");

const { site, theme, frontmatter } = useData();
const title = unref(frontmatter).tk?.name || unref(site).title || "";
// Banner 配置项
const bannerConfig = computed<Banner>(() => ({
  descStyle: "default",
  description: [],
  switchTime: 4000,
  switchShuffle: false,
  typesInTime: 200,
  typesOutTime: 100,
  typesNextTime: 800,
  typesShuffle: false,
  ...unref(theme).banner,
  ...unref(frontmatter).tk?.banner,
}));
const descArray = computed<string[]>(() => [
  ...new Set(
    [unref(frontmatter).tk?.description || unref(bannerConfig).description || []].flat()?.filter((v: string) => !!v)
  ),
]);

// 文本描述默认风格
const isDefaultDescStyle = computed(() => unref(bannerConfig).descStyle === "default");
// 文本描述打字机风格
const isTypesDescStyle = computed(() => unref(bannerConfig).descStyle === "types");
// 文本描述切换风格
const isSwitchDescStyle = computed(() => unref(bannerConfig).descStyle === "switch");

// 文字打印输入输出效果
const {
  text: typesText,
  isFinished,
  startTypes,
  stopTypes,
} = useTextTypes(descArray, {
  typesInTime: unref(bannerConfig).typesInTime,
  typesOutTime: unref(bannerConfig).typesOutTime,
  typesNextTime: unref(bannerConfig).typesNextTime,
  shuffle: unref(bannerConfig).typesShuffle,
});

// 文字淡入淡出效果
const {
  data: text,
  startAutoSwitch: switchText,
  stopAutoSwitch,
} = useSwitchData(descArray, {
  timeout: unref(bannerConfig).switchTime,
  shuffle: unref(bannerConfig).switchShuffle,
  onUpdate: (data, newValue) => {
    // 重新渲染数据，同时触发动画
    data.value = "";
    setTimeout(() => {
      data.value = newValue;
    }, 100);
  },
});

onMounted(() => {
  if (unref(isTypesDescStyle)) startTypes();
  if (unref(isSwitchDescStyle)) switchText();
});
onUnmounted(() => {
  if (unref(isTypesDescStyle)) stopTypes();
  if (unref(isSwitchDescStyle)) stopAutoSwitch();
});
</script>

<template>
  <div :class="ns.b()">
    <h1 :class="ns.e('content__title')">{{ title }}</h1>

    <p :class="ns.e('content__desc')">
      <template v-if="isDefaultDescStyle">
        <span>{{ descArray[0] }}</span>
      </template>
      <template v-else-if="isSwitchDescStyle">
        <span v-show="!!text" @click="switchText" class="switch">{{ text }}</span>
      </template>
      <template v-else-if="isTypesDescStyle && descArray.length">
        <span>{{ typesText }}</span>
        <span :class="['typed', { 'is-animation': isFinished }]">|</span>
      </template>
    </p>
  </div>
</template>
