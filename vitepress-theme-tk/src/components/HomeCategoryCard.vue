<script setup lang="ts" name="HomeCategoryCard">
import { useDesign } from "../hooks";
import { postsSymbol, isCategoriesPage, useUnrefData } from "../configProvider";
import { computed, inject, unref, ref, watch } from "vue";
import { useRoute } from "vitepress";
import HomeCard from "./HomeCard.vue";
import categorySvg from "../assets/svg/category";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("category");

const { frontmatter, theme } = useUnrefData();
const {
  groupCards: { categories },
} = inject(postsSymbol);

const route = useRoute();
// 当前选中的分类，从 URL 查询参数中获取
const category = ref("");

const pageNum = ref(1);
// 分类显示数量
const { pageTitle = `${categorySvg}全部分类`, homeTitle = `${categorySvg}文章分类` } = {
  ...theme.category,
  ...frontmatter.tk,
};
const limit = theme.category?.limit || frontmatter.tk?.categoryLimit || 5;

const categoriesPage = isCategoriesPage();
// 当前显示的分类，如果是在分类页，则显示所有分类，如果在首页，则分页显示
const currentCategories = computed(() => {
  const p = unref(pageNum);
  return categoriesPage ? categories : categories.slice((p - 1) * limit, p * limit);
});

watch(
  route,
  () => {
    const c = new URL(window.location.href).searchParams.get("category");
    if (c != unref(category)) category.value = c;
  },
  { immediate: true }
);

const transitionName = ref("");

const pagination = (_: number, type: "prev" | "next") => {
  transitionName.value = `slide-${type}`;
};
</script>

<template>
  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="categories.length"
    :title="categoriesPage ? pageTitle : homeTitle"
    title-link="/categories"
    :class="prefixClass"
    @pagination="pagination"
  >
    <TransitionGroup :name="transitionName" tag="div" mode="out-in" :class="`${prefixClass}-list`">
      <a
        v-for="item in currentCategories"
        :key="item.name"
        :href="`/categories?category=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === category }"
      >
        <span>{{ item.name }}</span>
        <span>{{ item.length }}</span>
      </a>

      <a v-if="!categoriesPage && limit < categories.length" href="/categories">更多 ...</a>
    </TransitionGroup>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeCategoryCard.scss";
</style>

<style lang="scss">
.VPNavBar.home.top {
  background-color: var(--tk-bg-color1);
}
</style>
