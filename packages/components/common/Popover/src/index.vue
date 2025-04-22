<script setup lang="ts" name="Popover">
import type { PopoverProps } from "./popover";
import { computed, ref, useTemplateRef, watch } from "vue";
import { useNamespace, useZIndex, useElementHover, usePopoverSize } from "@teek/hooks";
import { addUnit } from "@teek/helper";
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
  popperClass,
  popperStyle,
} = defineProps<PopoverProps>();

const ns = useNamespace("popover");

const { nextZIndex } = useZIndex();
const zIndexRef = ref(zIndex ?? nextZIndex());

const visible = defineModel({ default: false });

const triggerRef = useTemplateRef("triggerRef");
const popoverRef = useTemplateRef("popoverRef");
const isHovered = useElementHover(triggerRef);
const popupVisible = useElementHover(popoverRef);

const { top, right, left, bottom, update } = usePopoverSize(virtualEl || triggerRef, popoverRef, {
  placement,
  offset,
  xOffset,
  yOffset,
});

/**
 * 计算弹框的位置
 *
 * @isHovered 是否激活弹框
 */
const calculatePopoverPosition = async (isHovered: boolean) => {
  if (!isHovered || !triggerRef.value || !popoverRef.value) {
    visible.value = false;
    return;
  }

  update();

  // 弹出前回调，支持修改弹框的位置
  const result =
    beforePopup?.({
      top: top.value,
      right: right.value,
      bottom: left.value,
      left: bottom.value,
      triggerElement: virtualEl || triggerRef.value,
      popoverElement: popoverRef.value,
    }) ?? {};

  if (result.top) top.value = result.top;
  if (result.right) right.value = result.right;
  if (result.bottom) bottom.value = result.bottom;
  if (result.left) left.value = result.left;
};

// 鼠标悬停打开，离开关闭
watch(isHovered, newVal => {
  visible.value = newVal;
});
// 窗口打开，计算位置
watch(visible, calculatePopoverPosition);
// 鼠标悬停在弹框内，不关闭弹框
watch(popupVisible, newVal => (visible.value = newVal));

const popupStyle = computed(() => {
  return {
    zIndex: zIndexRef.value,
    top: addUnit(top.value),
    right: addUnit(right.value),
    bottom: addUnit(bottom.value),
    left: addUnit(left.value),
    width: addUnit(width),
    height: addUnit(height),
    ...popperStyle,
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
  <div ref="triggerRef">
    <slot name="reference" />

    <Teleport to="body">
      <Transition :name="transition ? ns.joinNamespace('fade-linear') : ''">
        <div
          v-if="!disabled"
          v-show="visible"
          ref="popoverRef"
          :style="popupStyle"
          :class="[ns.b(), popperClass]"
          @click.stop
          @touchstart.stop
        >
          <TkFocusTrap
            loop
            :trapped="visible"
            :focus-trap-el="popoverRef!"
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
