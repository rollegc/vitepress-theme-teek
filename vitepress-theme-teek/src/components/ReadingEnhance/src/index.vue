<script setup lang="ts" name="ReadingEnhance">
import LayoutSwitch from "./LayoutSwitch.vue";
import LayoutPageWidthSlide from "./LayoutPageWidthSlide.vue";
import LayoutDocWidthSlide from "./LayoutDocWidthSlide.vue";
import Spotlight from "./Spotlight.vue";
import SpotlightStyle from "./SpotlightStyle.vue";
import { useNamespace } from "../../../hooks";
import { nextTick, provide, ref, watch } from "vue";
import { readingEnhanceNsSymbol } from "./readingEnhance";
import Icon from "../../Icon";

const ns = useNamespace("reading-enhance");

provide(readingEnhanceNsSymbol, ns);

const visible = ref(false);
const readingEnhanceRef = ref<HTMLSpanElement | null>(null);
const popupElementRef = ref<HTMLDivElement | null>(null);

const popupStyle = ref({
  top: "0px",
  left: "0px",
});

watch(visible, async () => {
  await nextTick();
  const refElement = readingEnhanceRef.value;

  if (refElement) {
    const rect = refElement.getBoundingClientRect();
    const popupWidth = popupElementRef.value?.offsetWidth || 0;
    // TODO rect 位置变化后，实时计算
    popupStyle.value = {
      top: `${rect.top + rect.height / 2 + 20}px`,
      left: `${rect.left - popupWidth + rect.width + 16}px`,
    };
  }
});
</script>

<template>
  <div
    ref="readingEnhanceRef"
    :class="ns.b()"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @click="visible = true"
  >
    <Icon icon="ep:reading" :size="18" />
    <Transition :name="ns.joinNamespace('fade-linear')">
      <div
        v-show="visible"
        ref="popupElementRef"
        :style="popupStyle"
        :class="ns.e('content')"
        @click.stop
        @touchstart.stop
      >
        <LayoutSwitch />
        <LayoutPageWidthSlide />
        <LayoutDocWidthSlide />
        <Spotlight />
        <SpotlightStyle />
      </div>
    </Transition>
  </div>
</template>
