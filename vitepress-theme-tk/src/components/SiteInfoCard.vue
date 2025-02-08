<script setup lang="ts" name="SiteInfoCard">
import { useUnrefData } from "../configProvider";
import { useDesign, useBuSunZi } from "../hooks";
import { dayDiff, getNowDate, timeDiff } from "../helper";
import HomeCard from "./HomeCard.vue";
import siteInfoSvg from "../assets/svg/siteInfo";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("siteInfo");

const { frontmatter, theme } = useUnrefData();
// 站点信息配置项
const {
  createTime,
  siteView = true,
  siteIteration,
  title = `${siteInfoSvg}站点信息`,
} = { ...theme.docAnalysis, ...frontmatter.tk?.docAnalysis };
const { fileList = [], totalFileWords = 0, lastCommitTime } = { ...theme.docAnalysisInfo };

const createToNowDay = dayDiff(createTime || getNowDate());

// 通过不蒜子获取访问量和访客数
const { sitePv, siteUv, isGet } = useBuSunZi(siteIteration);
</script>

<template>
  <HomeCard :title :class="`${prefixClass} card`">
    <div :class="`${prefixClass}-item`">
      <span>文章数目：</span>
      <span>{{ fileList.length }} 篇</span>
    </div>

    <div :class="`${prefixClass}-item`">
      <span>已运行时间：</span>
      <span>
        {{ createToNowDay != 0 ? createToNowDay + " 天" : "不到一天" }}
      </span>
    </div>

    <div :class="`${prefixClass}-item`">
      <span>本站总字数：</span>
      <span>{{ totalFileWords }} 字</span>
    </div>

    <div :class="`${prefixClass}-item`">
      <span>最后活动时间：</span>
      <span>
        {{ timeDiff(lastCommitTime) }}
      </span>
    </div>

    <div v-if="siteView" :class="`${prefixClass}-item`">
      <span>本站被访问了：</span>
      <span>{{ isGet ? sitePv : "Get..." }} 次</span>
    </div>

    <div v-if="siteView" :class="`${prefixClass}-item`">
      <span>本站曾来访过：</span>
      <span>{{ isGet ? siteUv : "Get..." }} 人</span>
    </div>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/siteInfoCard.scss";
</style>
