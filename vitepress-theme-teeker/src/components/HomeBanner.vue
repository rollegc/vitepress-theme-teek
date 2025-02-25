<script setup lang="ts" name="HomeBanner">
import { useNamespace, useTextTypes, useSwitchData } from "../hooks";
import { withBase } from "vitepress";
import { onMounted, onUnmounted, unref, ref, nextTick } from "vue";
import { useUnrefData } from "../configProvider";
import { isString } from "../helper";
import HomeBannerWaves from "./HomeBannerWaves.vue";
import { Banner } from "../config/types";

const ns = useNamespace("banner");

const { site, theme, frontmatter } = useUnrefData();

const title = frontmatter.tk?.name || site.title || "";
const descArray = [...new Set([frontmatter.tk?.description || []].flat()?.filter((v: string) => !!v))] as string[];

// Banner 配置项
const {
  bgStyle = "default",
  imgSrc,
  imgInterval = 15000,
  mask = true,
  maskBg = "rgba(0, 0, 0, 0.4)",
  defaultBgColor = "#e5e5e5",
  textColor,
  features = [],
  typesInTime = 200,
  typesOutTime = 100,
  typesNextTime = 800,
  switchTime = 4000,
  titleFontSize = "3.2rem",
  descFontSize = "1.4rem",
  descStyle = "default",
}: Banner = { ...theme.banner, ...frontmatter.tk?.banner };

const isDefaultBgStyle = bgStyle === "default";
const isBigImgBgStyle = bgStyle === "bigImg";
const isGridBgStyle = bgStyle === "grid";
const isBodyBygImg = !!theme.bodyBgImg?.imgSrc;
const isDefaultDescStyle = descStyle === "default";
const isTypesDescStyle = descStyle === "types";
const isSwitchDescStyle = descStyle === "switch";

// banner 背景图片定时轮播
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

/**
 * 根据不同的 Banner 风格获取对应的样式
 */
const getStyle = () => {
  let baseStyle = { "--banner-title-text": titleFontSize, "--banner-desc-text": descFontSize };

  if (isBodyBygImg) return { ...baseStyle, "--banner-text-color": textColor || "#ffffff" };

  if (isDefaultBgStyle) {
    return { ...baseStyle, backgroundColor: defaultBgColor, "--banner-text-color": textColor || "#000000" };
  }

  if (isGridBgStyle) {
    return {
      ...baseStyle,
      background:
        "rgb(40, 40, 45) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)",
      "--banner-text-color": textColor || "#ffffff",
    };
  }

  if (isBigImgBgStyle) {
    return {
      ...baseStyle,
      backgroundImage: `url(${unref(imageSrc)})`,
      "--banner-text-color": textColor || "#ffffff",
      "--banner-mask-bg-color": isString(maskBg) ? maskBg : `rgba(0, 0, 0, ${maskBg})`,
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

  if (unref(bannerRef) && document.documentElement.scrollTop + 100 < windowH) {
    vPNavDom.classList.add("big-img-nav-bar");
  } else vPNavDom.classList.remove("big-img-nav-bar");
};

/**
 * 大图模式，监听滚轮，修改导航栏样式
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
} = useTextTypes(descArray, { typesInTime, typesOutTime, typesNextTime });

// 文字淡入淡出效果
const { data: text, startAutoSwitch: switchText } = useSwitchData({
  dataArray: descArray,
  timeout: switchTime,
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
  if (isBigImgBgStyle) switchImg();
  if (isBigImgBgStyle || isBodyBygImg) nextTick(() => watchScroll());
});

onUnmounted(() => {
  if (isTypesDescStyle) stopTypes();
  window.removeEventListener("scroll", toggleClass);
});
</script>

<template>
  <div
    ref="bannerRef"
    :class="[ns.b(), { default: isDefaultBgStyle, 'big-img': isBigImgBgStyle, grid: isGridBgStyle }]"
    :style="getStyle()"
  >
    <div v-if="mask && isBigImgBgStyle && !isBodyBygImg" class="mask" />

    <div :class="[ns.e('content'), { center: isBigImgBgStyle || !features.length }]">
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

    <div v-if="features.length && !isBigImgBgStyle" :class="`${ns.e('feature')} flx-wrap-between`">
      <div :class="ns.e('feature__item')" v-for="(feature, index) in features" :key="index">
        <a v-if="feature.link" :href="feature.link" class="flx-column-center">
          <img v-if="feature.imgUrl" class="feature-img" :src="withBase(feature.imgUrl)" :alt="feature.title" />
          <p class="feature-title">{{ feature.title }}</p>
          <p class="feature-description">{{ feature.description }}</p>
        </a>
      </div>
    </div>
  </div>

  <HomeBannerWaves v-if="isBigImgBgStyle && !isBodyBygImg" />
</template>
