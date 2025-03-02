<script setup lang="ts" name="Icon">
import { useNamespace } from "../../../hooks";
import { ElIcon } from "element-plus";
import { isString } from "../../../helper";
import { IconProps } from "./icon";

const ns = useNamespace("icon");

const {
  color = "var(--vp-c-text-1)",
  hover = false,
  hoverColor = "var(--vp-c-brand-1)",
  ...props
} = defineProps<IconProps>();

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
  <i v-if="!iconType || iconType === 'svg'" v-html="icon" :class="[ns.b(), { hover: hover }]" :style="getStyle()" />
  <i v-else-if="iconType === 'iconfont'" :class="[ns.b(), 'iconfont', icon, { hover: hover }]" :style="getStyle()" />
  <img
    v-else-if="iconType === 'img'"
    :src="icon"
    :alt="imgAlt"
    :class="[ns.b(), { hover: hover }]"
    :style="getStyle()"
  />
  <el-icon v-else-if="iconType === 'el'" :style="getStyle()">
    <component :is="icon" :size :class="[ns.b(), { hover: hover }]" />
  </el-icon>
  <slot v-else />
</template>
