<script setup lang="ts" name="HomeTagCard">
import { useDesign } from "../hooks";
import { postsSymbol } from "../configProvider";
import { inject } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tag");

const posts = inject(postsSymbol);

const tagBgColor = ["#11a8cd", "#F8B26A", "#67CC86", "#E15B64", "#F47E60", "#849B87"];
</script>

<template>
  <div :class="`${prefixClass} card`">
    <a title="全部标签" class="title">热门标签</a>

    <div :class="`${prefixClass}-list`">
      <a
        v-for="(item, index) in posts.groupCards.tags"
        :key="index"
        :style="{ backgroundColor: tagBgColor[index % tagBgColor.length] }"
        :class="{ active: item.key === category }"
      >
        {{ item.name }}
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeTagCard.scss";
</style>
