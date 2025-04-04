<script setup lang="ts" name="HomePostItem">
import { computed, unref } from "vue";
import { withBase } from "vitepress";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import type { TkContentData } from "../../../post/types";
import { createImageViewer } from "../../ImageViewer";
import ArticleInfo from "../../ArticleInfo";
import type { Article, Post } from "../../../config/types";

defineOptions({ name: "HomePostItem" });

const ns = useNamespace("post-item");
const { post, coverImgMode } = defineProps<{ post: TkContentData; coverImgMode: "default" | "full" }>();

const { getTeekConfigRef } = useTeekConfig();

const postConfig = getTeekConfigRef<Post>("post", {
  excerptPosition: "bottom",
  showMore: true,
  moreLabel: "阅读全文 >",
  showCapture: false,
  splitSeparator: false,
  imageViewer: {},
});
const articleConfig = getTeekConfigRef<Article>("article", {
  showInfo: true,
});

const postUrl = post.url && withBase(post.url);
const excerpt = computed(
  () => post.frontmatter.description || post.excerpt || (unref(postConfig).showCapture && post.capture)
);

/**
 * 点击图片进行预览
 */
const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = [imgUrl || []].flat() as string[];
  createImageViewer({ ...unref(postConfig).imageViewer, urlList });
};

const coverImgMap = computed(() => {
  const imgSrcList = [post.frontmatter.coverImg || []].flat();
  return {
    default: {
      is: "div",
      props: {
        style: `background-image: url(${withBase(imgSrcList[0])});`,
        onClick: () => handleViewImg(imgSrcList),
      },
    },
    full: {
      is: "img",
      props: {
        src: withBase(imgSrcList[0]),
        onClick: () => handleViewImg(imgSrcList),
      },
    },
  };
});

// 是否展示作者、日期、分类、标签等信息
const isShowInfo = computed(() => {
  const arr = [unref(articleConfig).showInfo].flat();
  if (arr.includes(true) || arr.includes("post")) return true;
  return false;
});
</script>

<template>
  <div :class="ns.b()">
    <i v-if="!!post.frontmatter.sticky" class="pin" :title="`置顶：${post.frontmatter.sticky}`" />

    <div :class="[ns.e('info'), 'flx']">
      <div :class="ns.e('info__left')">
        <!-- 标题 -->
        <a class="title hover-color" :href="postUrl">
          {{ post.title }}
        </a>

        <!-- 摘要 top -->
        <div v-if="excerpt && postConfig.excerptPosition === 'top'" :class="`${ns.e('info__left__excerpt')} top`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="postConfig.showMore" class="more" :href="postUrl">{{ postConfig.moreLabel }}</a>
        </div>

        <!-- 文章信息 -->
        <div :class="ns.e('info__left__footer')">
          <ArticleInfo v-if="isShowInfo" :post scope="post" :split="postConfig.splitSeparator" />
        </div>

        <!-- 摘要 bottom -->
        <div v-if="excerpt && postConfig.excerptPosition === 'bottom'" :class="`${ns.e('info__left__excerpt')} bottom`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="postConfig.showMore" class="more" :href="postUrl">{{ postConfig.moreLabel }}</a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div :class="`${ns.e('info__right')} flx-align-center`">
        <div v-if="post.frontmatter.coverImg || post.frontmatter.coverImg?.length" class="cover-img">
          <component
            :is="coverImgMap[coverImgMode].is"
            v-bind="coverImgMap[coverImgMode].props"
            :class="coverImgMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>
