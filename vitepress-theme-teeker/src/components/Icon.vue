<script setup lang="ts" name="Icon">
import { useDesign } from "../hooks";
import { ElIcon } from "element-plus";
import { isString } from "../helper";

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
  hoverColor = "var(--vp-c-brand-1)",
  ...props
} = defineProps<IconProps>();

const getStyle = () => {
  return {
    "--icon-color": color,
    "--icon-size": props.size && (isString(props.size) ? props.size : `${props.size}px`),
    "--icon-color-hover": hoverColor,
  };
};
</script>

<template>
  <span :style="getStyle()">
    <i v-if="!iconType || iconType === 'svg'" v-html="icon" :class="[prefixClass, { hover: hover }]" />
    <i v-else-if="iconType === 'iconfont'" :class="[prefixClass, 'iconfont', icon, { hover: hover }]" />
    <img v-else-if="iconType === 'img'" :src="icon" :alt="imgAlt" :class="[prefixClass, { hover: hover }]" />
    <el-icon v-else-if="iconType === 'el'">
      <component :is="icon" :size :class="[prefixClass, { hover: hover }]" />
    </el-icon>
  </span>
</template>
