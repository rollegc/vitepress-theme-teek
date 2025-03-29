<script setup lang="ts" name="HomeBanner">
import { computed, onMounted, onUnmounted, ref, unref } from "vue";
import { useNamespace } from "../../../hooks";
import { upperFirst } from "../../../helper";
import HomeBannerBgPure from "./HomeBannerBgPure.vue";
import HomeBannerBgImage from "./HomeBannerBgImage.vue";
import HomeBannerContent from "./HomeBannerContent.vue";
import HomeBannerFeature from "./HomeBannerFeature.vue";
import HomeBannerWaves from "./HomeBannerWaves.vue";
import { Banner, BodyBgImg } from "../../../config/types";
import { useData } from "vitepress";

defineOptions({ name: "HomeBanner" });

const ns = useNamespace("banner");

const { theme, frontmatter } = useData();

// Banner 配置项
const {
  bgStyle = "pure",
  imgWaves = true,
  textColor,
  titleFontSize = "3.2rem",
  descFontSize = "1.4rem",
}: Banner = { ...unref(theme).banner, ...unref(frontmatter).tk?.banner };
const { imgSrc, bannerStyle = "full" }: BodyBgImg = unref(theme).bodyBgImg || {};
const { features = [] }: Banner = {
  ...unref(theme).banner,
  ...unref(frontmatter).tk,
  ...unref(frontmatter).tk?.banner,
};

// 纯色背景风格
const isBannerPureBgStyle = bgStyle === "pure";
// 局部图片背景风格
const isBannerPartImgBgStyle = bgStyle === "partImg";
// 全屏图片背景风格
const isBannerFullImgBgStyle = bgStyle === "fullImg";
// 是否使用 bodyBgImg 配置
const isBodyImgBgStyle = !!imgSrc;
const isBodyPartImgBgStyle = isBodyImgBgStyle && bannerStyle === "part";
const isBodyFullImgBgStyle = isBodyImgBgStyle && bannerStyle === "full";

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

  const offset = isBodyImgBgStyle ? 0 : 100;
  if (unref(bannerRef) && document.documentElement.scrollTop + offset < windowH) {
    vPNavDom.classList.add("full-img-nav-bar");
  } else vPNavDom.classList.remove("full-img-nav-bar");
};

onMounted(() => {
  if (isBannerFullImgBgStyle || isBodyFullImgBgStyle) {
    // 全屏图片模式，监听滚轮，修改导航栏样式（透明化）
    toggleClass();
    window.addEventListener("scroll", toggleClass);
  }
});

onUnmounted(() => {
  if (isBannerFullImgBgStyle || isBodyImgBgStyle) window.removeEventListener("scroll", toggleClass);
});

const getClass = () => {
  // body 优先级高
  if (isBodyPartImgBgStyle) return ns.is("part-img");
  if (isBodyFullImgBgStyle) return ns.is("full-img");
  if (isBannerPureBgStyle) return ns.is("pure");
  if (isBannerPartImgBgStyle) return ns.is("part-img");
  if (isBannerFullImgBgStyle) return ns.is("full-img");

  return "";
};

// full 模式（全屏图片模式）需要将内容和 Feature 居中，所以需要添加 class: center
const styleComponentMap: Record<string, any> = {
  bodyPart: { el: "div", props: { class: `body-pure` } },
  bodyFull: { el: "div", props: { class: `body-full` } },
  bannerPure: { el: HomeBannerBgPure },
  bannerPartImg: { el: HomeBannerBgImage },
  bannerFullImg: { el: HomeBannerBgImage },
};

const styleComponent = computed(() => {
  const currentStyle = isBodyImgBgStyle ? `body${upperFirst(bannerStyle)}` : `banner${upperFirst(bgStyle)}`;

  return styleComponentMap[currentStyle];
});
</script>

<template>
  <slot name="teek-home-banner-before" />

  <div ref="bannerRef" :class="[ns.b(), getClass()]" :style="getStyle()">
    <component :is="styleComponent.el" v-bind="styleComponent.props">
      <div :class="[ns.e('content'), { 'no-feature': !features.length }]">
        <slot name="teek-home-banner-content-before" />
        <HomeBannerContent />
        <slot name="teek-home-banner-content-after" />

        <HomeBannerFeature />
        <slot name="teek-home-banner-feature-after" />
      </div>
    </component>

    <HomeBannerWaves v-if="imgWaves && isBannerFullImgBgStyle && !isBodyImgBgStyle" />
  </div>

  <slot name="teek-home-banner-after" />
</template>

<!-- 上面的 `<component :is="styleComponent.el" v-bind="styleComponent.props"> xxx </component>` 等于下面的代码 -->
<!-- <template>
  <div v-if="isBodyImgBgStyle" :class="`body-${bannerStyle}`">
    <div :class="[styleComponent.centerClass, { 'no-feature': !features.length }]">
      <HomeBannerContent />

      <slot name="teek-home-banner-feature-before" />
      <HomeBannerFeature />
      <slot name="teek-home-banner-feature-after" />
    </div>
  </div>

  <HomeBannerBgPure v-else-if="isBannerPureBgStyle">
    <HomeBannerContent />

    <slot name="teek-home-banner-feature-before" />
    <HomeBannerFeature />
    <slot name="teek-home-banner-feature-after" />
  </HomeBannerBgPure>

  <HomeBannerBgImage v-else-if="isBannerPartImgBgStyle || isBannerFullImgBgStyle">
    <div :class="{ [centerClass]: isBannerFullImgBgStyle, 'no-feature': !features.length }">
      <HomeBannerContent />

      <slot name="teek-home-banner-feature-before" />
      <HomeBannerFeature />
      <slot name="teek-home-banner-feature-after" />
    </div>
  </HomeBannerBgImage>
</template> -->
