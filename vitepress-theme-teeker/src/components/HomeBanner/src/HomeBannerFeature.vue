<script setup lang="ts" name="HomeBannerFeature">
import { withBase } from "vitepress";
import { useNamespace } from "../../../hooks";
import { useUnrefData } from "../../../configProvider";
import { Banner } from "../../../config/types";

defineOptions({ name: "HomeBannerFeature" });

const ns = useNamespace("bannerFeature");

const { theme, frontmatter } = useUnrefData();

const { features = [] }: Banner = { ...theme.banner, ...frontmatter.tk, ...frontmatter.tk?.banner };
</script>

<template>
  <div v-if="features.length" :class="[ns.b(), 'flx-wrap-between', ns.joinNamespace('wallpaper-outside')]">
    <div :class="ns.e('feature__item')" v-for="(feature, index) in features" :key="index">
      <a v-if="feature.link" :href="withBase(feature.link)" class="flx-column-center">
        <img v-if="feature.imgUrl" class="feature-img" :src="withBase(feature.imgUrl)" :alt="feature.title" />
        <p class="feature-title">{{ feature.title }}</p>
        <p class="feature-description">{{ feature.description }}</p>
      </a>
    </div>
  </div>
</template>
