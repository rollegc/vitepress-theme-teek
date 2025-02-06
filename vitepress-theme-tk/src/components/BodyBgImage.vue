<script setup lang="ts" name="BodyBgImage">
import { useDesign, useSwitchImage } from "../hooks";
import { useUnrefData } from "../configProvider";
import { onMounted } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("bodyBgImage");

let { imgSrc, imgOpacity = 1, imgInterval = 15000 } = useUnrefData().theme.bodyBgImg || {};

const { imageSrc, startSwitch } = useSwitchImage(imgSrc, imgInterval);

onMounted(() => {
  startSwitch();
});
</script>

<template>
  <div :class="prefixClass" :style="`background-image: url(${imageSrc}); opacity:${imgOpacity}`" />
</template>

<style lang="scss" scoped>
@use "../styles/components/bodyBgImage.scss";
</style>

<style lang="scss">
.VPContent:not(.is-home) {
  background-color: var(--tk-bg-color1);
}
</style>
