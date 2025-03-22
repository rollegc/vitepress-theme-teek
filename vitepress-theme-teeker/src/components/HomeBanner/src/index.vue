<script setup lang="ts" name="HomeBanner">
import { withBase } from "vitepress";
import { onMounted, onUnmounted, unref, ref, nextTick } from "vue";
import { useNamespace, useTextTypes, useSwitchData } from "../../../hooks";
import { useUnrefData } from "../../../configProvider";
import { isString } from "../../../helper";
import HomeBannerWaves from "./HomeBannerWaves.vue";
import { Banner } from "../../../config/types";

defineOptions({ name: "HomeBanner" });

const ns = useNamespace("banner");

const { site, theme, frontmatter } = useUnrefData();
const title = frontmatter.tk?.name || site.title || "";

// Banner 配置项
const {
  bgStyle = "pure",
  imgSrc,
  imgInterval = 15000,
  imgShuffle = false,
  imgWaves = true,
  mask = true,
  maskBg = "rgba(0, 0, 0, 0.4)",
  pureBgColor = "#e5e5e5",
  textColor,
  titleFontSize = "3.2rem",
  descFontSize = "1.4rem",
  descStyle = "default",
  description = [],
  switchTime = 4000,
  switchShuffle = false,
  typesInTime = 200,
  typesOutTime = 100,
  typesNextTime = 800,
  typesShuffle = false,
}: Banner = { ...theme.banner, ...frontmatter.tk?.banner };
const descArray: string[] = [
  ...new Set([frontmatter.tk?.description || description || []].flat()?.filter((v: string) => !!v)),
];
const { features = [] }: Banner = { ...theme.banner, ...frontmatter.tk, ...frontmatter.tk?.banner };

// 纯色背景风格
const isPureBgStyle = bgStyle === "pure";
// 局部图片背景风格
const isPartImgBgStyle = bgStyle === "partImg";
// 全屏图片背景风格
const isFullImgBgStyle = bgStyle === "fullImg";
// 栅格背景风格
const isSquareShapeBgStyle = (isPartImgBgStyle || isFullImgBgStyle) && !imgSrc;
// 是否使用 bodyBgImg 配置
const isBodyBygImg = !!theme.bodyBgImg?.imgSrc;
// 是否使用遮罩层，仅当图片模式且非栅格模式时启用
const useMask = mask && (isPartImgBgStyle || isFullImgBgStyle) && !isSquareShapeBgStyle && !isBodyBygImg;
// 文本描述默认风格
const isDefaultDescStyle = descStyle === "default";
// 文本描述打字机风格
const isTypesDescStyle = descStyle === "types";
// 文本描述切换风格
const isSwitchDescStyle = descStyle === "switch";

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

// 栅格背景样式
const squareBg =
  "rgb(40,40,45) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)";
/**
 * 根据不同的 Banner 风格获取对应的样式
 */
