<script setup lang="ts" name="CodeBlockToggle">
import { nextTick, onMounted } from "vue";
import arrowSvg from "../assets/svg/arrow";
import { useRouter } from "vitepress";
import { useNamespace } from "../hooks";

const ns = useNamespace("");

const foldClass = "fold";
const arrowClass = "arrow";

/**
 * 初始化代码块
 */
const initCodeBlock = () => {
  const modes = document.querySelectorAll(".vp-doc div[class*='language-']") as unknown as HTMLElement[];

  Array.from(modes).forEach(item => {
    // 如果当前代码块已经初始化了，则不需要继续执行代码
    if (item.querySelector(`.${arrowClass}`)) return;

    const arrowElement = createArrowElement(item);

    item.append(arrowElement);
  });
};

/**
 * 创建箭头元素，添加点击事件（折叠/展开）
 */
const createArrowElement = (item: HTMLElement) => {
  // 获取代码块原来的高度
  const modeHeight = getElementHeight(item);
  // 初始化代码块高度，确保第一次折叠时就有动画
  item.style.height = `${modeHeight}px`;
  // 获取代码块的元素
  const preDom: HTMLElement | null = item.querySelector("pre");
  const lineNumbersWrapperDom: HTMLElement | null = item.querySelector(".line-numbers-wrapper");

  const div = document.createElement("div");
  div.classList.add(arrowClass);
  // 箭头图标
  div.innerHTML = arrowSvg;

  const codeBlockState = {
    expand: { height: `${modeHeight}px`, display: "block", speed: 80 },
    fold: { height: ns.cssVar("code-block-fold-height"), display: "none", speed: 400 },
  };

  let timeoutId: NodeJS.Timeout | null = null;

  // 箭头点击事件
  div.onclick = () => {
    const isFold = div.classList.contains(foldClass);
    // 如果是折叠状态，则需要展开
    const state = codeBlockState[isFold ? "expand" : "fold"];

    item.style.height = state.height;

    if (timeoutId) clearTimeout(timeoutId);

    if (preDom || lineNumbersWrapperDom) {
      timeoutId = setTimeout(() => {
        if (preDom) preDom.style.display = state.display;
        if (lineNumbersWrapperDom) lineNumbersWrapperDom.style.display = state.display;
        if (timeoutId) clearTimeout(timeoutId);
      }, state.speed);
    }

    div.classList.toggle(foldClass);
  };

  return div;
};

/**
 * 获取元素的高度
 */
const getElementHeight = (item: HTMLElement) => {
  const parentElementClass = item.parentElement?.className || "";
  // blocks 代表是代码组
  if (!parentElementClass.includes("blocks")) return item.offsetHeight;
  if (parentElementClass.includes("blocks") && item.className.includes("active")) return item.offsetHeight;

  // 如果元素 display none ，则 display block 后获取高度再 display none
  item.style.display = "block";
  const height = item.offsetHeight;
  item.style.display = "";
  return height;
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
