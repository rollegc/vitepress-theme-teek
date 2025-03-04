<script setup lang="ts" name="Icon">
import { useNamespace } from "../../../hooks";
import { isString } from "../../../helper";
import { IconProps } from "./icon";
import { useSlots } from "vue";

const ns = useNamespace("icon");

const {
  color = "var(--vp-c-text-1)",
  hover = false,
  hoverColor = "var(--vp-c-brand-1)",
  iconType = "svg",
  ...props
} = defineProps<IconProps>();

const slot = useSlots();

const getStyle = () => {
  return {
    ...props.style,
    "--icon-color": color,
    "--icon-size": props.size && (isString(props.size) ? props.size : `${props.size}px`),
    "--icon-color-hover": hoverColor,
  };
};
</script>

<template>
  <i v-if="slot.default" :class="ns.b()" :style="getStyle()">
    <slot />
  </i>
  <i v-else-if="iconType === 'svg'" v-html="icon" :class="[ns.b(), { hover: hover }]" :style="getStyle()" />
  <i v-else-if="iconType === 'iconfont'" :class="[ns.b(), 'iconfont', icon, { hover: hover }]" :style="getStyle()" />
  <img
    v-else-if="iconType === 'img'"
    :src="icon"
    :alt="imgAlt"
    :class="[ns.b(), { hover: hover }]"
    :style="getStyle()"
  />
  <i v-else-if="iconType === 'component'" :class="ns.b()" :style="getStyle()">
    <component :is="icon" :size :class="[ns.b(), { hover: hover }]" />
  </i>
</template>
