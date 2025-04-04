<script setup lang="ts" name="BodyBgImage">
import { onMounted, onUnmounted, unref } from "vue";
import { withBase } from "vitepress";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useSwitchData } from "../../../hooks";
import { isString } from "../../../helper";
import type { BodyBgImg } from "../../../config/types";

defineOptions({ name: "BodyBgImage" });

const ns = useNamespace("body-bg-image");

const { getTeekConfigRef } = useTeekConfig();

const bodyBgImgConfig = getTeekConfigRef<BodyBgImg>("bodyBgImg", {
  imgSrc: undefined,
  imgOpacity: 1,
  imgInterval: 15000,
  imgShuffle: false,
  mask: false,
  maskBg: "rgba(0, 0, 0, 0.2)",
});

// body 背景图片定时轮播
const {
  data: imageSrc,
  startAutoSwitch,
  stopAutoSwitch,
} = useSwitchData(
  [unref(bodyBgImgConfig).imgSrc || []].flat().map(item => item && withBase(item)),
  {
    timeout: unref(bodyBgImgConfig).imgInterval,
    shuffle: unref(bodyBgImgConfig).imgShuffle,
    onAfterUpdate: newValue => {
      // 预加载下一张图片
      if (newValue) {
        const img = new Image();
        img.src = newValue;
      }
    },
  }
);

onMounted(() => {
  startAutoSwitch();
});

onUnmounted(() => {
  stopAutoSwitch();
});

const getStyle = () => {
  const { imgSrc, imgOpacity, maskBg } = unref(bodyBgImgConfig);
  const imgBgVar = ns.cssVarName("body-bg-img");
  const imgBgOpacityVar = ns.cssVarName("body-bg-img-opacity");
  const maskBgColorVar = ns.cssVarName("body-mask-bg-color");

  // 如果没有传入图片，则加载默认图片
  if (!imgSrc?.length) return { [imgBgVar]: ns.cssVar("bg-img-default") };

  return {
    [imgBgVar]: `url(${unref(imageSrc)}) center center / cover no-repeat`,
    [imgBgOpacityVar]: imgOpacity,
    [maskBgColorVar]: isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`,
  };
};
</script>

<template>
  <div :class="ns.b()" :style="getStyle()">
    <div v-if="bodyBgImgConfig.mask" class="mask" />
  </div>
</template>
