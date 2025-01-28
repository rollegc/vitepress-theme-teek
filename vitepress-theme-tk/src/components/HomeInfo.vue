<script setup lang="ts" name="HomeInfo">
import { useDesign } from "../hooks";
import HomeMyCard from "./HomeMyCard.vue";
import HomeCategoryCard from "./HomeCategoryCard.vue";
import HomeTagCard from "./HomeTagCard.vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("info");
</script>

<template>
  <div :class="prefixClass">
    <HomeMyCard />

    <HomeCategoryCard />

    <HomeTagCard />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeInfo.scss";
</style>
