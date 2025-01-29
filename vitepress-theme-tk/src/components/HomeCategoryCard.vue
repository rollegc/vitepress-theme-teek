<script setup lang="ts" name="HomeCategoryCard">
import { useDesign } from "../hooks";
import { postsSymbol, isCategoriesPage } from "../configProvider";
import { computed, inject, unref, ref, watch } from "vue";
import RouteLink from "./RouteLink.vue";
import { useRoute, useData } from "vitepress";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("category");

const { frontmatter } = useData();
const {
  groupCards: { categories },
} = inject(postsSymbol);

// 分类显示数量
const categorySize = unref(frontmatter).tk?.categorySize || 5;
// 当前显示的分类，如果是在分类页，则显示所有分类，如果在首页，则显示前 categorySize 个分类
const currentCategories = computed(() => (isCategoriesPage() ? categories : categories.slice(0, categorySize)));

const route = useRoute();
// 当前选中的分类，从 URL 查询参数中获取
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
    <RouteLink to="/categories" :title="isCategoriesPage() ? '全部分类' : '文章分类'" class="title">
      {{ isCategoriesPage() ? "全部分类" : "文章分类" }}
    </RouteLink>

    <div :class="`${prefixClass}-list`">
      <RouteLink
        v-for="item in currentCategories"
        :key="item.name"
        :to="`/categories?category=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === category }"
      >
        <span>{{ item.name }}</span>
        <span>{{ item.length }}</span>
      </RouteLink>

      <RouteLink v-if="!isCategoriesPage() && categorySize < categories.length" to="/categories">更多 ...</RouteLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeCategoryCard.scss";
</style>
