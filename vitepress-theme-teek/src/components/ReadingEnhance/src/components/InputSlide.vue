<script setup lang="ts" name="InputSlide">
import { onMounted, ref, watch } from "vue";
import { useNamespace } from "../../../../hooks";

const ns = useNamespace("input-slide");

interface InputSlideProps {
  name?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  format?: (val: number) => string;
}

const { name = "Slider", min = 0, max = 100, step = 1 } = defineProps<InputSlideProps>();

const inputValue = defineModel<number>({ type: Number, default: 0 });
const hovering = ref(false);
const positioning = ref(false);
const inputSliderRef = ref<HTMLInputElement | null>(null);
const inputSliderTooltipRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!inputSliderRef.value) return;

  inputSliderRef.value.style.setProperty(ns.cssVarName("slider-value"), inputValue.value.toString());
  inputSliderRef.value.style.setProperty(ns.cssVarName("slider-min"), min ? min.toString() : "0");
  inputSliderRef.value.style.setProperty(ns.cssVarName("slider-max"), max ? max.toString() : "100");
  inputSliderRef.value.addEventListener("input", () => {
    if (!inputSliderRef.value) return;

    inputSliderRef.value.style.setProperty(ns.cssVarName("slider-value"), inputSliderRef.value.value.toString());
  });
});

const calTooltipPosition = (inputElement: HTMLInputElement, inputTooltipElement: HTMLDivElement) => {
  if (!inputElement) return;
  if (!inputTooltipElement) return;

  const finalMax = max || 100;
  const finalMin = min || 0;
  const ratio = (inputValue.value - finalMin) / (finalMax - finalMin);

  const rect = inputElement.getBoundingClientRect();
  const tooltipRect = inputTooltipElement.getBoundingClientRect();

  const centeringShift = (tooltipRect.width - 32) / 2;
  inputTooltipElement.style.setProperty("left", `${ratio * (rect.width - 32) - centeringShift}px`);
};

watch(hovering, () => {
  positioning.value = true;

  setTimeout(() => {
    if (!hovering.value) {
      positioning.value = false;
      return;
    }
    if (!inputSliderRef.value) {
      positioning.value = false;
      return;
    }
    if (!inputSliderTooltipRef.value) {
      positioning.value = false;
      return;
    }

    calTooltipPosition(inputSliderRef.value, inputSliderTooltipRef.value);
    positioning.value = false;
  }, 50);
});

watch(inputValue, () => {
  if (!inputSliderRef.value) return;

  if (!inputSliderTooltipRef.value) return;

  calTooltipPosition(inputSliderRef.value, inputSliderTooltipRef.value);
});
</script>

<template>
  <div :class="ns.b()">
    <label :class="ns.e('label')">
      <input
        ref="inputSliderRef"
        v-model.number="inputValue"
        type="range"
        :name="name"
        :min="min"
        :max="max"
        :disabled="disabled"
        :step="step"
        :class="[ns.e('label__input'), ns.e('label__input-progress'), ns.is('disabled', disabled)]"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      />
      <Transition name="fade">
        <span
          v-show="hovering"
          ref="inputSliderTooltipRef"
          :class="[ns.e('label__tooltip'), ns.is('opacity-0', hovering && positioning)]"
        >
          {{ !!format ? format(inputValue) : inputValue }}
        </span>
      </Transition>
    </label>
  </div>
</template>
