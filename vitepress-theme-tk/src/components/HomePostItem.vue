<script setup lang="ts" name="HomePostItem">
import { computed, unref } from "vue";
import { useDesign } from "../hooks";
import { withBase } from "vitepress";
import { KtContentData } from "../data/types";
import { createImageViewer } from "./ImageViewer";
import { formatDate } from "../helper";
import { ElIcon } from "element-plus";
import { User, Calendar, FolderOpened, CollectionTag } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-item");

const props = defineProps<{ post: KtContentData }>();

const { frontmatter, theme } = useUnrefData();

const {
  excerptPosition = "bottom",
  showMore = true,
  moreLabel = "阅读全文 >",
  coverImgMode = "simple",
  showIcon = true,
  imageViewer = {},
} = { ...theme.post, ...frontmatter.tk?.post };

const postFrontmatter = computed(() => props.post.frontmatter);
const excerpt = unref(postFrontmatter).description || props.post.excerpt || props.post.capture;

const getImgUrl = (imgUrl: string | string[]) => {
  // 页面只展示一个图片
  return withBase([imgUrl || []].flat()[0]);
};

/**
 * 点击图片进行预览
 */
const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = [imgUrl || []].flat() as string[];
  const imageViewerOptions = { ...imageViewer, urlList };
  createImageViewer(imageViewerOptions);
};
</script>

<template>
  <div :class="prefixClass">
    <i v-if="!!postFrontmatter.sticky" class="pin" title="置顶" />

    <div :class="`${prefixClass}-info flx-align-center`">
      <div :class="`${prefixClass}-info__left`">
        <!-- 标题 -->
        <a class="title" :href="post.url">
          {{ post.title }}
        </a>

        <!-- 摘要 top -->
        <div v-if="excerpt && excerptPosition === 'top'" :class="`${prefixClass}-info__left-excerpt top`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>

        <!-- 文章信息 -->
        <div :class="`${prefixClass}-info__left-footer flx-align-center`">
          <span class="split flx-center">
            <el-icon v-if="showIcon"><User /></el-icon>
            <a
              v-if="post.author?.name"
              title="作者"
              :href="post.author.link ? post.author.link : 'javaScript:void(0)'"
              :target="post.author.link ? '_blank' : '_self'"
            >
              {{ post.author.name }}
            </a>
          </span>

          <span class="split flx-center">
            <el-icon v-if="showIcon"><Calendar /></el-icon>
            <a v-if="post.date" title="创建时间">{{ formatDate(post.date, "yyyy-MM-dd") }}</a>
          </span>

          <span v-if="postFrontmatter.categories?.length" title="分类" class="split flx-center">
            <el-icon v-if="showIcon"><FolderOpened /></el-icon>
            <a
              v-for="(category, index) in postFrontmatter.categories"
              :key="index"
              :href="`/categories?category=${encodeURIComponent(category)}`"
              class="or"
            >
              {{ category }}
            </a>
          </span>

          <span v-if="postFrontmatter.tags?.length" title="标签" class="split flx-center">
            <el-icon v-if="showIcon"><CollectionTag /></el-icon>
            <a
              v-for="(tag, index) in postFrontmatter.tags"
              :key="index"
              :href="`/tags?tag=${encodeURIComponent(tag)}`"
              class="or"
            >
              {{ tag }}
            </a>
          </span>
        </div>

        <!-- 摘要 bottom -->
        <div v-if="excerpt && excerptPosition === 'bottom'" :class="`${prefixClass}-info__left-excerpt bottom`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div :class="`${prefixClass}-info__right`">
        <div v-if="postFrontmatter.coverImg || postFrontmatter.coverImg?.length" class="cover-img">
          <div
            v-if="coverImgMode == 'simple'"
            :class="coverImgMode"
            :style="`background-image: url(${getImgUrl(postFrontmatter.coverImg)});`"
            @click="handleViewImg(postFrontmatter.coverImg)"
          />
          <img
            v-else-if="coverImgMode == 'full'"
            :src="getImgUrl(postFrontmatter.coverImg)"
            :class="coverImgMode"
            @click="handleViewImg(postFrontmatter.coverImg)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homePostItem.scss";
</style>

<style lang="scss">
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-post-item;

.#{$prefix-class} {
  .excerpt {
    h1,
    h2,
    h3 {
      display: none;
    }

    img {
      max-height: 280px;
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
