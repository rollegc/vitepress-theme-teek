<script setup lang="ts" name="HomePostList">
import { inject, reactive, ref, watch } from "vue";
import HomePostItem from "./HomePostItem.vue";
import { postsSymbol, useUnrefData } from "../configProvider";
import Pagination from "./Pagination.vue";
import { useRoute } from "vitepress";
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-list");

const posts = inject(postsSymbol);
const { frontmatter, theme } = useUnrefData();

// 自定义一页数量 & 分页组件的 Props
const { pageSize = 10, size = "small", ...pageProps } = { ...theme.page, ...frontmatter.tk?.page };

const { coverImgMode = "default" } = { ...theme.post, ...frontmatter.tk?.post };

// 分页信息
const pageInfo = reactive({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: pageSize,
  total: 0,
});

const route = useRoute();
const currentPosts = ref([]);

const updateData = () => {
  const { frontmatter } = route.data;

  const { pageNum, pageSize, total } = pageInfo;

  // 分页处理，如果 URL 查询参数存在 pageNum，则加载对应的 post
  const { searchParams } = new URL(window.location.href);
  const p = searchParams.get("pageNum") || 1;
  if (p !== pageNum) pageInfo.pageNum = Number(p);

  let post = posts?.sortPostsByDateAndSticky;

  // 在分类页时，如果 URL 查询参数存在 category，则加载该 category 的 post，不存在则加载所有 post
  if (frontmatter.categoriesPage) {
    const c = searchParams.get("category");
    post = c ? posts?.groupPosts.categories[c] : post;
  } else if (frontmatter.tagsPage) {
    // 在标签页时，如果 URL 查询参数存在 tag，则加载该 tag 的 post，不存在则加载所有 post
    const t = searchParams.get("tag");
    post = t ? posts?.groupPosts.tags[t] : post;
  }

  // 总数处理
  if (total !== post?.length) pageInfo.total = post?.length || 0;

  currentPosts.value = post?.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

watch(
  route,
  () => {
    updateData();
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
  // 更新数据
  updateData();
};
</script>

<template>
  <div :class="prefixClass">
    <ul>
      <li
        v-for="post in currentPosts"
        :key="post"
        :class="[`${prefixClass}-item`, { 'large-cover-wrapper': coverImgMode === 'large' }]"
      >
        <HomePostItem :post />
      </li>
    </ul>
    <ClientOnly>
      <div :class="`${prefixClass}-pagination flx-justify-center`">
        <Pagination
          v-if="posts.sortPostsByDateAndSticky?.length >= pageInfo.pageSize"
          v-model="pageInfo"
          v-bind="pageProps"
          @pagination="handlePagination"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homePostList.scss";
</style>
