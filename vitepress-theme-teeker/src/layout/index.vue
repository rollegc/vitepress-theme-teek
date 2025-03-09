<script setup lang="ts" name="tkLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, unref } from "vue";
import { useNamespace } from "../hooks";
import { isHomePage, isArchivesPage, isCataloguePage, useUnrefData } from "../configProvider";
import { Banner, CommentConfig, TkThemeConfig } from "../config/types";
import {
  HomeBanner,
  HomePostList,
  HomeInfo,
  ArchivesPage,
  CataloguePage,
  ArticleAnalyze,
  ArticleImagePreview,
  BodyBgImage,
  Footer,
  RightBottomButton,
  CommentTwikoo,
  CommentArtalk,
  CommentGiscus,
  CommentWaline,
  HomeFullscreenWallpaper,
  CodeBlockToggle,
  Notice,
} from "../components";

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { theme, frontmatter } = useUnrefData();
const { frontmatter: frontmatterRef } = useData();

const { tkTheme = true, wallpaper = {}, codeBlock = true, bodyBgImg = {}, notice = {} }: TkThemeConfig = theme;
// tkHome 支持 theme 或 index.md 的 frontmatter 配置
const tkHome = computed(() => unref(frontmatterRef).tk?.tkHome ?? theme.tkHome ?? true);

const { enabled = true, bgStyle, imgSrc }: Banner = { ...theme.banner, ...frontmatter.tk?.banner };

const comment: CommentConfig = computed(() => {
  const commentOption = { ...theme.comment, ...frontmatter.tk?.comment };
  return {
    enabled: frontmatterRef.enabled || true,
    components: {
      twikoo: CommentTwikoo,
      waline: CommentWaline,
      giscus: CommentGiscus,
      artalk: CommentArtalk,
      render: commentOption.render,
    },
    provider: commentOption.provider,
    options: commentOption.options,
  };
});
</script>

<template>
  <template v-if="tkTheme">
    <ClientOnly>
      <RightBottomButton />
      <BodyBgImage v-if="bodyBgImg?.imgSrc" />
      <Notice v-if="notice?.enabled" />
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <ClientOnly>
          <!-- 自定义首页 -->
          <div v-if="tkHome">
            <HomeBanner v-if="isHomePage() && enabled" />
            <div :class="[ns.e('home-content'), ns.joinNamespace('wallpaper-outside'), 'flx-start-justify-center']">
              <div :class="ns.e('home-content__post')"><HomePostList /></div>
              <div :class="ns.e('home-home-content__info')"><HomeInfo /></div>
            </div>
            <HomeFullscreenWallpaper
              v-if="wallpaper.enabled && ((bgStyle === 'bigImg' && imgSrc) || theme.bodyBgImg?.imgSrc)"
            />
          </div>
        </ClientOnly>
      </template>

      <template #layout-top>
        <slot name="layout-top" />
      </template>
      <template #layout-bottom>
        <Footer v-if="isHomePage()" />
        <slot name="layout-bottom" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <ClientOnly>
          <ArticleAnalyze />
          <ArticleImagePreview />
          <CodeBlockToggle v-if="codeBlock" />
        </ClientOnly>
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <!-- 评论区 -->
        <template v-if="comment.enabled">
          <ClientOnly>
            <component
              v-if="comment.provider"
              :is="comment.components[comment.provider]"
              :id="`${ns.namespace}-comment`"
              :class="ns.e('comment')"
            />
          </ClientOnly>
        </template>
      </template>

      <!-- content -->
      <template #page-top>
        <slot name="page-top" />
        <ArchivesPage v-if="isArchivesPage()" />
        <CataloguePage v-if="isCataloguePage()" />
      </template>
      <template #page-bottom>
        <slot name="page-bottom" />
      </template>

      <template v-for="(_, name) in $slots" #[name]="slotData" :key="name">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <template v-else>
    <Layout>
      <template v-for="(_, name) in $slots" #[name]="slotData" :key="name">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>
</template>
