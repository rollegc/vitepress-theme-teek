<script setup lang="ts" name="HomePostItem">
import { computed } from "vue";
import { useNamespace } from "../hooks";
import { withBase } from "vitepress";
import { TkContentData } from "../post/types";
import { createImageViewer } from "./ImageViewer";
import { useUnrefData } from "../configProvider";
import PostBaseInfo from "./PostBaseInfo.vue";
import { Post } from "../config/types";

const ns = useNamespace("postItem");

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
    full: {
      is: "img",
      props: {
        class: "full",
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
  <div :class="ns.b()">
    <i v-if="!!post.frontmatter.sticky" class="pin" :title="`置顶：${post.frontmatter.sticky}`" />

    <div :class="[ns.e('info'), { 'full-cover': coverImgMode === 'full' }, 'flx']">
      <div :class="ns.e('info__left')">
        <!-- 标题 -->
        <a class="title" :href="post.url">
          {{ post.title }}
        </a>

        <!-- 摘要 top -->
        <div v-if="excerpt && excerptPosition === 'top'" :class="`${ns.e('info__left__excerpt')} top`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>

        <!-- 文章信息 -->
        <div :class="ns.e('__info__left__footer')">
          <PostBaseInfo v-if="isShowBaseInfo" :post scope="home" split />
        </div>

        <!-- 摘要 bottom -->
        <div v-if="excerpt && excerptPosition === 'bottom'" :class="`${ns.e('info__left__excerpt')} bottom`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div :class="`${ns.e('info__right')} flx-align-center`">
        <div v-if="post.frontmatter.coverImg || post.frontmatter.coverImg?.length" class="cover-img">
          <component :is="coverImgMap[coverImgMode].is" v-bind="coverImgMap[coverImgMode].props" />
        </div>
      </div>
    </div>
  </div>
</template>
