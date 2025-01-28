<script setup lang="ts" name="HomePostList">
import { computed, inject, reactive, unref } from "vue";
import HomePostItem from "./HomePostItem.vue";
import { postsSymbol } from "../configProvider";
import Pagination from "./Pagination.vue";
import { useData } from "vitepress";
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-list");

const posts = inject(postsSymbol);
const { frontmatter } = useData();

const pageInfo = reactive({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: unref(frontmatter).tk?.page?.pageSize || 10,
  total: posts.sortPostsByDateAndSticky?.length || 0,
});

const pageOptions = computed(() => ({ size: "small", ...unref(frontmatter).tk?.page }));

const currentPosts = computed(() => {
  const { pageNum, pageSize } = pageInfo;
  return posts.sortPostsByDateAndSticky.slice((pageNum - 1) * pageSize, pageNum * pageSize);
});
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
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homePostList.scss";
</style>
