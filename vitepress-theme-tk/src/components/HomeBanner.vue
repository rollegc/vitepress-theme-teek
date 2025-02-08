<script setup lang="ts" name="HomeBanner">
import { useDesign, useTextTypes, useTextSwitch, useSwitchImage, useSwitchData } from "../hooks";
import { withBase } from "vitepress";
import { onMounted, onUnmounted, unref, ref, nextTick } from "vue";
import { useUnrefData } from "../configProvider";
import { isArray, isNumber } from "../helper";
import HomeBannerWaves from "./HomeBannerWaves.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("banner");

const { site, theme, frontmatter } = useUnrefData();

const title = frontmatter.tk?.name || site.title || "";
const descArray = isArray(frontmatter.tk?.description)
  ? ([...new Set(frontmatter.tk?.description?.filter((v: string) => !!v))] as string[])
  : [frontmatter.tk?.description];

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
} = { ...theme.banner, ...frontmatter.tk?.banner };

const isDefaultBgStyle = bgStyle === "default";
const isBigImgBgStyle = bgStyle === "bigImg";
const isGridBgStyle = bgStyle === "grid";
const isBodyBygImg = !!theme.bodyBgImg?.imgSrc;
const isDefaultDescStyle = descStyle === "default";
const isTypesDescStyle = descStyle === "types";
const isSwitchDescStyle = descStyle === "switch";

const { data: imageSrc, startAutoSwitch: switchImg } = useSwitchData({
  dataArray: imgSrc,
  timeout: imgInterval,
  onAfterUpdate: newValue => {
    // 预加载下一张图片
    if (newValue) {
      const img = new Image();
      img.src = newValue;
    }
  },
});

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
      "--banner-mask-bg-color": isNumber(maskBg) ? `rgba(0, 0, 0, ${maskBg})` : maskBg,
    };
  }
};

const bannerRef = ref<HTMLElement | null>(null);

const watchScroll = () => {
  const vPNavDom = document.querySelector(".VPNavBar");
  // 获取窗口高度
  const windowH = unref(bannerRef)?.clientHeight;

  if (!vPNavDom || !windowH) return;
  const toggleClass = () => {
    if (unref(bannerRef) && document.documentElement.scrollTop + 100 < windowH) {
      vPNavDom.classList.add("big-img-nav-bar");
    } else vPNavDom.classList.remove("big-img-nav-bar");
  };

  toggleClass();
  window.onscroll = () => {
    toggleClass();
  };
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
  window.onscroll = null;
});
</script>

<template>
  <div
    ref="bannerRef"
    :class="[prefixClass, { default: isDefaultBgStyle, 'big-img': isBigImgBgStyle, grid: isGridBgStyle }]"
    :style="getStyle()"
  >
    <div v-if="mask && isBigImgBgStyle && !isBodyBygImg" class="mask" />

    <div :class="[`${prefixClass}-content`, { center: isBigImgBgStyle || !features.length }]">
      <h1 :class="`${prefixClass}-content__title`">{{ title }}</h1>

      <p :class="`${prefixClass}-content__desc`">
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

    <div v-if="features.length && !isBigImgBgStyle" :class="`${prefixClass}-feature flx-wrap-between`">
      <div :class="`${prefixClass}-feature__item`" v-for="(feature, index) in features" :key="index">
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

<style lang="scss" scoped>
@use "../styles/components/homeBanner.scss";
</style>

<style lang="scss">
// 大图风格时，指定顶部导航栏样式
.VPNavBar.home.big-img-nav-bar {
  background-color: transparent !important;

  .VPNavBarTitle .title,
  .VPNavBarMenuLink,
  .VPNavBarMenuGroup .text,
  .VPSocialLink {
    color: #ffffff;

    &.active,
    &:hover {
      color: var(--tk-theme-color);
    }
  }

  .divider {
    display: none;
  }

  .VPNavBarSearch .DocSearch-Button {
    background-color: transparent;

    .vp-icon,
    .DocSearch-Button-Placeholder {
      color: #ffffff;
    }

    .DocSearch-Button-Key {
      color: #ffffff;
      border: none;
      &::after {
        color: #ffffff;
      }
    }
  }
}
</style>
