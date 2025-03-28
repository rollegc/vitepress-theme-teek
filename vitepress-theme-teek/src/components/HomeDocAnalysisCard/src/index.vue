<script setup lang="ts" name="HomeDocAnalysisCard">
import { computed, ref, unref, watch } from "vue";
import { useData, useRoute } from "vitepress";
import { usePosts } from "../../../configProvider";
import { useNamespace, useBuSunZi, type UseBuSunZi } from "../../../hooks";
import { dayDiff, getNowDate, isFunction, timeDiff } from "../../../helper";
import HomeCard from "../../HomeCard";
import docAnalysisSvg from "../../../assets/svg/docAnalysis";
import type { DocAnalysis, DocAnalysisInfo } from "../../../config/types";

defineOptions({ name: "HomeDocAnalysisCard" });

const ns = useNamespace("docAnalysis");

const { theme, frontmatter, localeIndex } = useData();
// 站点信息配置项
const {
  createTime,
  title = `${docAnalysisSvg}站点信息`,
  statistics = {},
  overrideInfo = [],
  appendInfo = [],
}: DocAnalysis = { ...unref(theme).docAnalysis, ...unref(frontmatter).tk?.docAnalysis };

const docAnalysisInfo = computed(() => unref(theme).docAnalysisInfo || {});

const finalTitle = computed(() => {
  if (isFunction(title)) return title(unref(localeIndex), docAnalysisSvg);
  return title;
});

const createToNowDay = dayDiff(createTime || getNowDate());

const posts = usePosts();

/**
 * 本周新增的文章数
 */
const postAddNum = computed(() => {
  const sortPostsByDate = unref(posts).sortPostsByDate;
  let weekAddNum = 0;
  let monthAddNum = 0;

  const currentDate = new Date(getNowDate());

  for (const item of sortPostsByDate) {
    if (!item.date) continue;

    const postDate = new Date(item.date);

    if (postDate.getTime() > currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) weekAddNum++;
    if (postDate.getTime() > currentDate.getTime() - 30 * 24 * 60 * 60 * 1000) monthAddNum++;
    else return { weekAddNum, monthAddNum }; // sortPostsByDate 本身已经对时间排好序了，因此不满足近一月，也就不需要遍历了
  }

  return { weekAddNum, monthAddNum };
});

/**
 * 格式化字数
 */
const formatWordCount = (wordCount: number) => {
  if (wordCount < 1000) return wordCount + "";
  if (wordCount < 1000000) return Math.round(wordCount / 100) / 10 + "k";
  return Math.round(wordCount / 10000) / 10 + "w";
};

const route = useRoute();

const statisticsInfo: UseBuSunZi = {
  sitePv: ref(0),
  siteUv: ref(0),
  isGet: ref(false),
};
const { provider = "", siteView = true, iteration, siteIteration = 2000 }: DocAnalysis["statistics"] = statistics;
const useSiteView = provider === "busuanzi" && siteView;

if (useSiteView) {
  // 通过不蒜子获取访问量和访客数
  const { sitePv, siteUv, isGet, request } = useBuSunZi(true, iteration, siteIteration);
  statisticsInfo.sitePv = sitePv;
  statisticsInfo.siteUv = siteUv;
  statisticsInfo.isGet = isGet;

  watch(route, () => {
    request();
  });
}

type DocAnalysisResolve = DocAnalysisInfo & { originValue?: string | number };

const docAnalysisList = computed<DocAnalysisResolve[]>(() => [
  {
    key: "totalPosts",
    label: "文章数目",
    originValue: unref(docAnalysisInfo).fileList.length,
    value: `${unref(docAnalysisInfo).fileList.length} 篇`,
  },
  {
    key: "weekAddNum",
    label: "近一周新增",
    originValue: unref(postAddNum)?.weekAddNum,
    value: `${unref(postAddNum)?.weekAddNum} 篇`,
  },
  {
    key: "monthAddNum",
    label: "近一月新增",
    originValue: unref(postAddNum)?.monthAddNum,
    value: `${unref(postAddNum)?.monthAddNum} 篇`,
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
    originValue: unref(statisticsInfo.sitePv),
    value: unref(statisticsInfo.isGet) ? `${unref(statisticsInfo.sitePv)} 次` : "Get...",
    show: useSiteView,
  },
  {
    key: "visitCount",
    label: "本站曾来访过",
    originValue: unref(statisticsInfo.siteUv),
    value: unref(statisticsInfo.isGet) ? `${unref(statisticsInfo.siteUv)} 人` : "Get...",
    show: useSiteView,
  },
  ...(appendInfo as any[]),
]);

if (overrideInfo.length) {
  watch(docAnalysisList, (newValue: DocAnalysisResolve[]) => {
    newValue.forEach((item: DocAnalysisResolve) => {
      const override = overrideInfo.find(overrideItem => overrideItem.key === item.key);
      if (override) {
        item.label = override.label || item.label;
        item.value = override.value ? override.value(item.originValue || "", item.value) : item.value;
        item.show = override.show !== false;
      }
    });
  });
}
</script>

<template>
  <slot name="teek-home-doc-analysis-before" />

  <HomeCard :title="finalTitle" :class="ns.b()">
    <template v-for="item in docAnalysisList" :key="item.key">
      <div v-if="item.show !== false" :class="ns.e('item')">
        <span v-html="item.label" />
        <span v-html="item.value" />
      </div>
    </template>
  </HomeCard>

  <slot name="teek-home-doc-analysis-after" />
</template>
