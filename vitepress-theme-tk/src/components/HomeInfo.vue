<script setup lang="ts" name="HomeInfo">
import { useDesign } from "../hooks";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";
import { isHomePages, isCategoriesPages, isTagsPages } from "../configProvider.ts";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("info");
</script>

<template>
  <div :class="prefixClass">
    <HomeMyCard v-if="isHomePages()" />
    <HomeCategoryCard v-if="isHomePages() || isCategoriesPages()" />
    <HomeTagCard v-if="isHomePages() || isTagsPages()" />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeInfo.scss";
</style>
