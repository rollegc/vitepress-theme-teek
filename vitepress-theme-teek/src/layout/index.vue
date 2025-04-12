<script setup lang="ts" name="TeekLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, unref, provide } from "vue";
import { useNamespace, localeContextKey } from "../hooks";
import { useTeekConfig, usePage } from "../configProvider";
import type { TeekConfig } from "../config/types";
import {
  TkHome,
  TkArchivesPage,
  TkAsideBottomAppreciation,
  TkDocAfterAppreciation,
  TkCataloguePage,
  TkArticleAnalyze,
  TkArticleImagePreview,
  TkArticleShare,
  TkBodyBgImage,
  TkFooterGroup,
  TkFooterInfo,
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
import type { Language } from "../locale";

defineOptions({ name: "TeekLayout" });

const props = defineProps<{ locale?: Language }>();

provide(
  localeContextKey,
  computed(() => props.locale)
);

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");
const { getTeekConfigRef } = useTeekConfig();
const { isHomePage, isArchivesPage, isCataloguePage } = usePage();
const { frontmatter, localeIndex, page } = useData();

// 支持 theme 或 frontmatter 配置
const teekConfig = getTeekConfigRef<Required<TeekConfig>>(null, {
  teekTheme: true,
  teekHome: true,
  vpHome: true,
  codeBlock: true,
  bodyBgImg: {},
  notice: {},
  comment: { provider: "" },
  article: {},
  articleShare: {},
  appreciation: {},
});

const commentConfig = computed(() => {
  const comment = unref(teekConfig).comment;
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
  return unref(teekConfig).article.topTip?.(unref(frontmatter), unref(localeIndex), unref(page));
});
</script>

<template>
  <template v-if="teekConfig.teekTheme">
    <ClientOnly>
      <TkRightBottomButton>
        <!-- 通用插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name" />
        </template>
      </TkRightBottomButton>

      <TkBodyBgImage v-if="teekConfig.bodyBgImg?.imgSrc" />

      <TkNotice v-if="teekConfig.notice?.enabled">
        <template v-for="(_, name) in $slots" :key="name" #[name]>
          <slot :name="name" />
        </template>
      </TkNotice>
    </ClientOnly>

    <Layout :class="[ns.b(), { [ns.m('hide-vp-home')]: !teekConfig.vpHome }]">
      <template #home-hero-before>
        <slot name="home-hero-before" />
        <slot name="teek-home-before" />

        <ClientOnly>
          <!-- 自定义首页 -->
          <TkHome v-if="teekConfig.teekHome">
            <template v-for="(_, name) in $slots" :key="name" #[name]>
              <slot :name="name" />
            </template>
          </TkHome>
        </ClientOnly>

        <slot name="teek-home-after" />
      </template>

      <template #layout-bottom>
        <TkFooterGroup />
        <slot name="teek-footer-info-before" />

        <TkFooterInfo v-if="isHomePage" />

        <slot name="teek-footer-info-after" />
        <slot name="layout-bottom" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <slot name="teek-article-analyze-before" />

        <ClientOnly>
          <TkArticleAnalyze />
          <TkArticleImagePreview />
          <TkArticlePageStyle />
          <TkCodeBlockToggle v-if="teekConfig.codeBlock" />
        </ClientOnly>

        <TkVpContainer v-if="topTipConfig" v-bind="topTipConfig" />

        <slot name="teek-article-analyze-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />

        <slot name="teek-doc-after-appreciation-before" />
        <TkDocAfterAppreciation v-if="teekConfig.appreciation.position === 'doc-after'" />
        <slot name="teek-doc-after-appreciation-after" />

        <slot name="teek-comment-before" />

        <!-- 评论区 -->
        <template v-if="commentConfig.enabled && commentConfig.provider">
          <ClientOnly>
            <template v-if="commentConfig.provider === 'render'"><slot name="teek-comment" /></template>
            <component
              v-else
              :is="commentConfig.components?.[commentConfig.provider]"
              :id="`${ns.namespace}-comment`"
              :class="ns.e('comment')"
            />
          </ClientOnly>
        </template>

        <slot name="teek-comment-after" />
      </template>

      <template #aside-bottom>
        <slot name="aside-bottom" />

        <slot name="teek-aside-bottom-appreciation-before" />
        <TkAsideBottomAppreciation v-if="teekConfig.appreciation.position === 'aside-bottom'" />
        <slot name="teek-aside-bottom-appreciation-after" />
      </template>

      <template #page-top>
        <slot name="page-top" />
        <slot name="teek-page-top-before" />

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

        <slot name="teek-page-top-after" />
      </template>

      <template #aside-outline-before>
        <slot name="teek-article-share-before" />
        <ClientOnly>
          <TkArticleShare v-if="teekConfig.articleShare.enabled" />
        </ClientOnly>
        <slot name="teek-article-share-after" />

        <slot name="aside-outline-before" />
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
