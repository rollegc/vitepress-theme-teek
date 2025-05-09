<script setup lang="ts" name="HomePostItemCard">
import type { Article, Post, TkContentData } from "@teek/config";
import { computed } from "vue";
import { withBase } from "vitepress";
import { useNamespace, useLocale } from "@teek/hooks";
import { topIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { createImageViewer } from "@teek/components/common/ImageViewer";
import { TkIcon } from "@teek/components/common/Icon";
import { TkTitleTag } from "@teek/components/common/TitleTag";
import { TkArticleInfo } from "@teek/components/theme/ArticleInfo";

defineOptions({ name: "HomePostItemCard" });

const ns = useNamespace("post-item-card");
const { t } = useLocale();

const { post } = defineProps<{ post: TkContentData }>();

const { getTeekConfigRef } = useTeekConfig();

const postConfig = getTeekConfigRef<Post>("post", {
  showCapture: false,
  splitSeparator: false,
  imageViewer: {},
  cardStyleTitleTagPosition: "left",
});
const articleConfig = getTeekConfigRef<Article>("article", { showInfo: true });

const postUrl = post.url && withBase(post.url);
const imgSrcList = [post.frontmatter.coverImg || []].flat();

const excerpt = computed(
  () => post.frontmatter.description || post.excerpt || (postConfig.value.showCapture && post.capture)
);

const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = [imgUrl || []].flat() as string[];
  createImageViewer({ ...postConfig.value.imageViewer, urlList });
};

// 是否展示作者、日期、分类、标签等信息
const isShowInfo = computed(() => {
  const arr = [articleConfig.value.showInfo].flat();
  return arr.includes(true) || arr.includes("post");
});
</script>

<template>
  <div :class="ns.b()">
    <TkIcon
      v-if="!!post.frontmatter.sticky"
      :icon="topIcon"
      class="top"
      :size="40"
      :title="t('tk.homePost.pin', { sticky: post.frontmatter.sticky })"
      :aria-label="t('tk.homePost.pinLabel')"
    />

    <div v-if="post.frontmatter.coverImg || post.frontmatter.coverImg?.length" :class="ns.e('cover-img')">
      <img :src="withBase(imgSrcList[0])" class="cover-img" @click="handleViewImg(imgSrcList)" />
    </div>

    <div :class="[ns.e('info')]">
      <a class="title hover-color, sle" :href="postUrl" :aria-label="post.title">
        <TkTitleTag
          v-if="postConfig.cardStyleTitleTagPosition === 'left'"
          :text="post.frontmatter.titleTag"
          :position="postConfig.cardStyleTitleTagPosition"
        />
        <span>{{ post.title }}</span>
        <TkTitleTag
          v-if="postConfig.cardStyleTitleTagPosition === 'right'"
          :text="post.frontmatter.titleTag"
          :position="postConfig.cardStyleTitleTagPosition"
        />
      </a>

      <span v-if="excerpt" class="excerpt mle" v-html="excerpt" :aria-label="t('tk.homePost.excerptLabel')" />

      <TkArticleInfo
        v-if="isShowInfo"
        :post
        scope="post"
        :split="postConfig.splitSeparator"
        :aria-label="t('tk.homePost.infoLabel')"
      />
    </div>
  </div>
</template>
