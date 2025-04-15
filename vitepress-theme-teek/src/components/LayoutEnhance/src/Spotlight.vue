<script setup lang="ts" name="Spotlight">
import { computed } from "vue";
import { useStorage, useMediaQuery } from "../../../hooks";
import { clickIcon } from "../../../assets/icons";
import { spotlightStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";
import SpotlightHover from "./components/SpotlightHover.vue";
import { useTeekConfig } from "../../../configProvider";

defineOptions({ name: "Spotlight" });

const { getTeekConfigRef } = useTeekConfig();
const layoutEnhanceConfig = getTeekConfigRef("layoutEnhance", {});

const disabled = useMediaQuery("(pointer: coarse)");
const spotlight = useStorage(spotlightStorageKey, layoutEnhanceConfig.value.spotlight?.defaultToggle || true);

const segmentedOptions = computed(() => [
  { value: true, text: "ON", title: "开启", helpMessage: "开启聚光灯。", ariaLabel: "开启" },
  { value: false, text: "OFF", title: "关闭", helpMessage: "关闭聚光灯。", ariaLabel: "关闭" },
]);

const tips = [
  { title: "ON 开启", content: "开启聚光灯。" },
  { title: "OFF 关闭", content: "关闭聚光灯。" },
];
</script>

<template>
  <BaseTemplate
    :icon="clickIcon"
    title="聚光灯"
    desc="支持在正文中高亮当前鼠标悬停的行和元素，以优化阅读和专注困难的用户的阅读体验。"
    :tips
    :disabled
    :helper="!layoutEnhanceConfig.spotlight?.disableHelp"
  >
    <Segmented v-model="spotlight" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>

  <SpotlightHover v-if="spotlight && !disabled" :enabled="spotlight && !disabled" />
</template>
