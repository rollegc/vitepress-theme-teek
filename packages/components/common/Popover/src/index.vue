<script setup lang="ts" name="Popover">
import type { PopoverProps } from "./popover";
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
import { useNamespace, useZIndex, useElementHover, useWindowSize } from "@teek/hooks";
import { addUnit, removeUnit } from "@teek/helper";
import { TkFocusTrap } from "@teek/components/common/FocusTrap";

defineOptions({ name: "Popover" });

const {
  placement = "bottom",
  content = "",
  width,
  height,
  offset = 0,
  xOffset = 0,
  yOffset = 0,
  disabled = false,
  transition = true,
  virtualEl,
  beforePopup,
  zIndex,
} = defineProps<PopoverProps>();

const ns = useNamespace("popover");

const { nextZIndex } = useZIndex();
const zIndexRef = ref(zIndex ?? nextZIndex());

const visible = defineModel({ default: false });

const popoverRef = useTemplateRef("popoverRef");
const popupElementRef = useTemplateRef("popupElementRef");
const isHovered = useElementHover(popoverRef);
const popupVisible = useElementHover(popupElementRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();

const AUTO = "auto";

const top = ref<number | string>(AUTO);
const right = ref<number | string>(AUTO);
const bottom = ref<number | string>(AUTO);
const left = ref<number | string>(AUTO);

/**
 * 计算弹框的位置
 *
 * @isHovered 是否激活弹框
 */
const calculatePopupPosition = async (isHovered: boolean) => {
  if (!isHovered || !popoverRef.value || !popupElementRef.value) {
    visible.value = false;
    return;
  }
  await nextTick();

  const popoverElement = (virtualEl as any)?.$el || virtualEl || popoverRef.value;
  const {
    top: popoverTop,
    right: popoverLeftWidth,
    bottom: popoverTopHeight,
    left: popoverLeft,
    width: popoverWidth,
    height: popoverHeight,
  } = popoverElement.getBoundingClientRect();

  // 计算实际的 right 和 bottom（popoverLeftWidth 为元素右边框距离视口左侧的距离，等于 left + width，popoverTopHeight 同理，等于 top + height）
  const popoverRight = windowWidth.value - popoverLeftWidth;
  const popoverBottom = windowHeight.value - popoverTopHeight;

  const popupElement = popupElementRef.value;
  const pw = removeUnit(width) ?? popupElement.offsetWidth;
  const ph = removeUnit(height) ?? popupElement.offsetHeight;

  const baseX = window.scrollX + (offset || xOffset);
  const baseY = window.scrollY + (offset || yOffset);

  let popupTop: number | string = AUTO;
  let popupRight: number | string = AUTO;
  let popupBottom: number | string = AUTO;
  let popupLeft: number | string = AUTO;

  if (["top", "bottom"].some(item => placement.startsWith(item))) {
    // 计算左右位置（top 和 bottom 通用）

    // start 代表等于 popover 元素的 left
    if (placement.endsWith("start")) popupLeft = Math.max(0, popoverLeft + baseX);
    // end 代表等于 popover 元素的 right
    else if (placement.endsWith("end")) popupRight = Math.max(0, popoverRight + baseX);
    // 否则居中
    else popupLeft = Math.max(0, popoverLeft + popoverWidth / 2 - pw / 2 + baseX);

    // 弹框超出右边界，则移到左边，且右侧永远贴着右边界
    if (popupLeft && popupLeft + pw > windowWidth.value) {
      popupLeft = AUTO;
      popupRight = 0;
    }

    // 弹框超出左边界，则移到右边，且左侧永远贴着左边界
    if (popupRight && popupRight + pw > windowWidth.value) {
      popupRight = AUTO;
      popupLeft = 0;
    }
  } else if (["left", "right"].some(item => placement.startsWith(item))) {
    // 计算上下位置（left 和 right 通用）

    // start 代表等于 popover 元素的 top
    if (placement.endsWith("start")) popupTop = Math.max(0, popoverTop + baseY);
    // end 代表等于 popover 元素的 bottom
    else if (placement.endsWith("end")) popupBottom = Math.max(0, popoverBottom + baseY);
    // 否则居中
    else popupTop = Math.max(0, popoverTop + popoverHeight / 2 - ph / 2 + baseY);

    if (popupTop && popupTop + ph > windowHeight.value) {
      // 弹框超出下边界，则移到上边界，且下侧永远贴着下边界
      popupTop = AUTO;
      popupBottom = 0;
    }

    if (popupBottom && popupBottom + ph > windowHeight.value) {
      // 弹框超出上边界，则移到下边界，且上侧永远贴着上边界
      popupBottom = AUTO;
      popupTop = 0;
    }
  }

  // 计算非通用的位置
  if (placement.startsWith("bottom")) popupTop = popoverTop + popoverHeight + baseY;
  else if (placement.startsWith("top")) popupBottom += popoverBottom + popoverHeight + baseY;
  else if (placement.startsWith("left")) popupRight = popoverRight + popoverWidth + baseX;
  else if (placement.startsWith("right")) popupLeft = popoverLeft + popoverWidth + baseX;

  // 弹框超出下边界，则移动到上边界
  if (popupTop + ph > windowHeight.value + baseY) {
    popupTop = AUTO;
    popupBottom = popoverHeight;
  }
  // 弹框超出上边界，则移动到下边界
  if (popupBottom + ph > windowHeight.value + baseY) {
    popupBottom = AUTO;
    popupTop = popoverHeight;
  }
  if (popupRight + pw > windowWidth.value + baseX) {
    // 弹框超出右边界，则移动到左边界
    popupRight = AUTO;
    popupLeft = popoverWidth;
  }
  if (popupLeft + pw > windowWidth.value + baseX) {
    // 弹框超出右边界，则移动到左边界
    popupLeft = AUTO;
    popupRight = popoverWidth;
  }

  // 弹出前回调，支持修改弹框的位置
  const result =
    beforePopup?.({
      top: popupTop,
      right: popupRight,
      bottom: popupBottom,
      left: popupLeft,
      popoverElement: popoverElement,
      popupElement: popupElement,
    }) ?? {};

  top.value = result.top ?? popupTop;
  right.value = result.right ?? popupRight;
  bottom.value = result.bottom ?? popupBottom;
  left.value = result.left ?? popupLeft;
};

// 鼠标悬停打开，离开关闭
watch(isHovered, newVal => {
  visible.value = newVal;
});
// 窗口打开，计算位置
watch(visible, calculatePopupPosition);
// 鼠标悬停在弹框内，不关闭弹框
watch(popupVisible, newVal => (visible.value = newVal));

const popupStyle = computed(() => {
  return {
    zIndex: zIndexRef.value,
    top: top.value === AUTO ? AUTO : `${top.value}px`,
    right: right.value === AUTO ? AUTO : `${right.value}px`,
    bottom: bottom.value === AUTO ? AUTO : `${bottom.value}px`,
    left: left.value === AUTO ? AUTO : `${left.value}px`,
    width: addUnit(width),
    height: addUnit(height),
  };
});

const emit = defineEmits<{ focus: []; blur: []; close: [] }>();
const focusStartRef = ref<"container" | "first" | HTMLElement>();

// 进入焦点陷阱（打开弹框）
const onFocusAfterTrapped = () => {
  emit("focus");
};
// 离开焦点陷阱
const onFocusAfterReleased = (event: CustomEvent) => {
  if (event.detail?.focusReason !== "pointer") {
    focusStartRef.value = "first";
    emit("blur");
  }
};
// focusin 事件
const onFocusInTrap = (event: FocusEvent) => {
  if (visible.value && event.target) {
    focusStartRef.value = event.target as typeof focusStartRef.value;
  }
};
// 阻止离开
const onFocusoutPrevented = (event: CustomEvent) => {
  if (event.detail.focusReason === "pointer") {
    event.preventDefault();
  }
};
// Escape 按键释放焦点
const onReleaseRequested = () => {
  emit("close");
};
</script>

<template>
  <div ref="popoverRef" :class="ns.b()">
    <slot name="reference"></slot>

    <Teleport to="body">
      <Transition :name="transition ? ns.joinNamespace('fade-linear') : ''">
        <div
          v-if="!disabled"
          v-show="visible"
          ref="popupElementRef"
          :style="popupStyle"
          :class="ns.e('content')"
          @click.stop
          @touchstart.stop
        >
          <TkFocusTrap
            loop
            :trapped="visible"
            :focus-trap-el="popupElementRef"
            :focus-start-el="focusStartRef"
            @focus-after-trapped="onFocusAfterTrapped"
            @focus-after-released="onFocusAfterReleased"
            @focusin="onFocusInTrap"
            @focusout-prevented="onFocusoutPrevented"
            @release-requested="onReleaseRequested"
          >
            <slot>{{ content }}</slot>
          </TkFocusTrap>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
