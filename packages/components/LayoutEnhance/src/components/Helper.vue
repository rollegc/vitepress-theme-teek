<script setup lang="ts" name="Helper">
import { nextTick, ref, watch } from "vue";
import { useElementHover } from "@teek/hooks";
import { questionFilledIcon } from "@teek/static";
import { TkIcon } from "@teek/components/Icon";
import { ns } from "../namespace";

defineOptions({ name: "Helper" });

const props = defineProps<{ virtualRef?: HTMLDivElement; offset?: number }>();

const visible = defineModel({ type: Boolean, default: false });
const helpElementRef = ref<HTMLSpanElement | null>(null);
const popupElementRef = ref<HTMLDivElement | null>(null);

const isHovered = useElementHover(helpElementRef);

watch(isHovered, () => {
  visible.value = isHovered.value;
});

const popupStyle = ref({ top: "0px", left: "0px" });

watch(visible, async () => {
  await nextTick();
  const { virtualRef, offset = 12 } = props;
  const refElement = virtualRef || helpElementRef.value;

  if (refElement) {
    const rect = refElement.getBoundingClientRect();
    const popupWidth = popupElementRef.value?.offsetWidth || 0;
    popupStyle.value = {
      top: `${rect.top}px`,
      left: `${rect.left - popupWidth - offset}px`,
    };
  }
});
</script>

<template>
  <span ref="helpElementRef" :class="ns.e('helper')" @click="visible = true">
    <TkIcon :icon="questionFilledIcon" :size="16" />
    <Teleport to="body">
      <Transition :name="ns.joinNamespace('fade-linear')">
        <div
          v-show="visible"
          ref="popupElementRef"
          :style="popupStyle"
          :class="ns.e('helper__popup')"
          @click.stop
          @touchstart.stop
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
