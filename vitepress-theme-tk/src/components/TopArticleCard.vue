<script setup lang="ts" name="TopArticleCard">
import { computed, inject, ref, unref } from "vue";
import { useUnrefData, postsSymbol, getBgColor } from "../configProvider";
import { useDesign } from "../hooks";
import HomeCard from "./HomeCard.vue";
import TopArticleSvg from "../assets/svg/topArticle";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("topArticle");

const posts = inject(postsSymbol);

const { theme, frontmatter } = useUnrefData();
// 精选文章配置项
const {
  limit = 4,
  title = `${TopArticleSvg}精选文章`,
  autoPage = false,
  pageTimeOut = 4000,
} = { ...theme.topArticle, ...frontmatter.tk?.topArticle };

const TopArticleList =
  posts.sortPostsByDateAndSticky?.filter(p => p.frontmatter.hot)?.map((p, index) => ({ ...p, num: index + 1 })) || [];
const pageNum = ref(1);

// 当前页的文章列表
const currentTopArticleList = computed(() => {
  const p = unref(pageNum);
  return TopArticleList.slice((p - 1) * limit, p * limit);
});

const itemRefs = ref<HTMLLIElement[]>([]);
const bgColor = getBgColor();
</script>

<template>
  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="TopArticleList.length"
    :title
    :autoPage
    :pageTimeOut
    :class="prefixClass"
  >
    <template #default="{ transitionName }">
      <TransitionGroup
        v-if="TopArticleList.length"
        :name="transitionName"
        tag="ul"
        mode="out-in"
        :class="`${prefixClass}-list flx-column`"
      >
        <li
          ref="itemRefs"
          v-for="(item, index) in currentTopArticleList"
          :key="item.num"
          :class="`${prefixClass}-list__item`"
          :style="{
            '--tk-num-bg-color': bgColor[(item.num - 1) % bgColor.length],
            top: `calc(${index} * (calc(var(--tk-gap1) + ${itemRefs?.[index]?.getBoundingClientRect().height || 0}px)))`,
          }"
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
    </template>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/topArticleCard.scss";
</style>
