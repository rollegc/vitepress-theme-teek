<script setup lang="ts" name="HomeInfo">
import { useNamespace } from "../hooks";
import { computed, unref } from "vue";
import { useData } from "vitepress";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";
import FriendLinkCard from "./FriendLinkCard.vue";
import TopArticleCard from "./TopArticleCard.vue";
import DocAnalysisCard from "./DocAnalysisCard.vue";

const ns = useNamespace("homeInfo");

const { theme, frontmatter } = useData();
const { topArticle, category, tag, docAnalysis, friendLink, homeCardSort } = unref(theme);

const enabledTopArticleCard = topArticle?.enabled !== false;
const enabledCategoryCard = category?.enabled !== false;
const enabledTagCard = tag?.enabled !== false;
const enabledDocAnalysisCard = docAnalysis?.enabled !== false;
const enabledFriendLinkCard = friendLink?.enabled !== false;

// 获取用户配置 + 默认的卡片排序
const finalHomeCardSort = computed(() => {
  const configCardSort = homeCardSort || [];
  return [...new Set([...configCardSort, ...["topArticle", "category", "tag", "friendLink", "docAnalysis"]])];
});

const isCategoriesPage = computed(() => unref(frontmatter).categoriesPage);
const isTagsPage = computed(() => unref(frontmatter).tagsPage);
const isHomePage = computed(() => !unref(isCategoriesPage) && !unref(isTagsPage));

// 定义组件映射
const componentMap = computed(() => {
  const homePage = unref(isHomePage);
  const categoriesPage = unref(isCategoriesPage);
  const tagsPage = unref(isTagsPage);

  return {
    topArticle: {
      el: TopArticleCard,
      show: homePage && enabledTopArticleCard,
    },
    category: {
      el: HomeCategoryCard,
      props: { categoriesPage: categoriesPage },
      show: (homePage || categoriesPage) && enabledCategoryCard,
    },
    tag: {
      el: HomeTagCard,
      props: { tagsPage: tagsPage },
      show: (homePage || tagsPage) && enabledTagCard,
    },
    docAnalysis: {
      el: DocAnalysisCard,
      show: homePage && enabledDocAnalysisCard,
    },
    friendLink: {
      el: FriendLinkCard,
      show: homePage && enabledFriendLinkCard,
    },
  };
});
</script>

<template>
  <div :class="ns.b()">
    <HomeMyCard v-if="isHomePage" />
    <template v-for="item in finalHomeCardSort" :key="item">
      <component v-if="componentMap[item]?.show" :is="componentMap[item]?.el" v-bind="componentMap[item]?.props" />
    </template>
  </div>
</template>
