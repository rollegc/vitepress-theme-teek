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
const {
  limit = 4,
  title = `${hotArticleSvg}精选文章`,
  autoPage = false,
  pageTimeOut = 4000,
} = { ...theme.hotArticle, ...frontmatter.tk?.hotArticle };

const hotArticleList =
  posts.sortPostsByDateAndSticky?.filter(p => p.frontmatter.hot)?.map((p, index) => ({ ...p, num: index + 1 })) || [];
const pageNum = ref(1);

const currentHotArticleList = computed(() => {
  const p = unref(pageNum);
  return hotArticleList.slice((p - 1) * limit, p * limit);
});

const bgColor = getBgColor();

const itemRefs = ref<HTMLLIElement[]>([]);
</script>

<template>
  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="hotArticleList.length"
    :title
    :autoPage
    :pageTimeOut
    :class="prefixClass"
  >
    <template #default="{ transitionName }">
      <TransitionGroup
        v-if="hotArticleList.length"
        :name="transitionName"
        tag="ul"
        mode="out-in"
        :class="`${prefixClass}-list flx-column`"
      >
        <li
          ref="itemRefs"
          v-for="(item, index) in currentHotArticleList"
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
