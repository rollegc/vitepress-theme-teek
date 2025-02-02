<script setup lang="ts" name="ArticleImagePreview">
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("articleImagePreview");
</script>

<template>
  <div :class="prefixClass"></div>
</template>

<style lang="scss" scoped>
@use "../styles/components/articleImagePreview.scss";
</style>
