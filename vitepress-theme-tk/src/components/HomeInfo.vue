<script setup lang="ts" name="HomeInfo">
import { useDesign } from "../hooks";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";
import FriendLinkCard from "./FriendLinkCard.vue";
import TopArticleCard from "./TopArticleCard.vue";
import SiteInfoCard from "./SiteInfoCard.vue";
import { isHomePage, isCategoriesPage, isTagsPage } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("home-info");
</script>

<template>
  <div :class="prefixClass">
    <HomeMyCard v-if="isHomePage()" />
    <TopArticleCard v-if="isHomePage()" />
    <HomeCategoryCard v-if="isHomePage() || isCategoriesPage()" />
    <HomeTagCard v-if="isHomePage() || isTagsPage()" />
    <SiteInfoCard v-if="isHomePage()" />
    <FriendLinkCard v-if="isHomePage()" />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeInfo.scss";
</style>
