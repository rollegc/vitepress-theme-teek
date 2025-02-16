<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useDesign } from "../hooks";
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

defineOptions({ name: "TkLayout" });

const { Layout } = DefaultTheme;

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout");

const { theme, frontmatter } = useUnrefData();

const useTkTheme = theme.tkTheme ?? true;

const { enabled = true } = { ...theme.banner, ...frontmatter.tk?.banner };
const { provider, render } = { ...theme.comment };

const commentComponent = {
  twikoo: CommentTwikoo,
  waline: CommentWaline,
  giscus: CommentGiscus,
  artalk: CommentArtalk,
};
</script>

<template>
  <RightBottomButton />
  <BodyBgImage v-if="theme.bodyBgImg?.imgSrc" />

  <Layout :class="prefixClass">
    <template #home-hero-before>
      <slot name="home-hero-before" />
      <!-- 自定义首页 -->
      <div v-if="useTkTheme" :class="`${prefixClass}-home`">
        <HomeBanner v-if="isHomePage() && enabled" />
        <div :class="`${prefixClass}-home-content flx-start-justify-center`">
          <div :class="`${prefixClass}-home-content__list`"><HomePostList /></div>
          <div :class="`${prefixClass}-home-content__info`"><HomeInfo /></div>
        </div>
      </div>
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
      </ClientOnly>
    </template>

    <template #doc-after>
      <slot name="doc-after" />
      <!-- 评论区 -->
      <template v-if="frontmatter.comment !== false">
        <component v-if="render" :is="render" :id="`${prefixClass}-comment`" :class="`${prefixClass}-comment`" />
        <component
          v-else-if="provider"
          :is="commentComponent[provider]"
          :id="`${prefixClass}-comment`"
          :class="`${prefixClass}-comment`"
        />
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

    <!-- navbar -->
    <template #nav-bar-title-before>
      <slot name="nav-bar-title-before" />
    </template>
    <template #nav-bar-title-after>
      <slot name="nav-bar-title-after" />
    </template>
    <template #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>
    <template #nav-bar-content-after>
      <slot name="nav-bar-content-after" />
    </template>
    <template #nav-screen-content-before>
      <slot name="nav-screen-content-before" />
    </template>
    <template #nav-screen-content-after>
      <slot name="nav-screen-content-after" />
    </template>

    <!-- sidebar -->
    <template #sidebar-nav-before>
      <slot name="sidebar-nav-before" />
    </template>
    <template #sidebar-nav-after>
      <slot name="sidebar-nav-after" />
    </template>

    <template #not-found>
      <slot name="not-found" />
    </template>
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    <template #home-hero-image>
      <slot name="home-hero-image" />
    </template>
    <template #home-hero-after>
      <slot name="home-hero-after" />
    </template>
    <template #home-features-before>
      <slot name="home-features-before" />
    </template>
    <template #home-features-after>
      <slot name="home-features-after" />
    </template>

    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #doc-top>
      <slot name="doc-top" />
    </template>
    <template #doc-bottom>
      <slot name="doc-bottom" />
    </template>

    <template #aside-top>
      <slot name="aside-top" />
    </template>
    <template #aside-bottom>
      <slot name="aside-bottom" />
    </template>
    <template #aside-outline-before>
      <slot name="aside-outline-before" />
    </template>
    <template #aside-outline-after>
      <slot name="aside-outline-after" />
    </template>
    <template #aside-ads-before>
      <slot name="aside-ads-before" />
    </template>
    <template #aside-ads-after>
      <slot name="aside-ads-after" />
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@use "../styles/namespace.scss" as *;
$prefix-class: #{$theme-namespace}-layout;

.#{$prefix-class} {
  &-home {
    &-content {
      margin: 3rem auto 0;
      max-width: var(--tk-home-max-width);
      gap: var(--tk-home-gap);

      &__list {
        flex: 1;
      }

      &__info {
        position: sticky;
        top: calc(var(--vp-nav-height) + 10px);
      }
    }
  }

  &-comment {
    margin-top: 1.25rem;
  }
}
</style>
