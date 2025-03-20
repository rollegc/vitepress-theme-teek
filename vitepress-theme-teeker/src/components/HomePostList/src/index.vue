<script setup lang="ts" name="HomePostList">
import { reactive, ref, unref, watch } from "vue";
import { useRoute, useData } from "vitepress";
import { PaginationProps } from "element-plus";
import HomePostItem from "./HomePostItem.vue";
import Pagination from "../../Pagination";
import Icon from "../../Icon";
import { usePosts, useUnrefData } from "../../../configProvider";
import { useNamespace, useWindowSize } from "../../../hooks";
import { TkContentData } from "../../../post/types";
import emptySvg from "../../../assets/svg/empty";

defineOptions({ name: "HomePostList" });

const ns = useNamespace("postList");

const posts = usePosts();
const { theme } = useUnrefData();
const { frontmatter } = useData();

// 自定义一页数量 & 分页组件的 Props
const { pageSize = 10, ...pageProps }: Partial<PaginationProps> = { ...theme.page, ...unref(frontmatter).tk?.page };

const { coverImgMode: coverImgModeConst = "default" } = { ...theme.post, ...unref(frontmatter).tk?.post };
const coverImgMode = ref(coverImgModeConst);

// 分页信息
const pageInfo = ref({
  pageNum: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: pageSize,
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

  currentPosts.value = post?.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

watch(
  route,
  () => {
    updateData();
  },
  { immediate: true }
);

const pagePropsRef = reactive({ ...pageProps });
const { size = "default", layout = "prev, pager, next, jumper, ->, total" } = pageProps;
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

  if (width < 960) {
    if (coverImgMode.value !== "default") coverImgMode.value = "default";
  } else if (coverImgMode.value !== coverImgModeConst) coverImgMode.value = coverImgModeConst;
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
          v-model="pageInfo"
          v-bind="pagePropsRef"
          @pagination="handlePagination"
        />
      </div>
    </template>
    <div v-else :class="[ns.e('empty'), 'flx-column-center']">
      <Icon :icon="emptySvg" :size="160" color="var(--vp-c-text-3)" />
      <span :class="ns.e('empty__title')">文章列表为空</span>
    </div>
  </div>
</template>
