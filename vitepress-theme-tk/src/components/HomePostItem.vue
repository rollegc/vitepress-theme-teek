<script setup lang="ts" name="HomePostItem">
import { computed, unref } from "vue";
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { KtContentData } from "../data/post";
import { createImageViewer } from "./ImageViewer";
import { isArray } from "../helper";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-item");

const props = defineProps<{ post: KtContentData }>();

const { frontmatter } = useData();

const postFrontmatter = computed(() => props.post.frontmatter);
const getImgUrl = (imgUrl: string | string[]) => {
  if (isArray(imgUrl)) return imgUrl[0];
  return imgUrl;
};

const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = (isArray(imgUrl) ? imgUrl : [imgUrl]) as string[];
  const imageViewerOptions = { ...unref(frontmatter).tk?.imageViewer, urlList };
  createImageViewer(imageViewerOptions);
};
</script>

<template>
  <div :class="prefixClass">
    <i v-if="!!postFrontmatter.sticky" class="pin" />

    <div :class="`${prefixClass}-info`">
      <div :class="`${prefixClass}-info__left`">
        <!-- 标题 -->
        <a class="title" :href="post.url">
          {{ post.title }}
        </a>

        <!-- 描述 -->
        <p v-if="postFrontmatter.description" class="description mle">
          {{ postFrontmatter.description }}
        </p>

        <!-- 文章信息 -->
        <div :class="`${prefixClass}-info__left-footer`">
          <a
            v-if="post.author?.name"
            title="作者"
            :href="post.author.link ? post.author.link : 'javaScript:void(0)'"
            :target="post.author.link ? '_blank' : '_self'"
            class="split"
          >
            {{ post.author.name }}
          </a>

          <a v-if="post.date" title="创建时间" class="split">{{ post.date }}</a>

          <span v-if="postFrontmatter.categories?.length" title="分类" class="split">
            <a
              v-for="(category, index) in postFrontmatter.categories"
              :key="index"
              :href="`/categories?category=${encodeURIComponent(category)}`"
              class="or"
            >
              {{ category }}
            </a>
          </span>

          <span v-if="postFrontmatter.tags?.length" title="标签" class="split">
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

        <!-- 摘要 -->
        <div :class="`${prefixClass}-info__left-excerpt`" v-if="post.excerpt">
          <div class="excerpt" v-html="post.excerpt"></div>
          <a class="more" :href="post.url">阅读全文 ></a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div
        v-if="postFrontmatter.img || postFrontmatter.img?.length"
        :class="`${prefixClass}-info__right cover-img`"
        :style="`background-image: url(${getImgUrl(postFrontmatter.img)});`"
        @click="handleViewImg(postFrontmatter.img)"
      ></div>
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
      max-height: 17.5rem;
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
