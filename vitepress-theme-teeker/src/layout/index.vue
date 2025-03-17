<script setup lang="ts" name="TeekerLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, unref } from "vue";
import { useNamespace } from "../hooks";
import { isHomePage, isArchivesPage, isCataloguePage, useUnrefData } from "../configProvider";
import { Banner, TkThemeConfig } from "../config/types";
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
  ArticlePageStyle,
  Notice,
} from "../components";

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { theme } = useUnrefData();
const { frontmatter } = useData();

const { tkTheme = true, wallpaper = {}, bodyBgImg = {}, notice = {} }: TkThemeConfig = theme;
// 支持 theme 或 frontmatter
const themeConfig = computed(() => ({ ...theme, ...unref(frontmatter), ...unref(frontmatter).tk }));

const comment = computed(() => {
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
          <slot :name="name"></slot>
        </template>
      </RightBottomButton>

      <BodyBgImage v-if="bodyBgImg?.imgSrc" />

      <Notice v-if="notice?.enabled">
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name"></slot>
        </template>
      </Notice>
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <slot name="teeker-home-before" />

        <ClientOnly>
          <!-- 自定义首页 -->
          <div v-if="themeConfig.tkHome ?? true">
            <HomeBanner v-if="isHomePage() && (themeConfig.banner?.enabled ?? true)">
              <template v-for="(_, name) in $slots" :key="name" #[name]>
                <slot :name="name"></slot>
              </template>
            </HomeBanner>

            <div :class="[ns.e('home-content'), ns.joinNamespace('wallpaper-outside'), 'flx-start-justify-center']">
              <div :class="ns.e('home-content__post')">
                <slot name="teeker-home-post-before" />
                <HomePostList />
                <slot name="teeker-home-post-after" />
              </div>

              <div :class="ns.e('home-content__info')">
                <HomeInfo>
                  <template v-for="(_, name) in $slots" :key="name" #[name]>
                    <slot :name="name"></slot>
                  </template>
                </HomeInfo>
              </div>
            </div>

            <HomeFullscreenWallpaper
              v-if="
                wallpaper.enabled &&
                ((themeConfig.banner?.bgStyle === 'bigImg' && themeConfig.banner?.imgSrc) || theme.bodyBgImg?.imgSrc)
              "
            />
          </div>
        </ClientOnly>

        <slot name="teeker-home-after" />
      </template>

      <template #layout-bottom>
        <slot name="teeker-footer-before" />

        <Footer v-if="isHomePage()" />

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
          <CodeBlockToggle v-if="themeConfig.codeBlock ?? true" />
        </ClientOnly>
        <slot name="teeker-article-analyze-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <slot name="teeker-comment-before" />

        <!-- 评论区 -->
        <template v-if="comment.enabled">
          <ClientOnly>
            <slot v-if="comment.provider === 'render'" name="teeker-comment" />
            <component
              v-else-if="comment.provider"
              :is="comment.components[comment.provider]"
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

        <ArchivesPage v-if="isArchivesPage()">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name"></slot>
          </template>
        </ArchivesPage>
        <CataloguePage v-if="isCataloguePage()">
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name"></slot>
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
