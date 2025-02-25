<script setup lang="ts" name="Icon">
import { useNamespace } from "../hooks";
import { ElIcon } from "element-plus";
import { isString } from "../helper";

const ns = useNamespace("icon");

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
    <i v-if="!iconType || iconType === 'svg'" v-html="icon" :class="[ns.b(), { hover: hover }]" />
    <i v-else-if="iconType === 'iconfont'" :class="[ns.b(), 'iconfont', icon, { hover: hover }]" />
    <img v-else-if="iconType === 'img'" :src="icon" :alt="imgAlt" :class="[ns.b(), { hover: hover }]" />
    <el-icon v-else-if="iconType === 'el'">
      <component :is="icon" :size :class="[ns.b(), { hover: hover }]" />
    </el-icon>
  </span>
</template>
