<script setup lang="ts" name="HomeTagCard">
import { unref, watch, computed, ref, inject, onMounted } from "vue";
import { useData, useRouter, withBase } from "vitepress";
import { useNamespace } from "../../../hooks";
import { usePosts, useUnrefData, useBgColor } from "../../../configProvider";
import HomeCard from "../../HomeCard";
import tagSvg from "../../../assets/svg/tag";
import { isFunction } from "../../../helper";
import { Tag } from "../../../config/types";
import { postDataUpdateSymbol } from "../../Home/src/home";

defineOptions({ name: "HomeTagCard" });

const ns = useNamespace("tag");

const { tagsPage = false } = defineProps<{ tagsPage?: boolean }>();

const { theme, site, frontmatter } = useUnrefData();
const { localeIndex } = useData();

const pageNum = ref(1);
// 标签配置项
const {
  path = "/tags",
  pageTitle = `${tagSvg}全部标签`,
  homeTitle = `${tagSvg}热门标签`,
  limit = 21,
  autoPage = false,
  pageSpeed = 4000,
  bgColor,
}: Tag = { ...theme.tag, ...frontmatter.tk?.tag };

const posts = usePosts();
const tags = computed(() => unref(posts).groupCards.tags);

// 当前显示的标签，如果是在标签页，则显示所有标签，如果在首页，则显示前 limit 个标签
const currentTags = computed(() => {
  const t = unref(tags);
  const p = unref(pageNum);
  return tagsPage ? t : t.slice((p - 1) * limit, p * limit);
});

const finalTitle = computed(() => {
  let pt = isFunction(pageTitle) ? pageTitle(unref(localeIndex), tagSvg) : pageTitle;
  let ht = isFunction(homeTitle) ? homeTitle(unref(localeIndex), tagSvg) : homeTitle;
  return { pt, ht };
});

const tagBgColor = bgColor || useBgColor();

const getTagStyle = (index: number) => {
  // 标签背景色
  const color = tagBgColor[index % tagBgColor.length];
  return { backgroundColor: color, "--home-tag-color": color };
};

const tagsPageLink = computed(() => {
  // 兼容国际化功能，如果没有配置国际化，则返回 '/tags'
  const localeIndexConst = unref(localeIndex);
  const localeName = localeIndexConst !== "root" ? `/${localeIndexConst}` : "";
  return `${localeName}${path}${site.cleanUrls ? "" : ".html"}`;
});

const updatePostListData = inject(postDataUpdateSymbol, () => {});
const router = useRouter();
const selectedTag = ref("");
const tagKey = "tag";

/**
 * 点击分类，更新文章列表数据
 */
const handleSwitchTag = (tag = "") => {
  const { pathname, searchParams } = new URL(window.location.href);
  const categoriesPageLinkConst = withBase(unref(tagsPageLink));
  const inCategoriesPage = categoriesPageLinkConst === pathname;

  // 先删除旧的参数再追加新的
  searchParams.delete(tagKey);
  if (tag) searchParams.append(tagKey, tag);

  const searchParamsStr = tag ? `?${searchParams.toString()}` : "";

  // 避免重复点击
  if (inCategoriesPage && unref(selectedTag) === tag) return;
  selectedTag.value = tag;

  // 如果此时不在分类页，则跳转至分类页
  const to = (router as any).push ? (router as any).push : router.go;
  if (!inCategoriesPage) return to(categoriesPageLinkConst + searchParamsStr);

  // 如果在分类页，则替换 URL，但不刷新
  window.history.pushState({}, "", pathname + searchParamsStr);
  // 更新文章列表数据
  updatePostListData();
};

onMounted(() => {
  const { searchParams } = new URL(window.location.href);
  const tag = searchParams.get(tagKey);
  // 更新激活的分类
  if (tag) selectedTag.value = tag;
});

watch(
  () => tagsPage,
  () => {
    // 离开分类页后，激活状态清楚
    if (!tagsPage) selectedTag.value = "";
  }
);
</script>

<template>
  <slot name="teeker-home-tag-before" />

  <HomeCard
    :page="!tagsPage"
    v-model="pageNum"
    :pageSize="limit"
    :total="tags.length"
    :title="finalTitle[tagsPage ? 'pt' : 'ht']"
    :titleClick="handleSwitchTag"
    :autoPage
    :pageSpeed
    :class="ns.b()"
  >
    <template #default="{ transitionName }">
      <TransitionGroup v-if="tags.length" :name="transitionName" tag="div" mode="out-in" :class="ns.e('list')">
        <a
          v-for="(item, index) in currentTags"
          :key="item.name"
          :style="getTagStyle(index)"
          @click="handleSwitchTag(item.name)"
          :class="[{ active: item.name === selectedTag }, 'pointer']"
        >
          {{ item.name }}
        </a>

        <a v-if="!tagsPage && limit < tags.length" :href="withBase(tagsPageLink)" class="more">更多 ...</a>
      </TransitionGroup>

      <div v-else :class="ns.m('empty')">暂无热门标签</div>
    </template>
  </HomeCard>

  <slot name="teeker-home-tag-after" />
</template>
