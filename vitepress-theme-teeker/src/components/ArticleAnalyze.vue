<script setup lang="ts" name="ArticleAnalyze">
import { useRoute, useData } from "vitepress";
import { useNamespace, useBuSunZi } from "../hooks";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { computed, unref } from "vue";
import { House, Reading, Clock, View } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";
import { FileInfo } from "vitepress-plugin-doc-analysis";
import PostBaseInfo from "./PostBaseInfo.vue";
import { Breadcrumb, DocAnalysis, Post } from "../config/types";
import { TkContentData } from "../post/types";

const ns = useNamespace("articleAnalyze");

const { theme, frontmatter } = useUnrefData();
const { theme: themeRef, localeIndex, page } = useData();

// 面包屑配置项
const breadcrumb: Breadcrumb = {
  enabled: true,
  showCurrentName: false,
  separator: "/",
  ...theme.breadcrumb,
  ...frontmatter.breadcrumb,
};
const relativePathArr = computed(() => unref(page).relativePath.split("/") || []);

const breadcrumbList = computed(() => {
  const classifyList: { fileName: string; filePath: string }[] = [];
  const relativePathArrConst: string[] = unref(relativePathArr);

  relativePathArrConst.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容多语言功能，如果使用多语言，在面包屑去掉多语言根目录名
    if ((index !== relativePathArrConst.length - 1 || breadcrumb?.showCurrentName) && fileName !== unref(localeIndex)) {
      classifyList.push({
        fileName,
        filePath: theme.catalogues?.inv[item]?.filePath || "",
      });
    }
  });
  return classifyList;
});

// 文章基本信息
const post: TkContentData = {
  author: { ...theme.author, ...frontmatter.author },
  date: frontmatter.date,
  frontmatter: frontmatter,
  url: "",
};

// 站点信息数据
const docAnalysisInfo = computed(() => unref(themeRef).docAnalysisInfo || {});
// 站点信息配置项
const {
  pageView = true,
  wordCount = true,
  readingTime = true,
  pageIteration = 2000,
}: DocAnalysis = { ...theme.docAnalysis, ...frontmatter.docAnalysis };

const route = useRoute();

// 文章阅读量、阅读时长、字数
const pageViewInfo = computed(() => {
  let pageViewInfo: Partial<FileInfo> = {};
  unref(docAnalysisInfo).eachFileWords.forEach((item: FileInfo) => {
    if (item.fileInfo.relativePath === route.data.relativePath) return (pageViewInfo = item);
  });

  return pageViewInfo;
});

const { showBaseInfo = true }: Post = { ...theme.post, ...frontmatter.post };

// 是否展示作者、日期、分类、标签等信息
const isShowBaseInfo = computed(() => {
  const arr = [showBaseInfo].flat();
  if (arr.includes(true) || arr.includes("article")) return true;
  return false;
});

// 通过不蒜子获取页面访问量
const { pagePv, isGet } = useBuSunZi(pageIteration);
</script>

<template>
  <div :class="`${ns.b()} flx-justify-between`">
    <el-breadcrumb v-if="breadcrumb?.enabled" :separator="breadcrumb.separator">
      <el-breadcrumb-item>
        <a href="/" title="首页">
          <el-icon><House /></el-icon>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <component
          :is="item.filePath ? 'a' : 'span'"
          :href="item.filePath ? `/${item.filePath}` : undefined"
          :title="item.fileName"
        >
          {{ item.fileName }}
        </component>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="isShowBaseInfo" :class="`${ns.e('wrapper')} flx-center`">
      <PostBaseInfo :post scope="article" />

      <div v-if="wordCount" class="flx-center">
        <el-icon><Reading /></el-icon>
        <a title="文章字数">{{ pageViewInfo.wordCount }}</a>
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
