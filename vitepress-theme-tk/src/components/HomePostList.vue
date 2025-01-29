<script setup lang="ts" name="HomePostList">
import { computed, inject, reactive, unref, ref, watch } from "vue";
import HomePostItem from "./HomePostItem.vue";
import { postsSymbol } from "../configProvider";
import Pagination from "./Pagination.vue";
import { useData, useRoute } from "vitepress";
import { useDesign } from "../hooks";
import { isHomePages, isCategoriesPages, isTagsPages } from "../configProvider.ts";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-list");

const posts = inject(postsSymbol);
const { frontmatter } = useData();

const pageInfo = reactive({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: unref(frontmatter).tk?.page?.pageSize || 10,
  total: 0,
});

const pageOptions = { size: "small", ...unref(frontmatter).tk?.page };

const route = useRoute();
const category = ref("");
const tag = ref("");

watch(
  route,
  () => {
    const { searchParams } = new URL(window.location.href);

    const pageNum = searchParams.get("pageNum") || 1;
    if (pageNum !== pageInfo.pageNum) pageInfo.pageNum = pageNum;

    const {
      data: { frontmatter },
    } = route;

    if (frontmatter.categoriesPage || frontmatter.layout === "home") {
      const c = searchParams.get("category") || "";
      if (c !== unref(category)) category.value = c;
    }

    if (frontmatter.tagsPages || frontmatter.layout === "home") {
      const t = searchParams.get("tag") || "";
      if (t !== unref(tag)) tag.value = t;
    }
  },
  { immediate: true }
);

const currentPosts = computed(() => {
  const { pageNum, pageSize } = pageInfo;

  let post = posts.sortPostsByDateAndSticky;
  if (unref(category)) post = posts.groupPosts.categories[unref(category)];
  else if (unref(tag)) post = posts.groupPosts.tags[unref(tag)];

  pageInfo.total = post.length;

  return post.slice((pageNum - 1) * pageSize, pageNum * pageSize);
});

const pageNumKey = "pageNum";
const handlePagination = () => {
  const { searchParams } = new URL(window.location.href!);
  searchParams.delete(pageNumKey);
  searchParams.append(pageNumKey, String(pageInfo.pageNum));

  window.history.pushState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
};
</script>

<template>
  <div :class="prefixClass">
    <ul>
      <li v-for="post in currentPosts" :key="post">
        <HomePostItem :post />
      </li>
    </ul>
    <ClientOnly>
      <div :class="`${prefixClass}-pagination`">
        <Pagination
          v-if="posts.sortPostsByDateAndSticky?.length >= pageInfo.pageSize"
          v-model="pageInfo"
          v-bind="pageOptions"
          @pagination="handlePagination"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homePostList.scss";
</style>
