<script setup lang="ts" name="HomeInfo">
import { useDesign } from "../hooks";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";
import FriendLinkCard from "./FriendLinkCard.vue";
import TopArticleCard from "./TopArticleCard.vue";
import DocAnalysisCard from "./DocAnalysisCard.vue";
import { isHomePage, isCategoriesPage, isTagsPage, useUnrefData } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("home-info");

const { theme } = useUnrefData();

const enabledTopArticleCard = theme?.topArticle?.enabled || true;
const enabledCategoryCard = theme?.category?.enabled || true;
const enabledTagCard = theme?.tag?.enabled || true;
const enabledDocAnalysisCard = theme?.docAnalysis?.enabled || true;
const enabledFriendLinkCard = theme?.friendLink?.enabled || true;
</script>

<template>
  <div :class="prefixClass">
    <HomeMyCard v-if="isHomePage()" />
    <TopArticleCard v-if="isHomePage() && enabledTopArticleCard" />
    <HomeCategoryCard
      v-if="(isHomePage() || isCategoriesPage()) && enabledCategoryCard"
      :categoriesPage="isCategoriesPage()"
    />
    <HomeTagCard v-if="(isHomePage() || isTagsPage()) && enabledTagCard" :tagsPage="isTagsPage()" />
    <DocAnalysisCard v-if="isHomePage() && enabledDocAnalysisCard" />
    <FriendLinkCard v-if="isHomePage() && enabledFriendLinkCard" />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeInfo.scss";
</style>
