<script setup lang="ts" name="Spotlight">
import { computed, inject, ref } from "vue";
import { useNamespace, useStorage } from "../../../hooks";
import { clickIcon } from "../../../assets/icons";
import { readingEnhanceNsSymbol, spotlightStorageKey } from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";
import SpotlightHover from "./components/SpotlightHover.vue";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

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

const messageList = [
  {
    title: "ON 开启",
    content: "开启聚光灯。",
  },
  {
    title: "OFF 关闭",
    content: "关闭聚光灯。",
  },
];
</script>

<template>
  <BaseTemplate
    :class="ns.e('spotlight')"
    title="聚光灯"
    :icon="clickIcon"
    desc="支持在正文中高亮当前鼠标悬停的行和元素，以优化阅读和专注困难的用户的阅读体验。"
    :message-list
    :disabled
  >
    <Segmented v-model="spotlight" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>

  <SpotlightHover v-if="spotlight && !disabled" :enabled="spotlight && !disabled" />
</template>
