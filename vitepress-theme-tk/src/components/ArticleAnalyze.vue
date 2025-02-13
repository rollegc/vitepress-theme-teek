<script setup lang="ts" name="ArticleAnalyze">
import { useRoute, useData } from "vitepress";
import { useDesign, useBuSunZi } from "../hooks";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { computed, ref, unref } from "vue";
import { House, Reading, Clock, View } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";
import { FileWords } from "vitepress-plugin-doc-analysis";
import PostBaseInfo from "./PostBaseInfo.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("articleAnalyze");

const { theme, frontmatter, page } = useUnrefData();
const { theme: themeRef, localeIndex } = useData();

// 面包屑配置项
const breadcrumb = {
  enabled: true,
  showCurrentName: false,
  separator: "/",
  ...theme.breadcrumb,
  ...frontmatter.breadcrumb,
};
const relativePathArr = page.relativePath.split("/") as string[];
const classifyList = ref<string[]>([]);

relativePathArr.forEach((item, index) => {
  // 去除「序号.」的前缀，并获取文件名
  const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

  // 兼容多语言功能，如果使用多语言，在面包屑去掉多语言根目录名
  if ((index !== relativePathArr.length - 1 || breadcrumb?.showCurrentName) && fileName !== unref(localeIndex)) {
    unref(classifyList).push(fileName);
  }
});

// 文章的 URL，面包屑点击文章名后跳转
const getFilePath = (index: number) => {
  return theme.catalogues?.inv[relativePathArr[index]];
};

const route = useRoute();

// 站点信息数据
const docAnalysisInfo = computed(() => unref(themeRef).docAnalysisInfo || {});
// 站点信息配置项
const { pageView = true, wordsCount = true, readingTime = true, pageIteration } = theme.docAnalysis || {};

// 文章阅读量、阅读时长、字数
const pageViewInfo = computed(() => {
  let pageViewInfo: Partial<FileWords> = {};
  unref(docAnalysisInfo).eachFileWords.forEach((item: FileWords) => {
    if (item.fileInfo.relativePath === route.data.relativePath) return (pageViewInfo = item);
  });

  return pageViewInfo;
});

// 通过不蒜子获取页面访问量
const { pagePv, isGet } = useBuSunZi(pageIteration);
</script>

<template>
  <div :class="`${prefixClass} flx-justify-between`">
    <el-breadcrumb v-if="breadcrumb?.enabled" :separator="breadcrumb.separator">
      <el-breadcrumb-item>
        <a href="/" title="首页">
          <el-icon><House /></el-icon>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in classifyList" :key="index">
        <component
          :is="getFilePath(index) ? 'a' : 'span'"
          :href="getFilePath(index) ? `/${getFilePath(index)}` : undefined"
          :title="item"
        >
          {{ item }}
        </component>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div :class="`${prefixClass}-wrapper flx-center`">
      <PostBaseInfo />

      <div v-if="wordsCount" class="flx-center">
        <el-icon><Reading /></el-icon>
        <a title="文章字数">{{ pageViewInfo.wordsCount }}</a>
      </div>

      <div v-if="readingTime" class="flx-center">
        <el-icon><Clock /></el-icon>
        <a title="预计阅读时长">{{ pageViewInfo.readingTime }}</a>
      </div>

      <div v-if="pageView" class="flx-center">
        <el-icon><View /></el-icon>
        <a title="浏览量">{{ isGet ? pagePv : "Get..." }}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/articleAnalyze.scss";
</style>
