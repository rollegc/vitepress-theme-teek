<script setup lang="ts" name="DocAnalysisCard">
import { useUnrefData } from "../configProvider";
import { useNamespace, useBuSunZi } from "../hooks";
import { dayDiff, getNowDate, isFunction, timeDiff } from "../helper";
import HomeCard from "./HomeCard.vue";
import docAnalysisSvg from "../assets/svg/docAnalysis";
import { computed, Ref, unref } from "vue";
import { useData } from "vitepress";
import { DocAnalysis, DocAnalysisInfo } from "../config/types";

const ns = useNamespace("docAnalysis");

const { frontmatter, theme } = useUnrefData();
// 使用 useData 的 theme 是为了监听多语言切换来动态修改站点信息的内容
const { theme: themeRef } = useData();
// 站点信息配置项
const {
  createTime,
  siteView = true,
  siteIteration,
  title = `${docAnalysisSvg}站点信息`,
  overrideInfo = [],
  appendInfo = [],
}: DocAnalysis = { ...theme.docAnalysis, ...frontmatter.tk?.docAnalysis };

const docAnalysisInfo = computed(() => unref(themeRef).docAnalysisInfo || {});

const finalTitle = computed(() => {
  if (isFunction(title)) return title(docAnalysisSvg);
  return title;
});

const createToNowDay = dayDiff(createTime || getNowDate());

// 通过不蒜子获取访问量和访客数
const { sitePv, siteUv, isGet } = useBuSunZi(siteIteration);

/**
 * 格式化字数
 */
const formatWordCount = (wordCount: number) => {
  if (wordCount < 1000) return wordCount + "";
  if (wordCount < 1000000) return Math.round(wordCount / 100) / 10 + "k";
  return Math.round(wordCount / 10000) / 10 + "w";
};

type DocAnalysisResolve = DocAnalysisInfo & { originValue?: string | number | Ref<string> };

const docAnalysisList = computed<DocAnalysisResolve[]>(() => [
  {
    key: "totalPosts",
    label: "文章数目",
    originValue: unref(docAnalysisInfo).fileList.length,
    value: `${unref(docAnalysisInfo).fileList.length} 篇`,
  },
  {
    key: "runtime",
    label: "已运行时间",
    originValue: createTime,
    value: `${createToNowDay === 0 ? "不到一天" : `${createToNowDay} 天`}`,
  },
  {
    key: "totalWordCount",
    label: "本站总字数",
    originValue: unref(docAnalysisInfo).totalFileWords,
    value: `${formatWordCount(unref(docAnalysisInfo).totalFileWords)} 字`,
  },
  {
    key: "lastActiveTime",
    label: "最后活动时间",
    originValue: unref(docAnalysisInfo).lastCommitTime,
    value: timeDiff(unref(docAnalysisInfo).lastCommitTime),
  },
  {
    key: "viewCount",
    label: "本站被访问了",
    originValue: unref(sitePv),
    value: isGet ? `${unref(sitePv)} 次` : "Get...",
    show: siteView,
  },
  {
    key: "visitCount",
    label: "本站曾来访过",
    originValue: unref(siteUv),
    value: isGet ? `${unref(siteUv)} 人` : "Get...",
    show: siteView,
  },
  ...appendInfo,
]);

if (overrideInfo.length) {
  unref(docAnalysisList).forEach((item: DocAnalysisResolve) => {
    const override = overrideInfo.find(overrideItem => overrideItem.key === item.key);
    if (override) {
      item.label = override.label || item.label;
      item.value = override.value ? override.value(item.originValue || "", item.value) : item.value;
      item.show = override.show !== false;
    }
  });
}
</script>

<template>
  <HomeCard :title="finalTitle" :class="ns.b()">
    <template v-for="item in docAnalysisList" :key="item.key">
      <div v-if="item.show !== false" :class="ns.e('item')">
        <span v-html="item.label" />
        <span v-html="item.value" />
      </div>
    </template>
  </HomeCard>
</template>
