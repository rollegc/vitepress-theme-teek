<script setup lang="ts" name="ReadingEnhance">
import LayoutSwitch from "./LayoutSwitch.vue";
import LayoutPageWidthSlide from "./LayoutPageWidthSlide.vue";
import LayoutDocWidthSlide from "./LayoutDocWidthSlide.vue";
import Spotlight from "./Spotlight.vue";
import SpotlightStyle from "./SpotlightStyle.vue";
import { useNamespace, useElementHover } from "../../../hooks";
import { provide, ref, watch, useTemplateRef, nextTick } from "vue";
import { readingEnhanceNsSymbol } from "./readingEnhance";
import { readingIcon } from "../../../assets/icons";
import Icon from "../../Icon";

const ns = useNamespace("reading-enhance");

provide(readingEnhanceNsSymbol, ns);

const readingEnhanceRef = useTemplateRef<HTMLDivElement>("readingEnhanceRef");
const popupElementRef = useTemplateRef<HTMLDivElement>("popupElementRef");

const visible = useElementHover(readingEnhanceRef);

const popupStyle = ref({ top: "0px", left: "0px" });

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
  <div ref="readingEnhanceRef" :class="ns.b()" @click="visible = true">
    <Icon :icon="readingIcon" :size="20" />
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
