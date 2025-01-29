<script setup lang="ts" name="HomeBanner">
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { onMounted, onUnmounted, unref } from "vue";
import { useTypes } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("banner");

const { site, frontmatter } = useData();

const title = unref(frontmatter).name || unref(site).title || "";
const descArray = [...new Set(unref(frontmatter).tk?.description?.filter((v: string) => !!v))] as string[];

const { text, shouldAnimate, startTypes, stopTypes } = useTypes(descArray, {
  typesInTime: unref(frontmatter).tk?.typesInTime,
  typesOutTime: unref(frontmatter).tk?.typesOutTime,
  typesNextTime: unref(frontmatter).tk?.typesNextTime,
});

onMounted(() => {
  startTypes();
});

onUnmounted(() => {
  stopTypes();
});
</script>

<template>
  <div :class="prefixClass">
    <h1 :class="`${prefixClass}-title`">
      {{ title }}
    </h1>
    <p v-if="descArray.length" :class="`${prefixClass}-desc`">
      <span>{{ text }}</span>
      <span :class="['typed', { 'is-animation': shouldAnimate }]">|</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeBanner.scss";
</style>
