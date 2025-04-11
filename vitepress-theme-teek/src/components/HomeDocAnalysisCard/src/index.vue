<script setup lang="ts" name="HomeDocAnalysisCard">
import { computed, ref, unref, watch } from "vue";
import { useData, useRoute } from "vitepress";
import { useTeekConfig, usePosts } from "../../../configProvider";
import { useNamespace, useBuSunZi, type UseBuSunZi } from "../../../hooks";
import { formatDiffDateToDay, getNowDate, isFunction, formatDiffDate } from "../../../helper";
import HomeCard from "../../HomeCard";
import { docAnalysisIcon } from "../../../assets/icons";
import type { DocAnalysis, DocAnalysisInfo } from "../../../config/types";

defineOptions({ name: "HomeDocAnalysisCard" });

const ns = useNamespace("doc-analysis");
const { getTeekConfigRef } = useTeekConfig();
const { theme } = useData();

// 站点信息配置项
const docAnalysisConfig = getTeekConfigRef<Required<DocAnalysis>>("docAnalysis", {
  createTime: undefined,
  title: `${docAnalysisIcon}站点信息`,
  statistics: {},
  overrideInfo: [],
  appendInfo: [],
});

const docAnalysisInfo = computed(() => unref(theme).docAnalysisInfo || {});

const finalTitle = computed(() => {
  const { title } = unref(docAnalysisConfig);
  if (isFunction(title)) return title(docAnalysisIcon);
  return title;
});

const createToNowDay = computed(() => formatDiffDateToDay(unref(docAnalysisConfig).createTime || getNowDate()));

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

const statisticsConfig = computed<NonNullable<DocAnalysis["statistics"]>>(() => ({
  provider: "",
  siteView: true,
  iteration: false,
  pageIteration: 2000,
  ...unref(docAnalysisConfig).statistics,
}));
// 是否使用访问量功能
const useSiteView = computed(() => !!unref(statisticsConfig).provider && unref(statisticsConfig).siteView);
const statisticsInfo: UseBuSunZi = {
  sitePv: ref(0),
  siteUv: ref(0),
  isGet: ref(false),
};

// 通过不蒜子获取访问量和访客数
const { sitePv, siteUv, isGet, request } = useBuSunZi(
  unref(useSiteView),
  unref(statisticsConfig).iteration,
  unref(statisticsConfig).pageIteration
);
statisticsInfo.sitePv = sitePv;
statisticsInfo.siteUv = siteUv;
statisticsInfo.isGet = isGet;

const route = useRoute();
watch(route, () => {
  if (unref(useSiteView)) request();
});

type DocAnalysisResolve = DocAnalysisInfo & { originValue?: string | number };

const docAnalysisList = computed<DocAnalysisResolve[]>(() => {
  const { createTime, appendInfo, overrideInfo } = unref(docAnalysisConfig);
  const { fileList = [], totalFileWords, lastCommitTime } = unref(docAnalysisInfo);
  const { siteUv, sitePv, isGet } = statisticsInfo;

  const list: DocAnalysisResolve[] = [
    {
      key: "totalPosts",
      label: "文章数目",
      originValue: fileList.length,
      value: `${fileList.length} 篇`,
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
      value: `${unref(createToNowDay) === 0 ? "不到一天" : `${unref(createToNowDay)} 天`}`,
    },
    {
      key: "totalWordCount",
      label: "本站总字数",
      originValue: totalFileWords,
      value: `${formatWordCount(totalFileWords)} 字`,
    },
    {
      key: "lastActiveTime",
      label: "最后活动时间",
      originValue: lastCommitTime,
      value: formatDiffDate(lastCommitTime),
    },
    {
      key: "viewCount",
      label: "本站被访问了",
      originValue: unref(sitePv),
      value: unref(isGet) ? `${unref(sitePv)} 次` : "Get...",
      show: useSiteView,
    },
    {
      key: "visitCount",
      label: "本站曾来访过",
      originValue: unref(siteUv),
      value: unref(isGet) ? `${unref(siteUv)} 人` : "Get...",
      show: useSiteView,
    },
    ...(appendInfo as any[]),
  ];

  if (overrideInfo.length) {
    list.forEach(item => {
      const override = overrideInfo.find((overrideItem: any) => overrideItem.key === item.key);
      if (override) {
        item.label = override.label || item.label;
        item.value = override.value ? override.value(item.originValue || "", item.value) : item.value;
        item.show = override.show !== false;
      }
    });
  }

  return list;
});
</script>

<template>
  <slot name="teek-home-doc-analysis-before" />

  <HomeCard :title="finalTitle" :class="ns.b()" aria-label="首页站点分析卡片">
    <template v-for="item in docAnalysisList" :key="item.key">
      <div v-if="item.show !== false" :class="ns.e('item')">
        <span v-html="item.label" />
        <span v-html="item.value" />
      </div>
    </template>
  </HomeCard>

  <slot name="teek-home-doc-analysis-after" />
</template>
