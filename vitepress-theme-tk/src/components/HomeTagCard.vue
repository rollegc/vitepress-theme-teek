<script setup lang="ts" name="HomeTagCard">
import { useDesign } from "../hooks";
import { usePosts, useUnrefData, getBgColor } from "../configProvider";
import { unref, watch, computed, ref } from "vue";
import { useData, useRoute } from "vitepress";
import HomeCard from "./HomeCard.vue";
import tagSvg from "../assets/svg/tag";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tag");

const { tagsPage = false } = defineProps<{ tagsPage?: boolean }>();

const { frontmatter, theme, site } = useUnrefData();
const route = useRoute();
const pageNum = ref(1);
// 标签配置项
const {
  pageTitle = `${tagSvg}全部标签`,
  homeTitle = `${tagSvg}热门标签`,
  limit = 21,
  autoPage = false,
  pageSpeed = 4000,
  bgColor,
} = { ...theme.tag, ...frontmatter.tk?.tag };

const posts = usePosts();
const { localeIndex } = useData();
const tags = computed(() => posts.locales?.[unref(localeIndex)]?.groupCards.tags || posts.groupCards.tags);

// 当前显示的标签，如果是在标签页，则显示所有标签，如果在首页，则显示前 limit 个标签
const currentTags = computed(() => {
  const t = unref(tags);
  const p = unref(pageNum);
  return tagsPage ? t : t.slice((p - 1) * limit, p * limit);
});

// 当前选中的标签，从 URL 查询参数中获取
const tag = ref("");
watch(
  route,
  () => {
    const t = new URL(window.location.href).searchParams.get("tag");
    if (t != unref(tag)) tag.value = t;
  },
  { immediate: true }
);

const tagBgColor = bgColor || getBgColor();

const getTagStyle = (index: number) => {
  // 标签背景色
  const color = tagBgColor[index % tagBgColor.length];
  return { backgroundColor: color, "--home-tag-color": color };
};

const itemRefs = ref<HTMLLIElement[]>([]);

const tagsPageLink = computed(() => {
  // 兼容多语言功能，如果没有使用多语言，则返回 '/tags'
  const localeIndexConst = unref(localeIndex);
  return `${localeIndexConst !== "root" ? `/${localeIndexConst}` : ""}/tags${site.cleanUrls ? "" : ".html"}`;
});
</script>

<template>
  <HomeCard
    :page="!tagsPage"
    v-model="pageNum"
    :pageSize="limit"
    :total="tags.length"
    :title="tagsPage ? pageTitle : homeTitle"
    :title-link="tagsPageLink"
    :autoPage
    :pageSpeed
    :class="prefixClass"
  >
    <template #default="{ transitionName }">
      <TransitionGroup v-if="tags.length" :name="transitionName" tag="div" mode="out-in" :class="`${prefixClass}-list`">
        <a
          ref="itemRefs"
          v-for="(item, index) in currentTags"
          :key="item.name"
          :style="getTagStyle(index)"
          :href="`${tagsPageLink}?tag=${encodeURIComponent(item.name)}`"
          :class="{ active: item.name === tag }"
        >
          {{ item.name }}
        </a>

        <a v-if="!tagsPage && limit < tags.length" :href="tagsPageLink" class="more">更多 ...</a>
      </TransitionGroup>

      <div v-else :class="`${prefixClass}-empty`">暂无热门标签</div>
    </template>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeTagCard.scss";
</style>

<style lang="scss">
.VPNavBar.home.top {
  background-color: var(--tk-bg-color1);
}
</style>
