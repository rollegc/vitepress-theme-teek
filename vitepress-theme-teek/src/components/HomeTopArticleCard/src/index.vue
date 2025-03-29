<script setup lang="ts" name="HomeTopArticleCard">
import { computed, ref, unref } from "vue";
import { withBase, useData } from "vitepress";
import { usePosts, useBgColor } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import HomeCard from "../../HomeCard";
import { topArticleIcon } from "../../../assets/icons";
import { TkContentData } from "../../../post/types";
import { isFunction } from "../../../helper";
import type { TopArticle } from "../../../config/types";

defineOptions({ name: "HomeTopArticleCard" });

const ns = useNamespace("topArticle");

const posts = usePosts();

const { theme, frontmatter, localeIndex } = useData();

// 精选文章配置项
const {
  limit = 4,
  title = `${topArticleIcon}精选文章`,
  autoPage = false,
  pageSpeed = 4000,
}: TopArticle = { ...unref(theme).topArticle, ...unref(frontmatter).tk?.topArticle };

const topArticleList = computed(() => {
  const sortPostsByDateAndSticky: TkContentData[] = unref(posts).sortPostsByDateAndSticky;
  return sortPostsByDateAndSticky.filter(p => p.frontmatter.top)?.map((p, index) => ({ ...p, num: index + 1 }));
});

const pageNum = ref(1);

// 当前页的文章列表
const currentTopArticleList = computed(() => {
  const p = unref(pageNum);
  return unref(topArticleList).slice((p - 1) * limit, p * limit);
});

const finalTitle = computed(() => {
  if (isFunction(title)) return title(unref(localeIndex), topArticleIcon);
  return title;
});

const bgColor = useBgColor();
const itemRefs = ref<HTMLLIElement[]>([]);

const getStyle = (num: number, index: number) => {
  return {
    [ns.cssVarName("num-bg-color")]: bgColor[num % bgColor.length],
    top: `calc(${index} * (calc(${ns.cssVar("home-top-article-gap")} + ${unref(itemRefs)?.[index]?.getBoundingClientRect().height || 0}px)))`,
  };
};
</script>

<template>
  <slot name="teek-home-top-article-before" />

  <HomeCard
    page
    v-model="pageNum"
    :pageSize="limit"
    :total="topArticleList.length"
    :title="finalTitle"
    :autoPage
    :pageSpeed
    :class="ns.b()"
  >
    <template #default="{ transitionName }">
      <TransitionGroup
        v-if="topArticleList.length"
        :name="transitionName"
        tag="ul"
        mode="out-in"
        :class="`${ns.e('list')} flx-column`"
      >
        <li
          ref="itemRefs"
          v-for="(item, index) in currentTopArticleList"
          :key="item.num"
          :class="ns.e('list__item')"
          :style="getStyle(item.num - 1, index)"
        >
          <span :class="['num', { sticky: item.frontmatter.sticky }]">{{ item.num }}</span>
          <div :class="ns.e('list__item__info')">
            <a :href="item.url && withBase(item.url)" class="hover-color flx-align-center">
              <span class="title sle">{{ item.title }}</span>
            </a>
            <div class="date">{{ item.date }}</div>
          </div>
        </li>
      </TransitionGroup>

      <div v-else :class="ns.m('empty')">暂无精选内容</div>
    </template>
  </HomeCard>

  <slot name="teek-home-top-article-after" />
</template>
