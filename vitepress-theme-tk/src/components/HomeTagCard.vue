<script setup lang="ts" name="HomeTagCard">
import { useDesign } from "../hooks";
import { postsSymbol, isTagsPage, useUnrefData } from "../configProvider";
import { inject, unref, watch, computed, ref } from "vue";
import { useRoute } from "vitepress";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tag");

const {
  groupCards: { tags },
} = inject(postsSymbol);

const { frontmatter } = useUnrefData();

// 标签数量
const tagSize = frontmatter.tk?.tagSize || 21;
// 当前显示的标签，如果是在标签页，则显示所有标签，如果在首页，则显示前 tagSize 个标签
const currentTags = computed(() => (isTagsPage() ? tags : tags.slice(0, tagSize)));

const route = useRoute();
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

const tagBgColor = frontmatter.tk?.tagBgColor || ["#11a8cd", "#F8B26A", "#67CC86", "#E15B64", "#F47E60", "#849B87"];

const getTagStyle = (index: number) => {
  const color = tagBgColor[index % tagBgColor.length];
  return { backgroundColor: color, "--home-tag-color": color };
};
</script>

<template>
  <div :class="`${prefixClass} card`">
    <a href="/tags" :title="isTagsPage() ? '全部标签' : '热门标签'" class="title">
      {{ isTagsPage() ? "全部标签" : "热门标签" }}
    </a>

    <div :class="`${prefixClass}-list`">
      <a
        v-for="(item, index) in currentTags"
        :key="item.name"
        :style="getTagStyle(index)"
        :href="`/tags?tag=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === tag }"
      >
        {{ item.name }}
      </a>

      <a v-if="!isTagsPage() && tagSize < tags.length" href="/tags" class="more">更多 ...</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeTagCard.scss";
</style>
