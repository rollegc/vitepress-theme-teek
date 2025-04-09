<script setup lang="ts" name="ArticleImagePreview">
import { computed, unref } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { createImageViewer } from "../../ImageViewer";
import { useEventListener } from "../../../hooks";

const { getTeekConfig } = useTeekConfig();

// 文章图片配置
const imageViewer = computed(() => {
  const { imageViewer = {} } = getTeekConfig("article");
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

useEventListener(() => document.querySelector(selector), "click", previewImage);
</script>

<template></template>
