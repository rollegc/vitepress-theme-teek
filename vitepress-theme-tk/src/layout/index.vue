<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { nextTick, provide } from "vue";

defineOptions({
  name: "TkLayout",
});

const { isDark } = useData();
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style lang="scss" scoped></style>
