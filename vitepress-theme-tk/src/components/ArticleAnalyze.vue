<script setup lang="ts" name="ArticleAnalyze">
import { useRoute } from "vitepress";
import { useDesign, useBuSunZi } from "../hooks";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { computed, ref, unref, inject } from "vue";
import { formatDate } from "../helper";
import { House, User, Calendar, FolderOpened, CollectionTag, Reading, Clock, View } from "@element-plus/icons-vue";
import { useUnrefData, postsSymbol } from "../configProvider";
import { FileWords } from "vitepress-plugin-doc-analysis";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("articleAnalyze");

const { theme, frontmatter, page } = useUnrefData();

// 基本信息
const author = { ...theme.author, ...frontmatter.author };
const categories = frontmatter.categories || [];
const tags = frontmatter.tags || [];
const posts = inject(postsSymbol);

const route = useRoute();
const { dateFormat = "yyyy-MM-dd", showBaseInfo = true } = theme.post || {};
// 文章创建时间，先读取 frontmatter.date，如果不存在，则遍历所有 md 文档获取文档的创建时间（因此建议在 frontmatter 配置 date，减少文章扫描性能）
const date = computed(() => {
  if (frontmatter.date) return formatDate(frontmatter.date, dateFormat);

  const targetPost = posts?.originPosts.filter(item =>
    [item.url, `${item.url}.md`].includes(`/${route.data.relativePath}`)
  );

  return formatDate(targetPost?.[0]?.date || new Date(), dateFormat);
});

// 文章阅读量
const { eachFileWords = [] } = theme.docAnalysisInfo || {};
// 站点信息配置项
const { pageView = true, wordsCount = true, readingTime = true, pageIteration } = theme.docAnalysis || {};

// 文章阅读量、阅读时长、字数
const pageViewInfo = computed(() => {
  let pageViewInfo: Partial<FileWords> = {};

  eachFileWords.forEach((item: FileWords) => {
    if (item.fileInfo.relativePath === route.data.relativePath) return (pageViewInfo = item);
  });
  return pageViewInfo;
});

/**
 * 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等信息
 */
const isShowBaseInfo = computed(() => {
  const arr = [showBaseInfo].flat();
  if (arr.includes(true) || arr.includes("article")) return true;
  return false;
});

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

  if (index !== relativePathArr.length - 1 || breadcrumb?.showCurrentName) {
    unref(classifyList).push(fileName);
  }
});

// 文章的 URL，面包屑点击文章名后跳转
const getFilePath = (index: number) => {
  return theme.catalogues?.inv[relativePathArr[index]];
};

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

    <div v-if="isShowBaseInfo" :class="`${prefixClass}-wrapper flx-center`">
      <div class="flx-center">
        <el-icon><User /></el-icon>
        <a
          v-if="author.name"
          title="作者"
          :href="author.link ? author.link : 'javaScript:void(0)'"
          :target="author.link ? '_blank' : '_self'"
        >
          {{ author.name }}
        </a>
      </div>

      <div class="flx-center">
        <el-icon><Calendar /></el-icon>
        <a title="创建时间">{{ date }}</a>
      </div>

      <div v-if="categories.length" class="flx-center">
        <el-icon><FolderOpened /></el-icon>
        <a
          v-for="category in categories"
          :href="`/categories?category=${encodeURIComponent(category)}`"
          title="分类"
          class="or"
        >
          {{ category }}
        </a>
      </div>

      <div v-if="tags.length" class="flx-center">
        <el-icon><CollectionTag /></el-icon>
        <a v-for="tag in tags" :href="`/tags?tag=${encodeURIComponent(tag)}`" title="标签" class="or">
          {{ tag }}
        </a>
      </div>

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
