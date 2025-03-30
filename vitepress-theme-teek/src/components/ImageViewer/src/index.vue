<script setup lang="ts" name="ImageViewer">
import { ElImageViewer, ImageViewerProps as ElImageViewerProps } from "element-plus";
import type { Writable } from "element-plus/es/utils";

export type ImageViewerProps = Writable<Partial<ElImageViewerProps>> & { modelValue?: boolean };

defineOptions({ name: "ImageViewer" });

const visible = defineModel({ default: false });

const close = () => {
  document.body.style.overflow = "";
  visible.value = false;
};
</script>

<template>
  <ElImageViewer v-if="visible" v-bind="$attrs" @close="close" />
</template>
