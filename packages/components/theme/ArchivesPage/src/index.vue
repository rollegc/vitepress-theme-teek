<script setup lang="ts" name="ArchivesPage">
import { withBase, useData } from "vitepress";
import { computed } from "vue";
import { useNamespace, useLocale } from "@teek/hooks";
import { usePosts } from "@teek/components/theme/ConfigProvider";
import { TkTitleTag } from "@teek/components/common/TitleTag";

defineOptions({ name: "ArchivesPage" });

const ns = useNamespace("archives");
const { t } = useLocale();

const { frontmatter } = useData();

const posts = usePosts();

const defaultLabel = computed(() => {
  const frontmatterConst = frontmatter.value;
  return {
    title: frontmatterConst.title ?? t("tk.archives.title"),
    totalCount: frontmatterConst.totalCount ?? t("tk.archives.totalCount"),
    year: frontmatterConst.year ?? t("tk.archives.year"),
    month: frontmatterConst.month ?? t("tk.archives.month"),
    count: frontmatterConst.count ?? t("tk.archives.count"),
    notFound: frontmatterConst.notFound ?? t("tk.archives.notFound"),
  };
});
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('page')]" :aria-label="t('tk.archives.label')">
    <slot name="teek-archives-top-before" />

    <div :class="`${ns.e('header')} flx-justify-between`">
      <h1 :class="ns.joinNamespace('page-title-h1')">{{ defaultLabel.title }}</h1>
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
                <a :href="item.url && withBase(item.url)" :aria-label="`${item.title}`">
                  <span class="date">{{ item.date?.slice(5, 10) }}</span>
                  <span>{{ item.title }}</span>
                  <TkTitleTag :text="item.frontmatter.titleTag" position="right" size="small" />
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
