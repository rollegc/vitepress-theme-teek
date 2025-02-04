<script setup lang="ts" name="HomeInfo">
import { useDesign } from "../hooks";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";
import SiteInfoCard from "./SiteInfoCard.vue";
import { isHomePage, isCategoriesPage, isTagsPage } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("info");
</script>

<template>
  <div :class="prefixClass">
    <HomeMyCard v-if="isHomePage()" />
    <HomeCategoryCard v-if="isHomePage() || isCategoriesPage()" />
    <HomeTagCard v-if="isHomePage() || isTagsPage()" />
    <SiteInfoCard v-if="isHomePage()" />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeInfo.scss";
</style>
