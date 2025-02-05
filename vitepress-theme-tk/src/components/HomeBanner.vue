<script setup lang="ts" name="HomeBanner">
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { onMounted, onUnmounted, unref } from "vue";
import { useTypes } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("banner");

const { site, frontmatter } = useData();

const title = unref(frontmatter).name || unref(site).title || "";
const descArray = [...new Set(unref(frontmatter).tk?.description?.filter((v: string) => !!v))] as string[];

const { text, shouldAnimate, startTypes, stopTypes } = useTypes(descArray, {
  typesInTime: unref(frontmatter).tk?.typesInTime,
  typesOutTime: unref(frontmatter).tk?.typesOutTime,
  typesNextTime: unref(frontmatter).tk?.typesNextTime,
});

const bannerRef = ref<HTMLElement | null>(null);

const watchScroll = () => {
  const vPNavDom = document.querySelector(".VPNavBar");
  // 获取窗口高度
  const windowH = unref(bannerRef)?.clientHeight;
  if (!vPNavDom || !windowH) return;
  const toggleClass = () => {
    if (document.documentElement.scrollTop < windowH) vPNavDom.classList.add("big-img-nav-bar");
    else vPNavDom.classList.remove("big-img-nav-bar");
  };

  toggleClass();

  window.onscroll = () => {
    toggleClass();
  };
};

onMounted(() => {
  startTypes();
});

onUnmounted(() => {
  stopTypes();
});
</script>

<template>
  <div ref="bannerRef" :class="`${prefixClass} big-img`" :style="{ backgroundImage: bigImg ? `url(${bigImg})` : '' }">
    <div class="mask" />

    <div :class="`${prefixClass}-content`">
      <h1 :class="`${prefixClass}-content__title`">{{ title }}</h1>
      <p v-if="descArray.length" :class="`${prefixClass}-content__desc`">
        <span>{{ text }}</span>
        <span :class="['typed', { 'is-animation': shouldAnimate }]">|</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeBanner.scss";
</style>

<style lang="scss">
.VPNavBar.home.big-img-nav-bar {
  background-color: transparent !important;

  .VPNavBarTitle .title,
  .VPNavBarMenuLink,
  .VPNavBarMenuGroup .text {
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
