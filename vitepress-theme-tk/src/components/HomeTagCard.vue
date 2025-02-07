<script setup lang="ts" name="HomeTagCard">
import { useDesign } from "../hooks";
import { postsSymbol, isTagsPage, useUnrefData, getBgColor } from "../configProvider";
import { inject, unref, watch, computed, ref } from "vue";
import { useRoute } from "vitepress";
import HomeCard from "./HomeCard.vue";
import tagSvg from "../assets/svg/tag";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tag");

const {
  groupCards: { tags },
} = inject(postsSymbol);

const { frontmatter, theme } = useUnrefData();

const route = useRoute();
// 当前选中的标签，从 URL 查询参数中获取
const tag = ref("");

const pageNum = ref(1);
const { pageTitle = `${tagSvg}全部标签`, homeTitle = `${tagSvg}热门标签` } = { ...theme.tag, ...frontmatter.tk };
// 标签数量
const limit = theme.tag?.limit || frontmatter.tk?.tagLimit || 21;

const tagsPage = isTagsPage();
// 当前显示的标签，如果是在标签页，则显示所有标签，如果在首页，则显示前 limit 个标签
const currentTags = computed(() => {
  const p = unref(pageNum);
  return tagsPage ? tags : tags.slice((p - 1) * limit, p * limit);
});

watch(
  route,
  () => {
    const t = new URL(window.location.href).searchParams.get("tag");
    if (t != unref(tag)) tag.value = t;
  },
  { immediate: true }
);

const tagBgColor = frontmatter.tk?.tagBgColor || getBgColor();

const getTagStyle = (index: number) => {
  const color = tagBgColor[index % tagBgColor.length];
  return { backgroundColor: color, "--home-tag-color": color };
};

const transitionName = ref("");

const pagination = (_: number, type: "prev" | "next") => {
  transitionName.value = `slide-${type}`;
};
</script>

<template>
  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="tags.length"
    :title="tagsPage ? pageTitle : homeTitle"
    title-link="/tags"
    :class="prefixClass"
    @pagination="pagination"
  >
    <TransitionGroup :name="transitionName" tag="div" mode="out-in" :class="`${prefixClass}-list`">
      <a
        v-for="(item, index) in currentTags"
        :key="item.name"
        :style="getTagStyle(index)"
        :href="`/tags?tag=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === tag }"
      >
        {{ item.name }}
      </a>

      <a v-if="!tagsPage && limit < tags.length" href="/tags" class="more">更多 ...</a>
    </TransitionGroup>
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
