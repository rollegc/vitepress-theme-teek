<script setup lang="ts" name="Catalogue">
import { useDesign } from "../hooks";
import { useThemeConfig } from "../configProvider";
import { unref } from "vue";
import { useData } from "vitepress";
import CatalogueItem from "./CatalogueItem.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("catalogue");

const themeConfig = useThemeConfig();
const { frontmatter } = useData();

const getPath = () => {
  const { path } = unref(frontmatter);

  if (!path) return "";
  if (path.startsWith("/") && path.endsWith("/")) return path;
  if (path.startsWith("/")) return `${path}/`;
  if (path.endsWith("/")) return `/${path}`;
  return `/${path}/`;
};

const catalogueList = themeConfig.sidebar[getPath()];
</script>

<template>
  <div :class="`${prefixClass} tk-page`">
    <div :class="`${prefixClass}-header`">
      <div class="tk-title-h2">{{ frontmatter.title }}</div>
      <div class="my-10">{{ frontmatter.description }}</div>
    </div>

    <div :class="`${prefixClass}-wrapper`">
      <div class="title">目录</div>
      <ul :class="`${prefixClass}-wrapper__inline`">
        <template v-for="(item, index) in catalogueList" :key="index">
          <CatalogueItem :item :index="index + 1" />
        </template>
      </ul>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/catalogue.scss";
</style>
