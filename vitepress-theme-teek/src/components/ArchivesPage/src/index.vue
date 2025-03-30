<script setup lang="ts" name="ArchivesPage">
import { withBase, useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import { usePosts } from "../../../configProvider";
import { computed, unref } from "vue";

defineOptions({ name: "ArchivesPage" });

const ns = useNamespace("archives");

const { frontmatter } = useData();

const posts = usePosts();

const defaultLabel = computed(() => {
  return {
    title: unref(frontmatter).title ?? "归档",
    totalCount: unref(frontmatter).totalCount ?? "总共 {count} 篇文章",
    year: unref(frontmatter).year ?? "年",
    month: unref(frontmatter).month ?? "月",
    count: unref(frontmatter).count ?? "篇",
    notFound: unref(frontmatter).notFound ?? "未指定",
  };
});
</script>

<template>
  <div :class="`${ns.b()} ${ns.joinNamespace('page')}`">
    <slot name="teek-archives-top-before" />

    <div :class="`${ns.e('header')} flx-justify-between`">
      <div :class="ns.joinNamespace('page-title-h1')">{{ defaultLabel.title }}</div>
      <div class="count">
        {{ defaultLabel.totalCount.replace("{count}", posts.sortPostsByDate.length) }}
      </div>
    </div>

    <slot name="teek-archives-top-after" />

    <div :class="ns.e('timeline')">
      <template v-for="(monthPosts, year) in posts.groupPostsByYearMonth" :key="year">
        <div :class="`${ns.em('timeline', 'year')} flx-justify-between`">
          <div class="year">
            {{ String(year).trim() === "NaN" ? defaultLabel.notFound : String(year).trim() + defaultLabel.year }}
          </div>
          <div class="count">{{ posts.groupPostsByYear[year].length + defaultLabel.count }}</div>
        </div>

        <div :class="ns.e('timeline__m')">
          <template v-for="(p, month) in monthPosts" :key="month">
            <div :class="`${ns.em('timeline__m', 'month')} flx-justify-between`">
              <div class="month">
                {{ String(month) === "NaN" ? defaultLabel.notFound : month + defaultLabel.month }}
              </div>
              <div class="count">{{ p.length + defaultLabel.count }}</div>
            </div>

            <ul>
              <li v-for="item in p" :key="item.url">
                <a :href="item.url && withBase(item.url)">
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
