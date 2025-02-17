<script setup lang="ts" name="Icon">
import { useDesign } from "../hooks";
import { computed } from "vue";
import { ElIcon } from "element-plus";
import { isNumber } from "../helper";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("icon");

interface IconProps {
  icon: string;
  iconType?: "svg" | "iconfont" | "img" | "el";
  size?: string | number;
  color?: string;
  hover?: boolean;
  hoverColor?: string;
  imgAlt?: string;
}

const {
  color = "var(--vp-c-text-1)",
  hover = false,
  hoverColor = "var(--tk-theme-color)",
  ...props
} = defineProps<IconProps>();

const sizeStr = computed(() => props.size && (isNumber(props.size) ? `${props.size}px` : props.size));
</script>

<template>
  <i v-if="!iconType || iconType === 'svg'" v-html="icon" :class="[prefixClass, { hover: hover }]" />
  <i v-else-if="iconType === 'iconfont'" :class="[prefixClass, 'iconfont', icon, { hover: hover }]" />
  <img v-else-if="iconType === 'img'" :src="icon" :alt="imgAlt" :class="[prefixClass, { hover: hover }]" />
  <el-icon v-else-if="iconType === 'el'">
    <component :is="icon" :size :class="[prefixClass, { hover: hover }]" />
  </el-icon>
</template>

<style lang="scss" scoped>
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-icon;

i.#{$prefix-class} :deep(svg),
img.#{$prefix-class} {
  fill: v-bind(color);
  width: v-bind(sizeStr);
  height: v-bind(sizeStr);
}

.#{$prefix-class} {
  &.iconfont {
    color: v-bind(color);
    font-size: v-bind(sizeStr);
  }
  &.hover:hover {
    color: v-bind(hoverColor);
  }
}
</style>
