<script setup lang="ts" name="Title">
import { inject } from "vue";
import { useNamespace } from "../../../../hooks";
import { readingEnhanceNsSymbol } from "../readingEnhance";
import Icon, { type TkIconProps } from "../../../Icon";

defineProps<{ title?: string; disabled?: boolean; icon?: TkIconProps["icon"] }>();

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));
</script>

<template>
  <div :class="[ns.e('title'), ns.is('disabled', !!disabled)]">
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" :size="16" style="margin-right: 4px" />
    </slot>

    <slot name="title">
      <span v-if="title">{{ title }}</span>
    </slot>

    <slot />
  </div>
</template>
