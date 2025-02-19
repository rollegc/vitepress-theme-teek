<script setup lang="ts" name="HomePostItem">
import { computed } from "vue";
import { useDesign } from "../hooks";
import { withBase } from "vitepress";
import { TkContentData } from "../post/types";
import { createImageViewer } from "./ImageViewer";
import { useUnrefData } from "../configProvider";
import PostBaseInfo from "./PostBaseInfo.vue";
import { Post } from "../config/types";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("postItem");

const { post = { url: "", frontmatter: {} } } = defineProps<{ post: TkContentData }>();

const { frontmatter, theme } = useUnrefData();

const {
  excerptPosition = "bottom",
  showMore = true,
  moreLabel = "阅读全文 >",
  coverImgMode = "default",
  showCapture = false,
  showBaseInfo = true,
  imageViewer = {},
}: Post = { ...theme.post, ...frontmatter.tk?.post };

const excerpt = post.frontmatter.description || post.excerpt || (showCapture && post.capture);

/**
 * 点击图片进行预览
 */
const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = [imgUrl || []].flat() as string[];
  const imageViewerOptions = { ...imageViewer, urlList };
  createImageViewer(imageViewerOptions);
};

const coverImgMap = computed(() => {
  const imgSrcList = [post.frontmatter.coverImg || []].flat();
  return {
    default: {
      is: "div",
      props: {
        class: "default",
        style: `background-image: url(${withBase(imgSrcList[0])});`,
        onClick: () => handleViewImg(imgSrcList),
      },
    },
    large: {
      is: "img",
      props: {
        class: "large",
        src: withBase(imgSrcList[0]),
        onClick: () => handleViewImg(imgSrcList),
      },
    },
  };
});

// 是否展示作者、日期、分类、标签等信息
const isShowBaseInfo = computed(() => {
  const arr = [showBaseInfo].flat();
  if (arr.includes(true) || arr.includes("home")) return true;
  return false;
});
</script>

<template>
  <div :class="prefixClass">
    <i v-if="!!post.frontmatter.sticky" class="pin" :title="`置顶：${post.frontmatter.sticky}`" />

    <div :class="[`${prefixClass}-info`, { 'large-cover': coverImgMode === 'large' }]">
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
        <div :class="`${prefixClass}-info__left-footer`">
          <PostBaseInfo v-if="isShowBaseInfo" :post scope="home" split />
        </div>

        <!-- 摘要 bottom -->
        <div v-if="excerpt && excerptPosition === 'bottom'" :class="`${prefixClass}-info__left-excerpt bottom`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div :class="`${prefixClass}-info__right flx-align-center`">
        <div v-if="post.frontmatter.coverImg || post.frontmatter.coverImg?.length" class="cover-img">
          <component :is="coverImgMap[coverImgMode].is" v-bind="coverImgMap[coverImgMode].props" />
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

$prefix-class: #{$theme-namespace}-postItem;

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
