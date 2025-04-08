<script setup lang="ts" name="HomePostList">
import { computed, reactive, ref, unref, watch, nextTick } from "vue";
import { useRoute, useData } from "vitepress";
import type { PaginationProps } from "element-plus";
import { useTeekConfig, usePosts } from "../../../configProvider";
import HomePostItem from "./HomePostItem.vue";
import Pagination from "../../Pagination";
import Icon from "../../Icon";
import { useNamespace, useWindowSize } from "../../../hooks";
import type { TkContentData } from "../../../post/types";
import { emptyIcon } from "../../../assets/icons";
import type { Post } from "../../../config/types";

defineOptions({ name: "HomePostList" });

const ns = useNamespace("post-list");

const { getTeekConfigRef } = useTeekConfig();
const posts = usePosts();
const { frontmatter } = useData();

const postConfig = getTeekConfigRef<Required<Post>>("post", {
  coverImgMode: "default",
  emptyLabel: "文章列表为空",
});
// 自定义一页数量 & 分页组件的 Props
const pageConfig = getTeekConfigRef<Partial<PaginationProps>>("page", {});

const coverImgMode = ref(unref(postConfig).coverImgMode);

// 分页信息
const pageInfo = ref({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: computed(() => unref(pageConfig).pageSize || 10),
  total: 0,
});

const route = useRoute();
const currentPosts = ref<TkContentData[]>([]);
const pageNumKey = "pageNum";

const updateData = () => {
  // 分页处理，如果 URL 查询参数存在 pageNum，则加载对应的 post
  const { searchParams } = new URL(window.location.href);
  const p = Number(searchParams.get(pageNumKey)) || 1;
  if (p !== unref(pageInfo).pageNum) unref(pageInfo).pageNum = p;

  const postConst = unref(posts);
  const frontmatterConst = unref(frontmatter);

  let post = postConst.sortPostsByDateAndSticky;

  if (frontmatterConst.categoriesPage) {
    // 在分类页时，如果 URL 查询参数存在 category，则加载该 category 的 post，不存在则加载所有 post
    const c = searchParams.get("category");
    post = c ? postConst.groupPosts.categories[c] : post.filter((item: TkContentData) => item.frontmatter.categories);
  } else if (frontmatterConst.tagsPage) {
    // 在标签页时，如果 URL 查询参数存在 tag，则加载该 tag 的 post，不存在则加载所有 post
    const t = searchParams.get("tag");
    post = t ? postConst.groupPosts.tags[t] : post.filter((item: TkContentData) => item.frontmatter.tags);
  }

  const { pageNum, pageSize, total } = unref(pageInfo);
  // 总数处理
  if (total !== post?.length) unref(pageInfo).total = post?.length || 0;

  currentPosts.value = post?.slice((pageNum - 1) * unref(pageSize), pageNum * unref(pageSize));
};

watch(
  route,
  () => {
    updateData();
  },
  { immediate: true }
);

const pagePropsRef = reactive({ ...unref(pageConfig), pageSize: undefined });
const { size = "default", layout = "prev, pager, next, jumper, ->, total" } = unref(pageConfig);
const targetSize = "small";
const targetLayout = "prev, pager, next";

/**
 * 响应式监听屏幕宽度，小于指定值后分页组件尺寸改为 small，布局改为 prev, pager, next，封面模式改为 default
 */
useWindowSize(width => {
  if (width <= 768) {
    if (pagePropsRef.size !== targetSize) pagePropsRef.size = targetSize;
  } else if (pagePropsRef.size !== size) pagePropsRef.size = size;

  if (width <= 960) {
    if (pagePropsRef.layout !== targetLayout) pagePropsRef.layout = targetLayout;
  } else if (pagePropsRef.layout !== layout) pagePropsRef.layout = layout;

  if (width <= 960) {
    if (coverImgMode.value !== "default") coverImgMode.value = "default";
  } else if (coverImgMode.value !== unref(postConfig).coverImgMode) coverImgMode.value = unref(postConfig).coverImgMode;
});

/**
 * 切换分页时，记录到 URL 上
 */
const handlePagination = () => {
  const { searchParams } = new URL(window.location.href!);
  // 先删除旧的再追加新的
  searchParams.delete(pageNumKey);
  searchParams.append(pageNumKey, String(unref(pageInfo).pageNum));
  // 替换 URL，但不刷新
  window.history.pushState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
  // 更新数据
  updateData();

  // 滚动
  nextTick(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const navHeight = rootStyles.getPropertyValue("--vp-nav-height").trim().replace("px", "");
    // 滚动返回时，减去导航栏的高度
    document.querySelector("html")?.scrollTo({ top: window.innerHeight - Number(navHeight), behavior: "smooth" });
  });
};

defineExpose({ updateData });
</script>

<template>
  <div :class="ns.b()">
    <template v-if="currentPosts">
      <ul>
        <li v-for="post in currentPosts" :key="post.url" :class="`${coverImgMode}-cover`">
          <HomePostItem :post :coverImgMode />
        </li>
      </ul>
      <div :class="`${ns.e('pagination')} flx-justify-center`">
        <Pagination
          v-if="posts.sortPostsByDateAndSticky.length >= pageInfo.pageSize"
          v-model:page-size="pageInfo.pageSize"
          v-model:current-page="pageInfo.pageNum"
          :total="pageInfo.total"
          background
          @current-change="handlePagination"
          v-bind="pagePropsRef"
        />
      </div>
    </template>
    <div v-else :class="[ns.e('empty'), 'flx-column-center']">
      <Icon :icon="emptyIcon" :size="160" color="var(--vp-c-text-3)" />
      <span :class="ns.e('empty__title')">{{ postConfig.emptyLabel }}</span>
    </div>
  </div>
</template>
