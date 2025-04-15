<script setup lang="ts" name="Spotlight">
import { computed, ref } from "vue";
import { useStorage } from "../../../hooks";
import { clickIcon } from "../../../assets/icons";
import { spotlightStorageKey } from "./readingEnhance";
import BaseTemplate from "./components/BaseTemplate.vue";
import Segmented from "./components/Segmented.vue";
import SpotlightHover from "./components/SpotlightHover.vue";

defineOptions({ name: "Spotlight" });

const disabled = ref(false);
const spotlight = useStorage(spotlightStorageKey, true);

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
  >
    <Segmented v-model="spotlight" :options="segmentedOptions" :disabled="disabled" />
  </BaseTemplate>

  <SpotlightHover v-if="spotlight && !disabled" :enabled="spotlight && !disabled" />
</template>
