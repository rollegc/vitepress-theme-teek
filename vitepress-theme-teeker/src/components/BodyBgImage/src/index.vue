<script setup lang="ts" name="BodyBgImage">
import { onMounted, unref } from "vue";
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
  imgShuffle = false,
  mask = false,
  maskBg = "rgba(0, 0, 0, 0.2)",
}: BodyBgImg = theme.bodyBgImg || {};

// body 背景图片定时轮播
const { data: imageSrc, startAutoSwitch: switchImg } = useSwitchData({
  dataArray: [imgSrc || []].flat().map(item => item && withBase(item)),
  timeout: imgInterval,
  shuffle: imgShuffle,
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

const getStyle = () => {
  return {
    "--tk-body-bg-img": `url(${unref(imageSrc)})`,
    "--tk-body-bg-img-opacity": imgOpacity,
    [ns.cssVarName("body-mask-bg-color")]: isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`,
  };
};
</script>

<template>
  <div :class="ns.b()" :style="getStyle()">
    <div v-if="mask" class="mask" />
  </div>
</template>
