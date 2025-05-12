<script setup lang="ts" name="ArticlePage">
import { useNamespace } from "@teek/hooks";
import DocAsideOutline from "./components/DocAsideOutline.vue";

defineOptions({ name: "ArticlePage" });

defineProps<{ doc?: boolean; outline?: boolean; sidebar?: boolean }>();

const ns = useNamespace("article-page");
</script>

<template>
  <div :class="[ns.b(), ns.is('aside', outline)]">
    <div v-if="outline" :class="ns.e('aside')">
      <div :class="ns.e('aside__container')">
        <DocAsideOutline :sidebar />
      </div>
    </div>

    <div :class="[ns.joinNamespace('doc'), { 'vp-doc': doc }]">
      <slot></slot>
    </div>
  </div>
</template>
