<script setup lang="ts" name="HomeCategoryCard">
import { useDesign } from "../hooks";
import { postsSymbol } from "../configProvider";
import { computed, inject, unref, ref, onMounted, watch } from "vue";
import { isCategoriesPages } from "../configProvider.ts";
import RouteLink from "./RouteLink.vue";
import { useRoute, useData } from "vitepress";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("category");

const { frontmatter } = useData();
const {
  groupCards: { categories },
} = inject(postsSymbol);

const categorySize = unref(frontmatter).tk?.categorySize || 5;
const currentCategories = computed(() => (isCategoriesPages() ? categories : categories.slice(0, categorySize)));

const route = useRoute();
const category = ref("");

watch(
  route,
  () => {
    const c = new URL(window.location.href).searchParams.get("category");
    if (c != unref(category)) category.value = c;
  },
  { immediate: true }
);
</script>

<template>
  <div :class="`${prefixClass} card`">
    <RouteLink to="/categories" :title="isCategoriesPages() ? '全部分类' : '文章分类'" class="title">
      {{ isCategoriesPages() ? "全部分类" : "文章分类" }}
    </RouteLink>

    <div :class="`${prefixClass}-list`">
      <RouteLink
        v-for="(item, index) in currentCategories"
        :key="index"
        :to="`/categories?category=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === category }"
      >
        <span>{{ item.name }}</span>
        <span>{{ item.length }}</span>
      </RouteLink>

      <RouteLink v-if="!isCategoriesPages() && categorySize < categories.length" to="/categories">更多 ...</RouteLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeCategoryCard.scss";
</style>
