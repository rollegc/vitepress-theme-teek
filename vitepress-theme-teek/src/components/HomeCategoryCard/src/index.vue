<script setup lang="ts" name="HomeCategoryCard">
import { computed, unref, ref, inject, onMounted, watch } from "vue";
import { useRouter, useData, withBase } from "vitepress";
import { useNamespace } from "../../../hooks";
import { usePosts } from "../../../configProvider";
import HomeCard from "../../HomeCard";
import { categoryIcon } from "../../../assets/icons";
import { isFunction } from "../../../helper";
import type { Category } from "../../../config/types";
import { postDataUpdateSymbol } from "../../Home/src/home";

defineOptions({ name: "HomeCategoryCard" });

const { categoriesPage = false } = defineProps<{ categoriesPage?: boolean }>();

const ns = useNamespace("category");
const { localeIndex, theme, site, frontmatter } = useData();

// 分类配置项
const categoryConfig = computed<Category>(() => ({
  path: "/categories",
  pageTitle: `${categoryIcon}全部分类`,
  homeTitle: `${categoryIcon}文章分类`,
  emptyLabel: "暂无文章分类",
  limit: 5,
  autoPage: false,
  pageSpeed: 4000,
  ...unref(theme).category,
  ...unref(frontmatter).tk?.category,
}));

const posts = usePosts();
const pageNum = ref(1);
const categories = computed(() => unref(posts).groupCards.categories);

// 当前显示的分类，如果是在分类页，则显示所有分类，如果在首页，则分页显示
const currentCategories = computed(() => {
  const { limit } = unref(categoryConfig);
  const c = unref(categories);
  const p = unref(pageNum);
  return categoriesPage ? c : c.slice((p - 1) * limit, p * limit);
});

// 标题
const finalTitle = computed(() => {
  const { pageTitle, homeTitle } = unref(categoryConfig);
  let pt = isFunction(pageTitle) ? pageTitle(categoryIcon) : pageTitle;
  let ht = isFunction(homeTitle) ? homeTitle(categoryIcon) : homeTitle;
  return { pt, ht };
});

// 分类页链接
const categoriesPageLink = computed(() => {
  const localeIndexConst = unref(localeIndex);
  const localeName = localeIndexConst !== "root" ? `/${localeIndexConst}` : "";
  // 兼容国际化功能，如果没有配置多语言，则返回 '/categories'
  return `${localeName}${unref(categoryConfig).path}${unref(site).cleanUrls ? "" : ".html"}`;
});

const updatePostListData = inject(postDataUpdateSymbol, () => {});
const router = useRouter();
const selectedCategory = ref("");
const categoryKey = "category";

/**
 * 点击分类，更新文章列表数据
 */
const handleSwitchCategory = (category = "") => {
  const { pathname, searchParams } = new URL(window.location.href);
  const categoriesPageLinkConst = withBase(unref(categoriesPageLink));
  const inCategoriesPage = categoriesPageLinkConst === pathname;

  // 先删除旧的参数再追加新的
  searchParams.delete(categoryKey);
  if (category) searchParams.append(categoryKey, category);

  const searchParamsStr = category ? `?${searchParams.toString()}` : "";

  // 避免重复点击
  if (inCategoriesPage && unref(selectedCategory) === category) return;
  selectedCategory.value = category;

  // 如果此时不在分类页，则跳转至分类页
  const to = router.to || router.go;
  if (!inCategoriesPage) return to(categoriesPageLinkConst + searchParamsStr);

  // 如果在分类页，则替换 URL，但不刷新
  window.history.pushState({}, "", pathname + searchParamsStr);
  // 更新文章列表数据
  updatePostListData();
};

onMounted(() => {
  const { searchParams } = new URL(window.location.href);
  const category = searchParams.get(categoryKey);
  // 更新激活的分类
  if (category) selectedCategory.value = category;
});

watch(
  () => categoriesPage,
  () => {
    // 离开分类页后，激活状态清楚
    if (!categoriesPage) selectedCategory.value = "";
  }
);

const itemRefs = ref<HTMLLIElement[]>([]);
</script>

<template>
  <slot name="teek-home-category-before" />

  <HomeCard
    :page="!categoriesPage"
    v-model="pageNum"
    :pageSize="categoryConfig.limit"
    :total="categories.length"
    :title="finalTitle[categoriesPage ? 'pt' : 'ht']"
    :titleClick="handleSwitchCategory"
    :autoPage="categoryConfig.autoPage"
    :pageSpeed="categoryConfig.pageSpeed"
    :class="ns.b()"
  >
    <template #default="{ transitionName }">
      <TransitionGroup
        v-if="categories.length"
        :name="transitionName"
        tag="div"
        mode="out-in"
        :class="`${ns.e('list')} flx-column`"
      >
        <a
          ref="itemRefs"
          v-for="(item, index) in currentCategories"
          :key="item.name"
          @click="handleSwitchCategory(item.name)"
          :class="[{ active: item.name === selectedCategory }, 'hover-color']"
          :style="`top: ${index * itemRefs?.[index]?.getBoundingClientRect().height || 0}px`"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.length }}</span>
        </a>

        <a v-if="!categoriesPage && categoryConfig.limit < categories.length" :href="withBase(categoriesPageLink)">更多 ...</a>
      </TransitionGroup>

      <div v-else :class="ns.m('empty')">{{ categoryConfig.emptyLabel }}</div>
    </template>
  </HomeCard>

  <slot name="teek-home-category-after" />
</template>
