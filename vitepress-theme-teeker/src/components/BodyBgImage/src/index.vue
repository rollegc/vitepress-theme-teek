<script setup lang="ts" name="BodyBgImage">
import { onMounted } from "vue";
import { useNamespace, useSwitchData } from "../../../hooks";
import { useUnrefData } from "../../../configProvider";
import { isString } from "../../../helper";
import { BodyBgImg } from "../../../config/types";
import { withBase } from "vitepress";

defineOptions({ name: "BodyBgImage" });

const ns = useNamespace("bodyBgImage");

const { theme } = useUnrefData();

let {
  imgSrc,
  imgOpacity = 1,
  imgInterval = 15000,
  mask = false,
  maskBg = "rgba(0, 0, 0, 0.2)",
}: BodyBgImg = theme.bodyBgImg || {};

// body 背景图片定时轮播
const { data: imageSrc, startAutoSwitch: switchImg } = useSwitchData({
  dataArray: [imgSrc || []].flat().map(item => item && withBase(item)),
  timeout: imgInterval,
  onAfterUpdate: newValue => {
    // 预加载下一张图片
    if (newValue) {
      const img = new Image();
      img.src = newValue;
    }
  },
});

onMounted(() => {
  switchImg();
});
</script>

<template>
  <div
    :class="ns.b()"
    :style="`background-image: url(${imageSrc}); opacity:${imgOpacity}; ${ns.cssVarName('body-mask-bg-color')}: ${isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`}`"
  >
    <div v-if="mask" class="mask" />
  </div>
</template>
