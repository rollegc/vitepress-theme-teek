<script setup lang="ts" name="DocAnalysisCard">
import { useUnrefData } from "../configProvider";
import { useDesign, useBuSunZi } from "../hooks";
import { dayDiff, getNowDate, isFunction, timeDiff } from "../helper";
import HomeCard from "./HomeCard.vue";
import docAnalysisSvg from "../assets/svg/docAnalysis";
import { computed, reactive, Ref, unref } from "vue";
import { useData } from "vitepress";
import { DocAnalysis, DocAnalysisInfo } from "../config/types";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("docAnalysis");

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

const docAnalysisList: (DocAnalysisInfo & { originValue?: string | number | Ref<string> })[] = reactive([
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
    value: `${unref(docAnalysisInfo).totalFileWords} 字`,
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
    originValue: computed(() => unref(sitePv)),
    value: computed(() => (isGet ? `${unref(sitePv)} 次` : "Get...")),
    show: siteView,
  },
  {
    key: "visitCount",
    label: "本站曾来访过",
    originValue: computed(() => unref(siteUv)),
    value: computed(() => (isGet ? `${unref(siteUv)} 人` : "Get...")),
    show: siteView,
  },
  ...appendInfo,
]);

if (overrideInfo.length) {
  docAnalysisList.forEach(item => {
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
  <HomeCard :title="finalTitle" :class="`${prefixClass} card`">
    <template v-for="item in docAnalysisList" :key="item.key">
      <div v-if="item.show !== false" :class="`${prefixClass}-item`">
        <span v-html="item.label" />
        <span v-html="item.value" />
      </div>
    </template>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/docAnalysisCard.scss";
</style>
