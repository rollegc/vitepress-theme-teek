<script setup lang="ts" name="SpotlightStyle">
import { computed, inject, ref } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import { clickIcon, alignLeftIcon, alignTextLeftIcon } from "../../../assets/icons";
import { readingEnhanceNsSymbol, spotlightStyleStorageKey, SpotlightStyle } from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const disabled = ref(false);

const spotlightStyle = useStorage(spotlightStyleStorageKey, SpotlightStyle.Aside);

const content = computed(() => [
  {
    value: SpotlightStyle.Aside,
    title: "置于侧边",
    helpMessage: "在当前鼠标悬停的元素旁边添加一条固定的纯色线以突出显示当前鼠标悬停的位置。",
    ariaLabel: "置于侧边",
    icon: alignTextLeftIcon,
  },
  {
    value: SpotlightStyle.Under,
    title: "置于底部",
    helpMessage: "在当前鼠标悬停的元素下方添加一个纯色背景以突出显示当前鼠标悬停的位置。",
    ariaLabel: "置于底部",
    icon: alignLeftIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.ariaLabel,
    icon: item.icon,
  }))
);

const messageList = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <BaseTemplate
    :class="ns.e('spotlight-style')"
    title="聚光灯样式"
    :icon="clickIcon"
    desc="调整聚光灯的样式。"
    :message-list
    :disabled
  >
    <Segmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>
</template>
