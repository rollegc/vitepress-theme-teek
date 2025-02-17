<script setup lang="ts" name="ArchivesPage">
import { useDesign } from "../hooks";
import { usePosts, useUnrefData } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("archives");

const { frontmatter } = useUnrefData();

const posts = usePosts();
</script>

<template>
  <div :class="`${prefixClass} tk-page`">
    <div :class="`${prefixClass}-header flx-justify-between`">
      <div class="tk-page-title-h1">{{ frontmatter.title }}</div>
      <div class="count">总共 {{ posts.sortPostsByDate.length }} 篇文章</div>
    </div>

    <div :class="`${prefixClass}-timeline`">
      <template v-for="(monthPosts, year) in posts.groupPostsByYearMonth" :key="year">
        <div :class="`${prefixClass}-timeline__year flx-justify-between`">
          <div class="year">{{ String(year).trim() === "NaN" ? "未指定" : String(year).trim() }}年</div>
          <div class="count">{{ posts.groupPostsByYear[year].length }}篇</div>
        </div>

        <div :class="`${prefixClass}-timeline-m`">
          <template v-for="(p, month) in monthPosts" :key="month">
            <div :class="`${prefixClass}-timeline-m__month flx-justify-between`">
              <div class="month">{{ String(month) === "NaN" ? "未指定" : month }}月</div>
              <div class="count">{{ p.length }}篇</div>
            </div>

            <ul>
              <li v-for="item in p" :key="item.title">
                <a :href="item.url">
                  <span class="date">{{ item.date?.slice(5, 10) }}</span>
                  <span>{{ item.title }}</span>
                </a>
              </li>
            </ul>
          </template>
        </div>
      </template>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/archivesPage.scss";
</style>
