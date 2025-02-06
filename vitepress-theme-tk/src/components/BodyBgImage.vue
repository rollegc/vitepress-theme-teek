<script setup lang="ts" name="BodyBgImage">
import { useDesign } from "../hooks";
import { useUnrefData } from "../configProvider";
import { isString, isArray } from "../helper";
import { onMounted, ref } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("bodyBgImage");

let { imgSrc, imgOpacity = 1, imgInterval = 15 } = useUnrefData().theme.bodyBgImg || {};
const bgImg = ref<string | string[]>([]);

const loadBodyBgImage = () => {
  if (isString(imgSrc)) bgImg.value = imgSrc;
  else if (isArray(imgSrc)) {
    let count = 0;
    let timer: NodeJS.Timeout | undefined = undefined;
    bgImg.value = imgSrc[count];

    clearInterval(timer);

    timer = setInterval(() => {
      if (++count >= imgSrc.length) count = 0;
      bgImg.value = imgSrc[count];

      // 预加载下一张图片
      if (imgSrc[count + 1]) {
        const img = new Image();
        img.src = imgSrc[count + 1];
      }
    }, imgInterval * 1000);
  }
};

onMounted(() => {
  loadBodyBgImage();
});
</script>
<template>
  <div :class="prefixClass" :style="`background-image: url(${bgImg}); opacity:${imgOpacity}`" />
</template>

<style lang="scss" scoped>
@use "../styles/components/bodyBgImage.scss";
</style>
