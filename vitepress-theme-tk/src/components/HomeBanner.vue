<script setup lang="ts" name="HomeBanner">
import { useDesign } from "../hooks";
import { withBase } from "vitepress";
import { onMounted, onUnmounted, unref, ref, nextTick } from "vue";
import { useTypes } from "../hooks";
import { useUnrefData } from "../configProvider";
import { isNumber } from "../helper";
import HomeBannerWaves from "./HomeBannerWaves.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("banner");

const { site, theme, frontmatter } = useUnrefData();

const title = frontmatter.name || site.title || "";
const descArray = [...new Set(frontmatter.tk?.description?.filter((v: string) => !!v))] as string[];
const {
  bgStyle = "default",
  bigImgSrc,
  maskBg = "rgba(0,0,0,0.4)",
  defaultBgColor = "#e5e5e5",
  defaultTextColor = "#000000",
  features = [],
  typesInTime = 200,
  typesOutTime = 100,
  typesNextTime = 800,
  titleFontSize = "3.2rem",
  descFontSize = "1.4rem",
} = { ...theme.banner, ...frontmatter.tk };

const isDefaultStyle = bgStyle === "default";
const isBigImgStyle = bgStyle === "bigImg";
const isGridStyle = bgStyle === "grid";

const getStyle = () => {
  let baseStyle = { "--banner-title-text": titleFontSize, "--banner-desc-text": descFontSize };

  if (isDefaultStyle) return { ...baseStyle, backgroundColor: defaultBgColor, "--banner-text-color": defaultTextColor };
  if (isGridStyle) {
    return {
      ...baseStyle,
      background:
        "rgb(40,40,45) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)",
      "--banner-text-color": "#ffffff",
    };
  }
  if (isBigImgStyle) {
    return {
      ...baseStyle,
      backgroundImage: bigImgSrc ? `url(${bigImgSrc})` : "",
      "--banner-text-color": "#ffffff",
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

// 打字效果
const { text, shouldAnimate, startTypes, stopTypes } = useTypes(descArray, {
  typesInTime,
  typesOutTime,
  typesNextTime,
});

onMounted(() => {
  startTypes();
  if (isBigImgStyle) nextTick(() => watchScroll());
});

onUnmounted(() => {
  stopTypes();
  window.onscroll = null;
});
</script>

<template>
  <div
    ref="bannerRef"
    :class="[prefixClass, { default: isDefaultStyle, 'big-img': isBigImgStyle, grid: isGridStyle }]"
    :style="getStyle()"
  >
    <div v-if="isBigImgStyle" class="mask" />

    <div :class="[`${prefixClass}-content`, { center: isBigImgStyle || !features.length }]">
      <h1 :class="`${prefixClass}-content__title`">{{ title }}</h1>
      <p v-if="descArray.length" :class="`${prefixClass}-content__desc`">
        <span>{{ text }}</span>
        <span :class="['typed', { 'is-animation': shouldAnimate }]">|</span>
      </p>
    </div>

    <div v-if="features.length && !isBigImgStyle" :class="`${prefixClass}-feature flx-wrap-between`">
      <div :class="`${prefixClass}-feature__item`" v-for="(feature, index) in features" :key="index">
        <a v-if="feature.link" :href="feature.link" class="flx-column-center">
          <img v-if="feature.imgUrl" class="feature-img" :src="withBase(feature.imgUrl)" :alt="feature.title" />
          <p class="feature-title">{{ feature.title }}</p>
          <p class="feature-description">{{ feature.description }}</p>
        </a>
      </div>
    </div>
  </div>
  <HomeBannerWaves v-if="isBigImgStyle" />
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
