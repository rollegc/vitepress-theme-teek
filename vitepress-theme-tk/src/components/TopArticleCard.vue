<script setup lang="ts" name="TopArticleCard">
import { computed, inject, ref, unref } from "vue";
import { useUnrefData, postsSymbol, getBgColor } from "../configProvider";
import { useDesign } from "../hooks";
import HomeCard from "./HomeCard.vue";
import hotArticleSvg from "../assets/svg/hotArticle";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("topArticle");

const posts = inject(postsSymbol);

const { theme, frontmatter } = useUnrefData();
const { limit = 4, title = `${hotArticleSvg}精选文章` } = { ...theme.hotArticle, ...frontmatter.tk };

const hotArticleList =
  posts.sortPostsByDateAndSticky?.filter(p => p.frontmatter.hot)?.map((p, index) => ({ ...p, num: index + 1 })) || [];
const pageNum = ref(1);

const currentHotArticleList = computed(() => {
  const p = unref(pageNum);
  return hotArticleList.slice((p - 1) * limit, p * limit);
});

const bgColor = getBgColor();

const transitionName = ref("scroll");

const pagination = (_: number, type: "prev" | "next") => {
  transitionName.value = `slide-${type}`;
};
</script>

<template>
  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="hotArticleList.length"
    :title
    :class="prefixClass"
    @pagination="pagination"
  >
    <TransitionGroup
      :name="transitionName"
      tag="ul"
      mode="out-in"
      v-if="hotArticleList.length"
      :class="`${prefixClass}-list flx-column`"
    >
      <li
        v-for="item in currentHotArticleList"
        :key="item.num"
        :class="`${prefixClass}-list__item`"
        :style="{ '--tk-num-bg-color': bgColor[(item.num - 1) % bgColor.length] }"
      >
        <span :class="['num', { sticky: item.frontmatter.sticky }]">{{ item.num }}</span>
        <div :class="`${prefixClass}-list__item-info`">
          <a :href="item.url" class="flx-align-center">
            <span class="title sle">{{ item.title }}</span>
          </a>
          <div class="date">{{ item.date }}</div>
        </div>
      </li>
    </TransitionGroup>

    <div v-else :class="`${prefixClass}-empty`">暂无精选内容</div>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/topArticleCard.scss";
</style>
