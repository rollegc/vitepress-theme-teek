<script setup lang="ts" name="ColorSwitch">
import { getLightColor, getDarkColor } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { ref } from "vue";

const { isDark } = useData();

const inputColor = ref("#f9a8d4");

const setStyleVar = (key: string, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

const handleColorSwitch = () => {
  // 输入主题色
  if (isDark.value) {
    inputColor.value = "#f9a8d4";
    const primary1 = inputColor.value;

    const primary2 = getDarkColor(inputColor.value, 0.1);
    const primary3 = getDarkColor(inputColor.value, 0.2);
    const primary4 = getDarkColor(inputColor.value, 0.85);

    const bg1 = getDarkColor(inputColor.value, 0.92);
    const bg2 = getDarkColor(inputColor.value, 0.94);

    const text1 = getLightColor(inputColor.value, 0.9);

    setStyleVar("--vp-c-indigo-1", primary1);
    setStyleVar("--vp-c-indigo-2", primary2);
    setStyleVar("--vp-c-indigo-3", primary3);
    setStyleVar("--vp-c-indigo-soft", primary4);

    setStyleVar("--vp-c-bg", bg1);
    setStyleVar("--vp-c-bg-alt", bg2);
    setStyleVar("--vp-c-bg-soft", bg2);
    setStyleVar("--vp-c-bg-elv", bg1);

    setStyleVar("--vp-c-text-1", text1);
    document.documentElement.style.removeProperty("--vp-c-text-2");
    document.documentElement.style.removeProperty("--vp-c-text-3");
  } else {
    const primary1 = inputColor.value;

    const primary2 = getLightColor(inputColor.value, 0.1);
    const primary3 = getLightColor(inputColor.value, 0.2);
    const primary4 = getLightColor(inputColor.value, 0.85);

    const bg1 = getLightColor(inputColor.value, 0.97);
    const bg2 = getLightColor(inputColor.value, 0.93);

    const text1 = getDarkColor(inputColor.value, 0.6);
    const text2 = getDarkColor(inputColor.value, 0.7);
    const text3 = getLightColor(inputColor.value, 0.6);

    setStyleVar("--vp-c-indigo-1", primary1);
    setStyleVar("--vp-c-indigo-2", primary2);
    setStyleVar("--vp-c-indigo-3", primary3);
    setStyleVar("--vp-c-indigo-soft", primary4);

    setStyleVar("--vp-c-bg", bg1);
    setStyleVar("--vp-c-bg-alt", bg2);
    setStyleVar("--vp-c-bg-elv", "#ffffff");
    setStyleVar("--vp-c-bg-soft", bg2);

    setStyleVar("--vp-c-text-1", text1);
    setStyleVar("--vp-c-text-2", text2);
    setStyleVar("--vp-c-text-3", text3);
  }
};
</script>

<template>
  <input v-model="inputColor" />
  <button @click="handleColorSwitch">切换</button>
</template>
