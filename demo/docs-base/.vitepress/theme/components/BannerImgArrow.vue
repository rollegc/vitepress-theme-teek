<script setup lang="ts" name="BannerImgArrow">
import { TkIcon } from "vitepress-theme-teek";
import arrowSvg from "../svg/arrow";

const handleClickArrow = () => {
  // 获取窗口高度
  const windowH = document.getElementsByClassName("tk-banner")[0].clientHeight;
  window.scrollTo({
    top: windowH,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="banner-arrow tk-wallpaper-outside">
    <TkIcon :icon="arrowSvg" size="50px" color="#ffffff" class="banner-arrow__icon" @click="handleClickArrow" />
  </div>
</template>

<style lang="scss">
.no-feature {
  .banner-arrow {
    bottom: -190%;
  }
}
.banner-arrow {
  text-align: center;
  position: fixed;
  bottom: -15%;
  left: 50%;
  transform: translateX(-50%);

  &__icon {
    cursor: pointer;
    animation: bounce-in 3s 2s infinite;
  }
}

@keyframes bounce-in {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
