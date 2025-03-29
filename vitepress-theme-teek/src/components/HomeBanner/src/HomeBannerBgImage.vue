<script setup lang="ts" name="HomeBannerBgImage">
import { withBase, useData } from "vitepress";
import { onMounted, unref } from "vue";
import { useNamespace, useSwitchData } from "../../../hooks";
import { isString } from "../../../helper";
import { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerBgImage" });

const ns = useNamespace("bannerBgImage");

const { theme, frontmatter } = useData();

// Banner 配置项
const {
  bgStyle,
  imgSrc,
  imgInterval = 15000,
  imgShuffle = false,
  mask = true,
  maskBg = "rgba(0, 0, 0, 0.4)",
}: Banner = { ...unref(theme).banner, ...unref(frontmatter).tk?.banner };

// 局部图片背景风格
const isPartImgBgStyle = bgStyle === "partImg";
// 全屏图片背景风格
const isFullImgBgStyle = bgStyle === "fullImg";

// banner 背景图片定时轮播
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
  const imgBgVar = ns.cssVarName("banner-img-bg");
  const maskBgColorVar = ns.cssVarName("banner-mask-bg-color");
  const imgSwitchIntervalVar = ns.cssVarName("banner-img-switch-interval-s");

  // 如果没有传入图片，则加载默认图片
  if (!imgSrc?.length) return { [imgBgVar]: ns.cssVar("bg-img-default") };

  return {
    [imgBgVar]: `url(${unref(imageSrc)}) center center / cover no-repeat`,
    [maskBgColorVar]: isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`,
    [imgSwitchIntervalVar]: imgInterval / 1000 + "s",
  };
};
</script>

<template>
  <div :class="[ns.b(), { part: isPartImgBgStyle, full: isFullImgBgStyle }]" :style="getStyle()">
    <div v-if="mask && imgSrc" class="mask" />
    <slot v-if="isPartImgBgStyle" />
  </div>
  <slot v-if="isFullImgBgStyle" />
</template>
