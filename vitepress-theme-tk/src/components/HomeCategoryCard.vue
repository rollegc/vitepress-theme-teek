<script setup lang="ts" name="HomeCategoryCard">
import { useDesign } from "../hooks";
import { postsSymbol, isCategoriesPage, useUnrefData } from "../configProvider";
import { computed, inject, unref, ref, watch } from "vue";
import { useRoute } from "vitepress";
import HomeCard from "./HomeCard.vue";
import categorySvg from "../assets/svg/category";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("category");

const { categoriesPage = false } = defineProps<{ categoriesPage?: boolean }>();

const { frontmatter, theme } = useUnrefData();
const {
  groupCards: { categories },
} = inject(postsSymbol);

const route = useRoute();

const pageNum = ref(1);
// 分类显示数量
const {
  pageTitle = `${categorySvg}全部分类`,
  homeTitle = `${categorySvg}文章分类`,
  limit = 5,
  autoPage = false,
  pageTimeOut = 4000,
} = { ...theme.category, ...frontmatter.tk?.category };

// 当前显示的分类，如果是在分类页，则显示所有分类，如果在首页，则分页显示
const currentCategories = computed(() => {
  const p = unref(pageNum);
  return categoriesPage ? categories : categories.slice((p - 1) * limit, p * limit);
});

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

const itemRefs = ref<HTMLLIElement[]>([]);
</script>

<template>
  <HomeCard
    :page="!categoriesPage"
    v-model="pageNum"
    :pageSize="limit"
    :total="categories.length"
    :title="categoriesPage ? pageTitle : homeTitle"
    title-link="/categories"
    :autoPage
    :pageTimeOut
    :class="prefixClass"
  >
    <template #default="{ transitionName }">
      <TransitionGroup
        v-if="categories.length"
        :name="transitionName"
        tag="div"
        mode="out-in"
        :class="`${prefixClass}-list flx-column`"
      >
        <a
          ref="itemRefs"
          v-for="(item, index) in currentCategories"
          :key="item.name"
          :href="`/categories?category=${encodeURIComponent(item.name)}`"
          :class="{ active: item.name === category }"
          :style="`top: ${index * itemRefs?.[index]?.getBoundingClientRect().height || 0}px`"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.length }}</span>
        </a>

        <a v-if="!categoriesPage && limit < categories.length" href="/categories">更多 ...</a>
      </TransitionGroup>

      <div v-else :class="`${prefixClass}-empty`">暂无热门文章</div>
    </template>
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
