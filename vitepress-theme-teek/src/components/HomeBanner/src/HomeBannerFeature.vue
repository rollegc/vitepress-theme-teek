<script setup lang="ts" name="HomeBannerFeature">
import { useData, withBase } from "vitepress";
import { ref, unref } from "vue";
import { useNamespace, useWindowSize } from "../../../hooks";
import type { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerFeature" });

const ns = useNamespace("bannerFeature");

const { theme, frontmatter } = useData();

const { features = [], featureCarousel = 4000 }: Banner = {
  ...unref(theme).banner,
  ...unref(frontmatter).tk,
  ...unref(frontmatter).tk?.banner,
};

const active = ref(0);
const isMobile = ref(false);
let intervalId: NodeJS.Timeout;

useWindowSize(width => {
  if (width <= 719) {
    isMobile.value = true;
    if (intervalId) clearTimeout(intervalId);
    // 移动端的 Feature 采用轮播模式
    intervalId = setInterval(() => {
      active.value = (active.value + 1) % features.length;
    }, featureCarousel);
  } else {
    isMobile.value = false;
    if (intervalId) clearTimeout(intervalId);
  }
});
</script>

<template>
  <TransitionGroup
    v-if="features.length"
    name="slide-next"
    tag="div"
    :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-wrap-between']"
  >
    <div
      :class="ns.e('feature__item')"
      v-for="(feature, index) in features"
      :key="index"
      v-show="!isMobile || active === index"
    >
      <a v-if="feature.link" :href="withBase(feature.link)" class="flx-column-center hover-color">
        <img v-if="feature.imgUrl" class="feature-img" :src="withBase(feature.imgUrl)" :alt="feature.title" />
        <p class="feature-title">{{ feature.title }}</p>
        <p class="feature-description">{{ feature.description }}</p>
      </a>
    </div>
  </TransitionGroup>
</template>
