<script setup lang="ts" name="CodeBlockToggle">
import { nextTick, onMounted } from "vue";
import arrowSvg from "../assets/svg/arrow";
import { useRouter } from "vitepress";
import { useDesign } from "../hooks";

const { namespace } = useDesign();

const foldClass = "fold";
const circleClass = "circle";
const arrowClass = "arrow";

/**
 * 初始化代码块
 */
const initCodeBlock = () => {
  const modes = document.querySelectorAll(".vp-doc div[class*='language-']") as unknown as HTMLElement[];

  Array.from(modes).forEach(item => {
    // 如果当前代码块已经初始化了，则不需要继续执行代码
    if (item.querySelector(`.${circleClass}`) && item.querySelector(`.${arrowClass}`)) return;

    const arrowElement = createArrowElement(item);
    const circleElement = createCircleElement();

    item.append(arrowElement);
    item.append(circleElement);
  });
};

/**
 * 创建箭头元素，添加点击事件（折叠/展开）
 */
const createArrowElement = (item: HTMLElement) => {
  // 获取代码块原来的高度，进行备份
  const modeHeight = item.offsetHeight;
  // 初始化代码块高度，确保第一次折叠时就有动画
  item.style.height = `${modeHeight}px`;
  // 获取代码块的元素
  const preDom: HTMLElement | null = item.querySelector("pre");
  const lineNumbersWrapperDom: HTMLElement | null = item.querySelector(".line-numbers-wrapper");

  const div = document.createElement("div");
  div.classList.add(arrowClass);
  div.innerHTML = arrowSvg;

  const codeBlockState = {
    expand: { height: `${modeHeight}px`, display: "block", speed: 80 },
    fold: { height: `var(--${namespace}-code-block-fold-height)`, display: "none", speed: 400 },
  };

  let timeoutId: NodeJS.Timeout | null = null;

  // 箭头点击事件
  div.onclick = () => {
    const isFold = div.classList.contains(foldClass);
    // 如果是折叠状态，则需要展开
    const state = codeBlockState[isFold ? "expand" : "fold"];

    item.style.height = state.height;

    if (timeoutId) clearTimeout(timeoutId);

    if (preDom && lineNumbersWrapperDom) {
      timeoutId = setTimeout(() => {
        preDom.style.display = state.display;
        lineNumbersWrapperDom.style.display = state.display;
        if (timeoutId) clearTimeout(timeoutId);
      }, state.speed);
    }

    div.classList.toggle(foldClass);
  };

  return div;
};
/**
 * 创建三个圆圈元素
 */
const createCircleElement = () => {
  const div = document.createElement("div");
  div.classList.add(circleClass);
  return div;
};

const router = useRouter();

const initRoute = () => {
  const selfOnAfterRouteChange = router.onAfterRouteChange;
  // 路由切换后的回调
  router.onAfterRouteChange = (href: string) => {
    selfOnAfterRouteChange?.(href);
    // 路由切换后初始化代码块
    initCodeBlock();
  };
};

onMounted(() => {
  nextTick(() => {
    initCodeBlock();
    initRoute();
  });
});
</script>

<template></template>

<style lang="scss">
@use "../styles/namespace.scss" as *;

.vp-doc div[class*="language-"] {
  transition: height 0.3s;
  overflow: hidden;

  .vp-code {
    padding-top: var(--#{$theme-namespace}-code-block-fold-height);
  }

  .line-numbers-wrapper {
    margin-top: var(--#{$theme-namespace}-code-block-fold-height);
    padding-top: 0;
  }

  /* 代码块三个圆圈 */
  .circle {
    position: absolute;
    top: calc(var(--#{$theme-namespace}-code-block-fold-height) / 2);
    left: 14px;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fc625d;
    -webkit-box-shadow:
      20px 0 #fdbc40,
      40px 0 #35cd4b;
    box-shadow:
      20px 0 #fdbc40,
      40px 0 #35cd4b;
  }

  /* 代码块语言 */
  span.lang {
    position: absolute;
    z-index: 3;
    top: calc(var(--#{$theme-namespace}-code-block-fold-height) / 2);
    left: 75px;
    transform: translateY(-50%);
    font-size: 18px;
    color: var(--vp-c-text-1);
    text-transform: uppercase;
    font-weight: bold;
    width: fit-content;
  }

  /* 一键复制图标 */
  button.copy {
    width: 18px;
    height: 18px;
    position: absolute;
    top: calc(var(--#{$theme-namespace}-code-block-fold-height) / 2);
    right: 36px;
    transform: translateY(-50%);
    opacity: 1;
    background-size: 14px;
    background-color: transparent;
    border: none;
    color: var(--vp-c-text-1);
    fill: var(--vp-c-text-1);
    &:hover,
    .copied {
      background-color: transparent;
      border: none;
    }
  }

  /* 语言和一键复制图标不会消失 */
  &:hover button.copy + span.lang,
  button.copy:focus + span.lang,
  &:hover > button.copy,
  button.copy:focus {
    opacity: 1;
  }

  /* 箭头 */
  .arrow {
    cursor: pointer;
    position: absolute;
    z-index: 3;
    top: calc(var(--#{$theme-namespace}-code-block-fold-height) / 2);
    right: 14px;
    transform: translateY(-50%);
    transition: all 0.3s;

    svg {
      width: 16px;
      height: 16px;
      fill: var(--vp-c-text-1);
    }

    /* 代码块折叠后后旋转 -90 度 */
    &.fold {
      transform: rotate(90deg) translateX(-50%);
    }
  }
}
</style>
