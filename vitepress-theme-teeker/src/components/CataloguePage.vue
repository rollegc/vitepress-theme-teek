<script setup lang="ts" name="Catalogue">
import { computed, unref } from "vue";
import { useDesign } from "../hooks";
import CatalogueItem from "./CatalogueItem.vue";
import { useData } from "vitepress";

const { getPrefixClass, namespace } = useDesign();
const prefixClass = getPrefixClass("catalogue");

const { theme, frontmatter } = useData();

// 目录列表
const catalogues = computed(() => unref(theme).catalogues?.inv[unref(frontmatter).path]?.catalogues);
</script>

<template>
  <div :class="`${prefixClass} ${namespace}-page`">
    <div :class="`${prefixClass}__header`">
      <div :class="`${namespace}-page-title-h2`">{{ frontmatter.title }}</div>
      <div class="description">{{ frontmatter.desc || frontmatter.description }}</div>
    </div>

    <div :class="`${prefixClass}__wrapper`">
      <div class="title">{{ frontmatter.pageTitle || "目录" }}</div>
      <ul class="flx-wrap-between">
        <template v-for="(item, index) in catalogues" :key="index">
          <CatalogueItem :item :index="index + 1" />
        </template>
      </ul>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </div>
</template>
