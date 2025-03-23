<script setup lang="ts" name="TeekerLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, unref } from "vue";
import { useNamespace } from "../hooks";
import { usePage, useUnrefData } from "../configProvider";
import { TkThemeConfig } from "../config/types";
import {
  TkHome,
  TkArchivesPage,
  TkCataloguePage,
  TkArticleAnalyze,
  TkArticleImagePreview,
  TkBodyBgImage,
  TkFooter,
  TkRightBottomButton,
  TkCommentTwikoo,
  TkCommentArtalk,
  TkCommentGiscus,
  TkCommentWaline,
  TkCodeBlockToggle,
  TkArticlePageStyle,
  TkNotice,
  TkVpContainer,
} from "../components";
import { isBoolean } from "../helper";

defineOptions({ name: "TeekerLayout" });

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { isHomePage, isArchivesPage, isCataloguePage } = usePage();
const { theme } = useUnrefData();
const { frontmatter, localeIndex, page } = useData();

const { tkTheme = true, bodyBgImg = {}, notice = {} }: TkThemeConfig = theme;
// 支持 theme 或 frontmatter 配置
const themeConfig = computed(() => {
  const {
    tkHome = true,
    codeBlock = true,
    comment = { provider: "" },
    article = {},
  }: TkThemeConfig = { ...theme, ...unref(frontmatter), ...unref(frontmatter).tk };

  return { tkHome, codeBlock, comment, topTip: article.topTip };
});

const commentConfig = computed(() => {
  const comment = unref(themeConfig).comment;
  if (isBoolean(comment)) return { enabled: comment };

  return {
    enabled: true,
    components: {
      twikoo: TkCommentTwikoo,
      waline: TkCommentWaline,
      giscus: TkCommentGiscus,
      artalk: TkCommentArtalk,
    },
    provider: comment.provider,
    options: comment.options,
  };
});

const topTipConfig = computed(() => {
  return unref(themeConfig).topTip?.(unref(frontmatter), unref(localeIndex), unref(page));
});
</script>

<template>
  <template v-if="tkTheme">
    <ClientOnly>
      <TkRightBottomButton>
        <!-- 通用插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name" />
        </template>
      </TkRightBottomButton>

      <TkBodyBgImage v-if="bodyBgImg?.imgSrc" />

      <tkNotice v-if="notice?.enabled">
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name" />
        </template>
      </tkNotice>
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <slot name="teeker-home-before" />

        <ClientOnly>
          <!-- 自定义首页 -->
          <TkHome v-if="themeConfig.tkHome">
            <template v-for="(_, name) in $slots" :key="name" #[name]>
              <slot :name="name" />
            </template>
          </TkHome>
        </ClientOnly>

        <slot name="teeker-home-after" />
      </template>

      <template #layout-bottom>
        <slot name="teeker-footer-before" />

        <TkFooter v-if="isHomePage" />

        <slot name="teeker-footer-after" />
        <slot name="layout-bottom" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <slot name="teeker-article-analyze-before" />

        <ClientOnly>
          <TkArticleAnalyze />
          <TkArticleImagePreview />
          <TkArticlePageStyle />
          <TkCodeBlockToggle />
        </ClientOnly>

        <TkVpContainer v-if="topTipConfig" v-bind="topTipConfig" />

        <slot name="teeker-article-analyze-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <slot name="teeker-comment-before" />

        <!-- 评论区 -->
        <template v-if="commentConfig.enabled && commentConfig.provider">
          <ClientOnly>
            <slot v-if="commentConfig.provider === 'render'" name="teeker-comment" />
            <component
              v-else
              :is="commentConfig.components?.[commentConfig.provider]"
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

        <TkArchivesPage v-if="isArchivesPage">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" />
          </template>
        </TkArchivesPage>
        <TkCataloguePage v-if="isCataloguePage">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" />
          </template>
        </TkCataloguePage>

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
