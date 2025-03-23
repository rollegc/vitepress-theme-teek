<script setup lang="ts" name="ArticleImagePreview">
import { onMounted, onUnmounted, computed, unref } from "vue";
import { useData } from "vitepress";
import { createImageViewer } from "../../ImageViewer";

const { theme, frontmatter } = useData();

// 文章图片配置
const imageViewer = computed<Article>(() => {
  const { imageViewer = {} } = { ...unref(theme).article, ...unref(frontmatter).article };
  return imageViewer;
});

const selector = ".content-container .main";

const previewImage = (e: Event) => {
  const target = e.target as HTMLElement;
  const currentTarget = e.currentTarget as HTMLElement;

  if (target.tagName.toLowerCase() === "img") {
    const imgDoms = currentTarget.querySelectorAll<HTMLImageElement>(selector);
    const imgs = Array.from(imgDoms);

    const urlList = imgs.map(el => el.src);
    let initialIndex = imgs.findIndex(el => el === target);
    const url = target.getAttribute("src");

    // 兼容点击文档之外的图片
    if (initialIndex === -1 && url) {
      urlList.push(url);
      initialIndex = urlList.length - 1;
    }

    createImageViewer({ ...unref(imageViewer), urlList, initialIndex, infinite: false });
  }
};

onMounted(() => {
  const docDomContainer = document.querySelector(selector);
  docDomContainer?.addEventListener("click", previewImage);
});

onUnmounted(() => {
  const docDomContainer = document.querySelector(selector);
  docDomContainer?.removeEventListener("click", previewImage);
});
</script>

<template></template>
