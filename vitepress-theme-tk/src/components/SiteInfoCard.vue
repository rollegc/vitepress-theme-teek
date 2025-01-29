<script setup lang="ts" name="SiteInfoCard">
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("siteInfo");
</script>

<template>
  <div :class="prefixClass"></div>
</template>

<style lang="scss" scoped>
@use "../styles/components/siteInfoCard.scss";
</style>
