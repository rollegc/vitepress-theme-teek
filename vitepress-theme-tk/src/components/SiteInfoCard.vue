<script setup lang="ts" name="SiteInfoCard">
import { useUnrefData } from "../configProvider";
import { useDesign, useBuSunZi } from "../hooks";
import { dayDiff, getNowDate, timeDiff } from "../helper";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("siteInfo");

const { theme } = useUnrefData();

const { fileList = [], totalFileWords = 0, lastCommitTime } = theme.docAnalysisInfo || {};
const { createTime, siteView = true, siteIteration } = theme.docAnalysis || {};

const createToNowDay = dayDiff(createTime || getNowDate());

const { sitePv, siteUv, isGet } = useBuSunZi(siteIteration);
</script>

<template>
  <div :class="`${prefixClass} card`">
    <div :class="`${prefixClass}-title`">站点信息</div>

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
      <span>{{ isGet ? sitePv : "Get..." }}次</span>
    </div>

    <div v-if="siteView" :class="`${prefixClass}-item`">
      <span>您的访问排名：</span>
      <span>{{ isGet ? siteUv : "Get..." }}名</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/siteInfoCard.scss";
</style>
