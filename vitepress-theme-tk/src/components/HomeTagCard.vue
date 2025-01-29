<script setup lang="ts" name="HomeTagCard">
import { useDesign } from "../hooks";
import { postsSymbol } from "../configProvider";
import { inject, unref, watch, computed, ref } from "vue";
import { isTagsPages } from "../configProvider.ts";
import { useRoute, useData } from "vitepress";
import RouteLink from "./RouteLink.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tag");

const {
  groupCards: { tags },
} = inject(postsSymbol);

const tagBgColor = ["#11a8cd", "#F8B26A", "#67CC86", "#E15B64", "#F47E60", "#849B87"];

const { frontmatter } = useData();

const tagSize = unref(frontmatter).tk?.tagSize || 3;
const currentTags = computed(() => (isTagsPages() ? tags : tags.slice(0, tagSize)));

const route = useRoute();
const tag = ref("");

watch(
  route,
  () => {
    const t = new URL(window.location.href).searchParams.get("tag");
    if (t != unref(tag)) tag.value = t;
  },
  { immediate: true }
);
</script>

<template>
  <div :class="`${prefixClass} card`">
    <RouteLink to="/tags" :title="isTagsPages() ? '全部标签' : '热门标签'" class="title">
      {{ isTagsPages() ? "全部标签" : "热门标签" }}
    </RouteLink>

    <div :class="`${prefixClass}-list`">
      <RouteLink
        v-for="(item, index) in currentTags"
        :key="index"
        :style="{ backgroundColor: tagBgColor[index % tagBgColor.length] }"
        :to="`/tags?tag=${encodeURIComponent(item.name)}`"
        :class="{ active: item.name === tag }"
      >
        {{ item.name }}
      </RouteLink>

      <RouteLink v-if="!isTagsPages() && tagSize < tags.length" to="/tags" class="more">
        更多 ...
      </RouteLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeTagCard.scss";
</style>
