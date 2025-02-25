<script setup lang="ts" name="BodyBgImage">
import { useNamespace, useSwitchData } from "../hooks";
import { useUnrefData } from "../configProvider";
import { onMounted } from "vue";
import { isString } from "../helper";
import { BodyBgImg } from "../config/types";

const ns = useNamespace("bodyBgImage");

const { theme } = useUnrefData();

let {
  imgSrc,
  imgOpacity = 1,
  imgInterval = 15000,
  mask = false,
  maskBg = "rgba(0, 0, 0, 0.2)",
  pageStyle = "default",
}: BodyBgImg = theme.bodyBgImg || {};

// body 背景图片定时轮播
const { data: imageSrc, startAutoSwitch: switchImg } = useSwitchData({
  dataArray: [imgSrc || []].flat(),
  timeout: imgInterval,
  onAfterUpdate: newValue => {
    // 预加载下一张图片
    if (newValue) {
      const img = new Image();
      img.src = newValue;
    }
  },
});

const initPageStyle = () => {
  const tkLayoutDom = document.querySelector(`.${ns.joinNamespace("layout")}`);
  tkLayoutDom?.classList.add(ns.joinNamespace(pageStyle));
};

onMounted(() => {
  switchImg();
  initPageStyle();
});
</script>

<template>
  <div
    :class="ns.b()"
    :style="`background-image: url(${imageSrc}); opacity:${imgOpacity}; --body-mask-bg-color: ${isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`}`"
  >
    <div v-if="mask" class="mask" />
  </div>
</template>
