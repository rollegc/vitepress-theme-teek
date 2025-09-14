<script setup lang="ts" name="ArticleBanner">
import type { ArticleBanner, Post } from "@teek/config";
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { useNamespace } from "@teek/composables";
import { useCommon, useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkArticleBreadcrumb } from "@teek/components/theme/ArticleBreadcrumb";
import { TkArticleAnalyze } from "@teek/components/theme/ArticleAnalyze";
import { TkHomeBannerWaves } from "@teek/components/theme/HomeBanner";

const ns = useNamespace("article-banner");
const { frontmatter } = useData();

const { isMobile, hasSidebar } = useCommon();

const { getTeekConfigRef } = useTeekConfig();

const articleBannerConfig = getTeekConfigRef<ArticleBanner>("articleBanner", {
  enabled: true,
  showCategory: true,
  showTag: true,
  defaultCoverImg: "",
  defaultCoverBgColor: "",
});

const postConfig = getTeekConfigRef<Post>("post", {
  defaultCoverImg: [],
});

const imgSrc = computed(() => {
  const imgSrcList = [
    frontmatter.value.coverImg || articleBannerConfig.value.defaultCoverImg || postConfig.value.defaultCoverImg || [],
  ].flat();

  if (!imgSrcList.length) return "";
  return imgSrcList[Math.floor(Math.random() * imgSrcList.length)];
});

const style = computed(() => {
  return {
    [ns.cssVarName("article-banner-bg-color")]:
      frontmatter.value.coverBgColor || articleBannerConfig.value.defaultCoverBgColor,
  };
});
</script>

<template>
  <div v-if="!hasSidebar && articleBannerConfig.enabled" :class="ns.b()" :style>
    <div :class="ns.e('wrapper')" class="flx-justify-center">
      <div v-if="imgSrc" :class="ns.e('cover')">
        <img :src="imgSrc" class="no-preview" alt="cover" />
      </div>

      <div :class="ns.e('info')">
        <TkArticleBreadcrumb v-if="!isMobile" />

        <div :class="ns.e('meta')" class="flx-center flx-wrap">
          <div v-if="frontmatter.categories && articleBannerConfig.showCategory" class="categories flx-center">
            <a
              v-for="category in frontmatter.categories"
              :key="category"
              :href="withBase(`/categories?category=${category}`)"
              class="meta-info category"
              :title="category"
            >
              {{ category }}
            </a>
          </div>

          <div v-if="frontmatter.tags && articleBannerConfig.showTag" class="tags flx-center">
            <a
              v-for="tag in frontmatter.tags"
              :key="tag"
              :href="withBase(`/tags?tag=${tag}`)"
              class="meta-info tag"
              :title="tag"
            >
              <span>#</span>
              <span>{{ tag }}</span>
            </a>
          </div>
        </div>

        <h1>{{ frontmatter.title }}</h1>
        <TkArticleAnalyze :breadcrumb="false" scope="article-info" />
      </div>
    </div>

    <TkHomeBannerWaves />
  </div>
</template>
