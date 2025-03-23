<script setup lang="ts" name="HomeBanner">
import { useNamespace } from "../../../hooks";
import { useUnrefData } from "../../../configProvider";
import HomeBannerBgPure from "./HomeBannerBgPure.vue";
import HomeBannerBgImage from "./HomeBannerBgImage.vue";
import HomeBannerContent from "./HomeBannerContent.vue";
import HomeBannerFeature from "./HomeBannerFeature.vue";
import HomeBannerWaves from "./HomeBannerWaves.vue";
import { Banner, BodyBgImg } from "../../../config/types";
import { onMounted, onUnmounted, ref, unref } from "vue";

defineOptions({ name: "HomeBanner" });

const ns = useNamespace("banner");
const centerClass = ns.joinNamespace("center");

const { theme, frontmatter } = useUnrefData();

// Banner 配置项
const {
  bgStyle = "pure",
  imgWaves = true,
  textColor,
  titleFontSize = "3.2rem",
  descFontSize = "1.4rem",
}: Banner = { ...theme.banner, ...frontmatter.tk?.banner };
const { imgSrc, bannerStyle = "full" }: BodyBgImg = theme.bodyBgImg || {};

// 纯色背景风格
const isPureBgStyle = bgStyle === "pure";
// 局部图片背景风格
const isPartImgBgStyle = bgStyle === "partImg";
// 全屏图片背景风格
const isFullImgBgStyle = bgStyle === "fullImg";
// 是否使用 bodyBgImg 配置
const isBodyImgBg = !!imgSrc;
const isBodyImgBgFull = isBodyImgBg && bannerStyle === "full";

const getStyle = () => {
  const titleTextVar = ns.cssVarName("banner-title-text");
  const descTextVar = ns.cssVarName("banner-desc-text");
  const textColorVar = ns.cssVarName("banner-text-color");

  return { [titleTextVar]: titleFontSize, [descTextVar]: descFontSize, [textColorVar]: textColor || "#ffffff" };
};

const bannerRef = ref<HTMLElement | null>(null);

/**
 * 修改导航栏样式（透明化）
 */
const toggleClass = () => {
  const vPNavDom = document.querySelector(".VPNavBar");
  // 获取窗口高度
  const windowH = unref(bannerRef)?.clientHeight;

  if (!vPNavDom || !windowH) return;

  const offset = isBodyImgBg ? 0 : 100;
  if (unref(bannerRef) && document.documentElement.scrollTop + offset < windowH) {
    vPNavDom.classList.add("full-img-nav-bar");
  } else vPNavDom.classList.remove("full-img-nav-bar");
};

onMounted(() => {
  if (isFullImgBgStyle || isBodyImgBgFull) {
    // 全屏图片模式，监听滚轮，修改导航栏样式（透明化）
    toggleClass();
    window.addEventListener("scroll", toggleClass);
  }
});

onUnmounted(() => {
  if (isFullImgBgStyle || isBodyImgBg) window.removeEventListener("scroll", toggleClass);
});
</script>

<template>
  <slot name="teeker-home-banner-before" />

  <div ref="bannerRef" :class="ns.b()" :style="getStyle()">
    <div v-if="isBodyImgBg" :class="[bannerStyle, 'body-img']">
      <div :class="{ [centerClass]: isBodyImgBgFull }">
        <HomeBannerContent />
        <HomeBannerFeature />
      </div>
    </div>

    <HomeBannerBgPure v-else-if="isPureBgStyle">
      <HomeBannerContent />
      <HomeBannerFeature />
    </HomeBannerBgPure>

    <HomeBannerBgImage v-else-if="isPartImgBgStyle || isFullImgBgStyle">
      <div :class="{ [centerClass]: isFullImgBgStyle }">
        <HomeBannerContent />
        <HomeBannerFeature />
      </div>
    </HomeBannerBgImage>
  </div>

  <HomeBannerWaves v-if="imgWaves && isFullImgBgStyle && !isBodyImgBg" />

  <slot name="teeker-home-banner-before" />
</template>
