<script setup lang="ts" name="ArticleAnalyze">
import { useData } from "vitepress";
import { useDesign } from "../hooks";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { ref, unref } from "vue";
import { formatDate } from "../helper";
import { House, User, Calendar, FolderOpened, CollectionTag } from "@element-plus/icons-vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("articleAnalyze");

const { page, frontmatter, theme } = useData();

const author = unref(frontmatter).author || unref(theme).author;
const date = formatDate(unref(frontmatter).date || new Date());
const categories = unref(frontmatter).categories || [];
const tags = unref(frontmatter).tags || [];

const breadcrumb = unref(frontmatter).breadcrumb ||
  unref(theme).breadcrumb || { enabled: true, showCurrentName: false };

const relativePathArr = unref(page).relativePath.split("/") as string[];

const classifyList = ref<string[]>([]);

relativePathArr.forEach((item, index) => {
  // 去除「序号.」的前缀，并获取文件名
  const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

  if (index !== relativePathArr.length - 1 || breadcrumb?.showCurrentName) {
    unref(classifyList).push(fileName);
  }
});

const getFilePath = (index: string) => {
  return unref(theme).catalogues?.inv[relativePathArr[index]];
};
</script>

<template>
  <div :class="`${prefixClass} flx-justify-between`">
    <el-breadcrumb v-if="breadcrumb?.enabled" separator="/">
      <el-breadcrumb-item>
        <a href="/" title="首页">
          <el-icon><House /></el-icon>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in classifyList" :key="index" :title="item">
        <a :href="getFilePath(index) ? getFilePath(index) : undefined">
          {{ item }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div :class="`${prefixClass}-wrapper flx-center`">
      <div class="flx-center">
        <el-icon><User /></el-icon>
        <a
          v-if="author?.name"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/articleAnalyze.scss";
</style>
