<script setup lang="ts" name="SpotlightStyle">
import { computed } from "vue";
import { useStorage, useMediaQuery } from "../../../hooks";
import { clickIcon, alignLeftIcon, alignTextLeftIcon } from "../../../assets/icons";
import { SpotlightStyle } from "./layoutEnhance";
import { spotlightStyleStorageKey, spotlightToggleStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";
import { useTeekConfig } from "../../../configProvider";

defineOptions({ name: "SpotlightStyle" });

const { getTeekConfigRef } = useTeekConfig();
const layoutEnhanceConfig = getTeekConfigRef("layoutEnhance", {});

const spotlightStyle = useStorage(
  spotlightStyleStorageKey,
  layoutEnhanceConfig.value.spotlight?.defaultStyle || SpotlightStyle.Aside
);
const spotlightToggledOn = useStorage(
  spotlightToggleStorageKey,
  layoutEnhanceConfig.value.spotlight?.defaultToggle || false
);
const disabled = useMediaQuery("(pointer: coarse)");

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

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <BaseTemplate
    v-if="spotlightToggledOn"
    :icon="clickIcon"
    title="聚光灯样式"
    desc="调整聚光灯的样式。"
    :tips
    :disabled
    :helper="!layoutEnhanceConfig.spotlight?.disableHelp"
  >
    <Segmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>
</template>
