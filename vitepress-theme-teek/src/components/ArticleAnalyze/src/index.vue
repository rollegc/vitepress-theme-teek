<script setup lang="ts" name="ArticleAnalyze">
import { computed, nextTick, onMounted, ref, unref, watch } from "vue";
import { useRoute, useData } from "vitepress";
import type { FileInfo } from "vitepress-plugin-doc-analysis";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useLocale, useBuSuanZi, type UseBuSusnZiReturn } from "../../../hooks";
import ArticleBreadcrumb from "../../ArticleBreadcrumb";
import ArticleInfo from "../../ArticleInfo";
import Icon from "../../Icon";
import type { Article, DocAnalysis } from "../../../config/types";
import type { TkContentData } from "../../../post/types";
import { readingIcon, clockIcon, viewIcon } from "../../../assets/icons";

defineOptions({ name: "ArticleAnalyze" });

const ns = useNamespace("article-analyze");
const { t } = useLocale();

const { getTeekConfig, getTeekConfigRef } = useTeekConfig();
const { theme, frontmatter } = useData();

// 文章基本信息
const post = computed<TkContentData>(() => ({
  author: getTeekConfig("author", {}),
  date: unref(frontmatter).date,
  frontmatter: unref(frontmatter),
  url: "",
}));

// 站点信息数据
const docAnalysisInfo = computed(() => unref(theme).docAnalysisInfo || {});

// 文章阅读量、阅读时长、字数
const pageViewInfo = computed(() => {
  let pageViewInfo: Partial<FileInfo> = {};
  unref(docAnalysisInfo).eachFileWords?.forEach((item: FileInfo) => {
    if (item.fileInfo.relativePath === route.data.relativePath) return (pageViewInfo = item);
  });

  return pageViewInfo;
});

// 文章信息配置项
const articleConfig = getTeekConfigRef<Article>("article", {
  showInfo: true,
  showIcon: true,
  teleport: {},
  titleTip: {},
});

// 是否展示作者、日期、分类、标签等信息
const isShowInfo = computed(() => {
  const arr = [unref(articleConfig).showInfo].flat();
  if (arr.includes(true) || arr.includes("article")) return true;
  return false;
});

const baseInfoRef = ref<HTMLDivElement>();

const teleportInfo = () => {
  const { selector, position = "after", className = "teleport" } = unref(articleConfig).teleport || {};
  const baseInfoRefConst = unref(baseInfoRef);
  // 没有指定选择器，则不进行传送
  if (!selector || !baseInfoRefConst) return;

  const docDomContainer = window.document.querySelector("#VPContent");
  const targetDom = docDomContainer?.querySelector(selector);

  // 传送前先尝试删除传送位置的自己，避免传送重新渲染
  targetDom?.parentElement?.querySelectorAll(`.${ns.e("wrapper")}`).forEach((v: Element) => v.remove());

  baseInfoRefConst.classList.add(className);
  targetDom?.[position]?.(baseInfoRefConst);
};

onMounted(() => {
  nextTick(() => teleportInfo());
});

const docAnalysisConfig = getTeekConfigRef<DocAnalysis>("docAnalysis", {
  wordCount: true,
  readingTime: true,
  statistics: {},
});

const statisticsConfig = computed<NonNullable<DocAnalysis["statistics"]>>(() => ({
  provider: "",
  pageView: true,
  iteration: false,
  pageIteration: 2000,
  ...unref(docAnalysisConfig).statistics,
}));
// 是否使用访问量功能
const usePageView = computed(() => !!unref(statisticsConfig).provider && unref(statisticsConfig).pageView);

const statisticsInfo: UseBuSuanZiReturn = { pagePv: ref(0), isGet: ref(false) };
// 通过不蒜子获取访问量
const { pagePv, isGet, request } = useBuSuanZi(
  unref(usePageView),
  unref(statisticsConfig).iteration,
  unref(statisticsConfig).pageIteration
);
statisticsInfo.pagePv = pagePv;
statisticsInfo.isGet = isGet;

const route = useRoute();
watch(route, () => {
  if (unref(usePageView)) request();
});
</script>

<template>
  <div :class="`${ns.b()} flx-justify-between`" :aria-label="t('tk.articleAnalyze.label')">
    <ArticleBreadcrumb />

    <div v-if="isShowInfo" ref="baseInfoRef" :class="`${ns.e('wrapper')} flx-align-center`">
      <ArticleInfo :post scope="article" />

      <div v-if="docAnalysisConfig.wordCount" class="flx-center">
        <Icon v-if="articleConfig.showIcon" :icon="readingIcon" aria-hidden="true" />
        <a
          :title="articleConfig.titleTip?.wordCount ?? t('tk.articleAnalyze.wordCount')"
          class="hover-color"
          :aria-label="articleConfig.titleTip?.wordCount ?? t('tk.articleAnalyze.wordCount')"
        >
          {{ pageViewInfo.wordCount }}
        </a>
      </div>

      <div v-if="docAnalysisConfig.readingTime" class="flx-center">
        <Icon v-if="articleConfig.showIcon" :icon="clockIcon" />
        <a
          :title="articleConfig.titleTip?.readingTime ?? t('tk.articleAnalyze.readingTime')"
          class="hover-color"
          :aria-label="articleConfig.titleTip?.readingTime ?? t('tk.articleAnalyze.readingTime')"
        >
          {{ pageViewInfo.readingTime }}
        </a>
      </div>

      <div v-if="usePageView" class="flx-center">
        <Icon v-if="articleConfig.showIcon" :icon="viewIcon" />
        <a
          :title="articleConfig.titleTip?.pageView ?? t('tk.articleAnalyze.pageView')"
          class="hover-color"
          :aria-label="articleConfig.titleTip?.pageView ?? t('tk.articleAnalyze.pageView')"
        >
          {{ statisticsInfo.isGet ? statisticsInfo.pagePv : "Get..." }}
        </a>
      </div>
    </div>
  </div>
</template>
