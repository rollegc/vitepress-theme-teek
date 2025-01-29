<script setup lang="ts" name="HomePostList">
import { computed, inject, reactive, ref, toRaw, unref, watch } from "vue";
import HomePostItem from "./HomePostItem.vue";
import { postsSymbol } from "../configProvider";
import Pagination from "./Pagination.vue";
import { useData, useRoute } from "vitepress";
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-list");

const posts = inject(postsSymbol);
const { frontmatter } = useData();

// 分页信息
const pageInfo = reactive({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: unref(frontmatter).tk?.page?.pageSize || 10,
  total: 0,
});

// 分页组件的 Props
const pageOptions = { size: "small", ...unref(frontmatter).tk?.page };

const route = useRoute();
const currentPosts = ref([]);

watch(
  route,
  () => {
    const {
      data: { frontmatter },
    } = route;

    const { pageNum, pageSize, total } = pageInfo;

    // 分页处理，如果 URL 查询参数存在 pageNum，则加载对应的 post
    const { searchParams } = new URL(window.location.href);
    const p = searchParams.get("pageNum") || 1;
    if (p !== pageNum) pageInfo.pageNum = Number(p);

    let post = posts.sortPostsByDateAndSticky;

    // 在分类页时，如果 URL 查询参数存在 category，则加载该 category 的 post，不存在则加载所有 post
    if (frontmatter.categoriesPage) {
      const c = searchParams.get("category");
      post = c ? posts.groupPosts.categories[c] : post;
    } else if (frontmatter.tagsPage) {
      // 在标签页时，如果 URL 查询参数存在 tag，则加载该 tag 的 post，不存在则加载所有 post
      const t = searchParams.get("tag");
      post = t ? posts.groupPosts.tags[t] : post;
    }

    // 总数处理
    if (total !== post.length) pageInfo.total = post.length;

    currentPosts.value = post.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  },
  { immediate: true }
);

const pageNumKey = "pageNum";
/**
 * 切换分页时，记录到 URL 上
 */
const handlePagination = () => {
  const { searchParams } = new URL(window.location.href!);
  // 先删除旧的再追加新的
  searchParams.delete(pageNumKey);
  searchParams.append(pageNumKey, String(pageInfo.pageNum));
  // 替换 URL，但不刷新
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