const getStyle = () => {
  const titleTextVar = ns.cssVarName("banner-title-text");
  const descTextVar = ns.cssVarName("banner-desc-text");
  const textColorVar = ns.cssVarName("banner-text-color");
  const imgBgVar = ns.cssVarName("banner-img-bg");
  const maskBgColorVar = ns.cssVarName("banner-mask-bg-color");

  const baseStyle = { [titleTextVar]: titleFontSize, [descTextVar]: descFontSize };

  if (isBodyBygImg) return { ...baseStyle, [textColorVar]: textColor || "#ffffff" };

  if (isPureBgStyle) {
    return { ...baseStyle, backgroundColor: pureBgColor, [textColorVar]: textColor || "#000000" };
  }

  if (isSquareShapeBgStyle) return { ...baseStyle, [imgBgVar]: squareBg, [textColorVar]: textColor || "#ffffff" };

  // 图片风格
  if (isPartImgBgStyle || isFullImgBgStyle) {
    return {
      ...baseStyle,
      [imgBgVar]: `url(${unref(imageSrc)})`,
      [textColorVar]: textColor || "#ffffff",
      [maskBgColorVar]: isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`,
    };
  }
};

const bannerRef = ref<HTMLElement | null>(null);

/**
 * 修改导航栏样式
 */
const toggleClass = () => {
  const vPNavDom = document.querySelector(".VPNavBar");
  // 获取窗口高度
  const windowH = unref(bannerRef)?.clientHeight;

  if (!vPNavDom || !windowH) return;

  const offset = isBodyBygImg ? 0 : 100;
  if (unref(bannerRef) && document.documentElement.scrollTop + offset < windowH) {
    vPNavDom.classList.add("full-img-nav-bar");
  } else vPNavDom.classList.remove("full-img-nav-bar");
};

/**
 * 大图模式，监听滚轮，修改导航栏样式（透明化）
 */
const watchScroll = () => {
  // 第一次初始化
  toggleClass();
  window.addEventListener("scroll", toggleClass);
};

// 文字打印输入输出效果
const {
  text: typesText,
  shouldAnimate,
  startTypes,
  stopTypes,
} = useTextTypes(descArray, { typesInTime, typesOutTime, typesNextTime, shuffle: typesShuffle });

// 文字淡入淡出效果
const { data: text, startAutoSwitch: switchText } = useSwitchData({
  dataArray: descArray,
  timeout: switchTime,
  shuffle: switchShuffle,
  onUpdate: (data, newValue) => {
    // 重新渲染数据，同时触发动画
    data.value = "";
    setTimeout(() => {
      data.value = newValue;
    }, 100);
  },
});

onMounted(() => {
  if (isTypesDescStyle) startTypes();
  if (isSwitchDescStyle) switchText();
  if (isPartImgBgStyle || isFullImgBgStyle) switchImg();
  if (isFullImgBgStyle || isBodyBygImg) nextTick(() => watchScroll());
});

onUnmounted(() => {
  if (isTypesDescStyle) stopTypes();
  window.removeEventListener("scroll", toggleClass);
});
</script>

<template>
  <slot name="teeker-home-banner-before" />

  <div
    ref="bannerRef"
    :class="[
      ns.b(),
      {
        pure: isPureBgStyle,
        'full-img': isFullImgBgStyle,
        'part-img': isPartImgBgStyle,
        'default-img': isSquareShapeBgStyle,
      },
    ]"
    :style="getStyle()"
  >
    <div v-if="useMask" class="mask" />

    <div :class="[ns.e('content'), { center: isFullImgBgStyle || !features.length }]">
      <h1 :class="ns.e('content__title')">{{ title }}</h1>

      <p :class="ns.e('content__desc')">
        <template v-if="isDefaultDescStyle">{{ descArray[0] }}</template>
        <template v-else-if="isSwitchDescStyle">
          <span v-show="!!text" @click="switchText" class="switch">{{ text || " " }}</span>
        </template>
        <template v-else-if="isTypesDescStyle && descArray.length">
          <span>{{ typesText }}</span>
          <span :class="['typed', { 'is-animation': shouldAnimate }]">|</span>
        </template>
      </p>
    </div>

    <div
      v-if="features.length && !isFullImgBgStyle"
      :class="[ns.e('feature'), 'flx-wrap-between', ns.joinNamespace('wallpaper-outside')]"
    >
      <div :class="ns.e('feature__item')" v-for="(feature, index) in features" :key="index">
        <a v-if="feature.link" :href="withBase(feature.link)" class="flx-column-center">
          <img v-if="feature.imgUrl" class="feature-img" :src="withBase(feature.imgUrl)" :alt="feature.title" />
          <p class="feature-title">{{ feature.title }}</p>
          <p class="feature-description">{{ feature.description }}</p>
        </a>
      </div>
    </div>
  </div>

  <HomeBannerWaves v-if="imgWaves && isFullImgBgStyle && !isBodyBygImg" />

  <slot name="teeker-home-banner-before" />
</template>
