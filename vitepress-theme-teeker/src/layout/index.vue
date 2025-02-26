<script setup lang="ts" name="tkLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { useNamespace } from "../hooks";
import { isHomePage, isArchivesPage, isCataloguePage, useUnrefData } from "../configProvider";
import HomeBanner from "../components/HomeBanner.vue";
import HomePostList from "../components/HomePostList.vue";
import HomeInfo from "../components/HomeInfo.vue";
import ArchivesPage from "../components/ArchivesPage.vue";
import CataloguePage from "../components/CataloguePage.vue";
import ArticleAnalyze from "../components/ArticleAnalyze.vue";
import ArticleImagePreview from "../components/ArticleImagePreview.vue";
import BodyBgImage from "../components/BodyBgImage.vue";
import Footer from "../components/Footer.vue";
import RightBottomButton from "../components/RightBottomButton.vue";
import CommentTwikoo from "../components/CommentTwikoo.vue";
import CommentArtalk from "../components/CommentArtalk.vue";
import CommentGiscus from "../components/CommentGiscus.vue";
import CommentWaline from "../components/CommentWaline.vue";
import HomeFullscreenWallpaper from "../components/HomeFullscreenWallpaper.vue";
import CodeBlockToggle from "../components/CodeBlockToggle.vue";
import { Banner, CommentConfig } from "../config/types";

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { theme, frontmatter } = useUnrefData();
const { frontmatter: frontmatterRef } = useData();

const { tkTheme = true, tkHome = true, wallpaper = {}, codeBlock = true } = theme;

const { enabled = true, bgStyle, imgSrc }: Banner = { ...theme.banner, ...frontmatter.tk?.banner };
const { provider, render }: CommentConfig = { ...theme.comment };

const commentComponent = {
  twikoo: CommentTwikoo,
  waline: CommentWaline,
  giscus: CommentGiscus,
  artalk: CommentArtalk,
  render,
};
</script>

<template>
  <template v-if="tkTheme">
    <ClientOnly>
      <RightBottomButton />
      <BodyBgImage v-if="theme.bodyBgImg?.imgSrc" />
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <ClientOnly>
          <!-- 自定义首页 -->
          <div v-if="tkHome">
            <HomeBanner v-if="isHomePage() && enabled" />
            <div :class="`${ns.e('home-content')} flx-start-justify-center`">
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
        <template v-if="frontmatterRef.comment !== false">
          <ClientOnly>
            <component
              v-if="provider"
              :is="commentComponent[provider]"
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
