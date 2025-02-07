<script setup lang="ts" name="BodyBgImage">
import { useDesign, useSwitchData } from "../hooks";
import { useUnrefData } from "../configProvider";
import { onMounted } from "vue";
import { isNumber } from "../helper";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("bodyBgImage");

let {
  imgSrc,
  imgOpacity = 1,
  imgInterval = 15000,
  mask = false,
  maskBg = "rgba(0, 0, 0, 0.2)",
} = useUnrefData().theme.bodyBgImg || {};

const { data: imageSrc, switchData: switchImg } = useSwitchData({
  dataArray: imgSrc,
  timeout: imgInterval,
  onAfterUpdate: newValue => {
    // 预加载下一张图片
    if (newValue) {
      const img = new Image();
      img.src = newValue;
    }
  },
});

onMounted(() => {
  switchImg();
});
</script>

<template>
  <div
    :class="prefixClass"
    :style="`background-image: url(${imageSrc}); opacity:${imgOpacity}; --body-mask-bg-color: ${isNumber(maskBg) ? `rgba(0, 0, 0, ${maskBg})` : maskBg}`"
  >
    <div v-if="mask" class="mask" />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/bodyBgImage.scss";
</style>

<style lang="scss">
.VPContent:not(.is-home) {
  background-color: var(--tk-bg-color1);
}
</style>
