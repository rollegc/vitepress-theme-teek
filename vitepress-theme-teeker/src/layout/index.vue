<script setup lang="ts" name="TeekerLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, unref } from "vue";
import { useNamespace } from "../hooks";
import { usePage, useUnrefData } from "../configProvider";
import { TkThemeConfig } from "../config/types";
import {
  Home,
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
  CodeBlockToggle,
  ArticlePageStyle,
  Notice,
} from "../components";

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { isHomePage, isArchivesPage, isCataloguePage } = usePage();
const { theme } = useUnrefData();
const { frontmatter } = useData();

const { tkTheme = true, bodyBgImg = {}, notice = {} }: TkThemeConfig = theme;
// 支持 theme 或 frontmatter 配置
const themeConfig = computed(() => {
  const {
    tkHome = true,
    codeBlock = true,
    comment = {},
  } = { ...theme, ...unref(frontmatter), ...unref(frontmatter).tk };
  return { tkHome, codeBlock, comment };
});

const commentConfig = computed(() => {
  const commentOption = unref(themeConfig).comment || {};
  return {
    enabled: commentOption.comment ?? true,
    components: {
      twikoo: CommentTwikoo,
      waline: CommentWaline,
      giscus: CommentGiscus,
      artalk: CommentArtalk,
    },
    provider: commentOption.provider,
    options: commentOption.options,
  };
});
</script>

<template>
  <template v-if="tkTheme">
    <ClientOnly>
      <RightBottomButton>
        <!-- 通用插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          ``
          <slot :name="name" />
        </template>
      </RightBottomButton>

      <BodyBgImage v-if="bodyBgImg?.imgSrc" />

      <Notice v-if="notice?.enabled">
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name" />
        </template>
      </Notice>
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <slot name="teeker-home-before" />

        <ClientOnly>
          <!-- 自定义首页 -->
          <Home v-if="themeConfig.tkHome">
            <template v-for="(_, name) in $slots" :key="name" #[name]>
              <slot :name="name" />
            </template>
          </Home>
        </ClientOnly>

        <slot name="teeker-home-after" />
      </template>

      <template #layout-bottom>
        <slot name="teeker-footer-before" />

        <Footer v-if="isHomePage" />

        <slot name="teeker-footer-after" />
        <slot name="layout-bottom" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <slot name="teeker-article-analyze-before" />

        <ClientOnly>
          <ArticleAnalyze />
          <ArticleImagePreview />
          <ArticlePageStyle />
          <CodeBlockToggle v-if="themeConfig.codeBlock" />
        </ClientOnly>
        <slot name="teeker-article-analyze-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <slot name="teeker-comment-before" />

        <!-- 评论区 -->
        <template v-if="commentConfig.enabled">
          <ClientOnly>
            <slot v-if="commentConfig.provider === 'render'" name="teeker-comment" />
            <component
              v-else-if="commentConfig.provider"
              :is="commentConfig.components[commentConfig.provider]"
              :id="`${ns.namespace}-comment`"
              :class="ns.e('comment')"
            />
          </ClientOnly>
        </template>

        <slot name="teeker-comment-after" />
      </template>

      <!-- content -->
      <template #page-top>
        <slot name="page-top" />
        <slot name="teeker-page-top-before" />

        <ArchivesPage v-if="isArchivesPage">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" />
          </template>
        </ArchivesPage>
        <CataloguePage v-if="isCataloguePage">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" />
          </template>
        </CataloguePage>

        <slot name="teeker-page-top-after" />
      </template>

      <!-- 其他 VP 插槽 -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <template v-else>
    <Layout>
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>
</template>
