<script setup lang="ts" name="ArchivesPage">
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { postsSymbol } from "../configProvider";
import { inject } from "vue";
import RouteLink from "./RouteLink.vue";
import { KtContentData } from "../data/post";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("archives");

const { frontmatter } = useData();

const posts = inject(postsSymbol);

const getDate = (item: KtContentData) => {
  const {
    frontmatter: { date },
  } = item;

  if (date) return date.slice(5, 10);
};
</script>

<template>
  <div :class="`${prefixClass} tk-page`">
    <div :class="`${prefixClass}-header flx-justify-between`">
      <div class="title">{{ frontmatter.title }}</div>
      <div class="count">总共 {{ posts.sortPostsByDate.length }} 篇文章</div>
    </div>

    <div :class="`${prefixClass}-timeline`">
      <template v-for="(monthPosts, year) in posts.groupPostsByYearMonth" :key="year">
        <div :class="`${prefixClass}-timeline__year flx-justify-between`">
          <div class="year">{{ String(year) === "NaN" ? "未指定" : year }} 年</div>
          <div class="count">{{ posts.groupPostsByYear[year].length }}篇</div>
        </div>

        <div :class="`${prefixClass}-timeline-m`">
          <template v-for="(posts, month) in monthPosts" :key="month">
            <div :class="`${prefixClass}-timeline-m__month flx-justify-between`">
              <div class="month">{{ String(month) === "NaN" ? "未指定" : month }} 月</div>
              <div class="count">{{ posts.length }}篇</div>
            </div>

            <ul>
              <li v-for="item in posts" :key="item.title">
                <RouteLink :to="item.frontmatter.permalink || item.url">
                  <span class="date">{{ getDate(item) }}</span>
                  <span>{{ item.title }}</span>
                </RouteLink>
              </li>
            </ul>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/archivesPage.scss";
</style>
