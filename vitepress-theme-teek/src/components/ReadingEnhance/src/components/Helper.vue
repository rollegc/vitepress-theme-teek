<script setup lang="ts" name="Helper">
import { inject, ref, unref, watch, nextTick } from "vue";
import { useNamespace } from "../../../../hooks";
import { readingEnhanceNsSymbol } from "../readingEnhance";
import Icon from "../../../Icon";

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const props = defineProps<{ virtualRef?: HTMLDivElement; offset?: number }>();

const visible = defineModel({ type: Boolean, default: false });
const helpElementRef = ref<HTMLSpanElement | null>(null);
const popupElementRef = ref<HTMLDivElement | null>(null);

const helpPopupStyle = ref({
  top: "0px",
  left: "0px",
});

watch(visible, async () => {
  await nextTick();
  const { virtualRef, offset = 12 } = props;
  const refElement = virtualRef || unref(helpElementRef);

  if (refElement) {
    const rect = refElement.getBoundingClientRect();
    const popupWidth = unref(popupElementRef)?.offsetWidth || 0;
    helpPopupStyle.value = {
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + window.scrollX - popupWidth - offset}px`,
    };
  }
});
</script>

<template>
  <span ref="helpElementRef" :class="ns.e('helper')" @mouseenter="visible = true" @mouseleave="visible = false">
    <Icon icon="ep:question-filled" :size="16" />
    <Teleport to="body">
      <Transition name="fade">
        <div v-show="visible" ref="popupElementRef" :style="helpPopupStyle" :class="ns.e('helper__popup')">
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
