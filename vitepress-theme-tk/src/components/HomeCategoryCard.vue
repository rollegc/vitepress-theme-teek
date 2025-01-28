<script setup lang="ts" name="HomeCategoryCard">
import { useDesign } from "../hooks";
import { postsSymbol } from "../configProvider";
import { inject } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("category");

const posts = inject(postsSymbol);
</script>

<template>
  <div :class="`${prefixClass} card`">
    <a title="全部分类" class="title">文章分类</a>

    <div :class="`${prefixClass}-list`">
      <a v-for="(item, index) in posts.groupCards.categories" :key="index" :class="{ active: item.key === category }">
        {{ item.name }}
        <span>{{ item.length }}</span>
      </a>

      <!-- <a v-if="length !== 'all' && length < posts.groupCards.categories.length" class="more">更多 ...</a> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeCategoryCard.scss";
</style>
