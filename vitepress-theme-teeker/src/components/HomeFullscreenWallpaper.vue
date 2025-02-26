<script setup lang="ts" name="FullScreenChange">
import { onMounted, onUnmounted, ref, unref } from "vue";
import { useNamespace } from "../hooks";
import { useUnrefData } from "../configProvider";

const ns = useNamespace("fullscreen");

// 定义一个 ref 来跟踪是否处于全屏状态
const isFullscreen = ref(false);

const { theme } = useUnrefData();
const { hideBanner = false, hideWaves = false, hideMask = false } = { ...theme.wallpaper };

/**
 * 监听键盘事件
 */
const handleKeyDown = (event: KeyboardEvent) => {
  // 全屏模式禁止打开 F12 开发者工具
  if (event.key === "F12" && unref(isFullscreen)) return event.preventDefault();

  // 全屏模式禁止使用 Ctrl + Shift + I 打开开发者工具
  if (event.key === "I" && event.ctrlKey && event.shiftKey && unref(isFullscreen)) return event.preventDefault();

  if (event.key === "F11") {
    // 阻止浏览器全屏默
    event.preventDefault();

    // 手动进入全屏模式
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).mozRequestFullScreen) {
      // Firefox
      (document.documentElement as any).mozRequestFullScreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) {
      // Chrome, Safari, Opera
      (document.documentElement as any).webkitRequestFullscreen();
    } else if ((document.documentElement as any).msRequestFullscreen) {
      // IE/Edge
      (document.documentElement as any).msRequestFullscreen();
    }
  }
};

/**
 * 监听全屏变化事件
 */
const handleFullscreenChange = () => {
  const htmlDom = document.documentElement;
  // 如果滚动条不为 0，则不执行任何操作
  if (htmlDom.scrollTop !== 0) return;

  const bannerContentDom = document.querySelector(`.${ns.joinNamespace("banner-content")}`);
  const wavesDom = document.querySelector(`.${ns.joinNamespace("waves")}`);
  const bodyBgImageMaskDom = document.querySelector(`.${ns.joinNamespace("bodyBgImage")} .mask`);
  const bannerMaskDom = document.querySelector(`.${ns.joinNamespace("banner")} .mask`);

  isFullscreen.value = !!document.fullscreenElement;

  const options = [
    { el: htmlDom, executeClass: ns.b() },
    {
      el: bannerContentDom,
      executeClass: "display-none",
      notExecuteClass: "big-img", // 如果不隐藏 banner，则给 banner 添加 big-img 大图样式，目的让文字居中
      execute: hideBanner,
    },
    { el: wavesDom, executeClass: "display-none", execute: hideWaves },
    { el: bodyBgImageMaskDom, executeClass: "display-none", execute: hideMask },
    { el: bannerMaskDom, executeClass: "display-none", execute: hideMask },
  ];

  addOrRemoveClass(!!document.fullscreenElement, options);

  // 下面注释的代码已在上面用 addOrRemoveClass 实现，否则在 if 里每次 add 一个元素，都需要在 else 里 remove 该元素，一旦多起来则不够阅读性较差，因此通过上面配置项实现
  // if (document.fullscreenElement) {
  //   htmlDom.classList.add(ns.b());
  //   if (wallpaper.hideBanner) bannerDom?.classList.add("display-none");
  //   else bannerDom?.classList.add("big-img");
  // }
  // else {
  //   htmlDom.classList.remove(ns.b());
  //   if (wallpaper.hideBanner) bannerDom?.classList.remove("display-none");
  //   else bannerDom?.classList.remove("big-img");
  // }
};

const addOrRemoveClass = (
  add: boolean,
  options: { el: Element | null; executeClass?: string; notExecuteClass?: string; execute?: boolean }[]
) => {
  // 进入全屏
  if (add) {
    options.forEach(item => {
      if (item.execute !== false) item.executeClass && item.el?.classList.add(item.executeClass);
      else item.notExecuteClass && item.el?.classList.add(item.notExecuteClass);
    });
    return;
  }

  // 退出全屏
  options.forEach(item => {
    if (item.execute !== false) item.executeClass && item.el?.classList.remove(item.executeClass);
    else item.notExecuteClass && item.el?.classList.remove(item.notExecuteClass);
  });
};

/**
 * 监听右键菜单事件
 */
const handleContextMenu = (event: MouseEvent) => {
  // 全屏模式禁用右键菜单
  if (unref(isFullscreen)) event.preventDefault();
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("contextmenu", handleContextMenu);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("contextmenu", handleContextMenu);
});
</script>

<template>
  <div :class="ns.b()"></div>
</template>
